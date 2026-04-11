import { useState, useEffect, useRef } from "react";
import { projectService, ProjectConfig, ScanRecord } from "@/lib/projectService";

export type AuthStatus = "guest" | "authenticating" | "logged_in" | "blocked" | "error";

export function useRemoteScan(projectId: string, ownerUid: string | null) {
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("guest");
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [deviceIp, setDeviceIp] = useState("");
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ownerUid || !projectId) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        // 1. Get Device IP
        const ipRes = await fetch("https://api.ipify.org?format=json").catch(() => ({ json: () => ({ ip: "unknown" }) }));
        const ipData = await (ipRes as any).json();
        const currentIp = ipData.ip;
        setDeviceIp(currentIp);

        // 2. Check Blacklist
        const unsubBlocked = projectService.subscribeToBlockedIps(ownerUid, projectId, (blockedIps) => {
          if (blockedIps.includes(currentIp)) {
            setAuthStatus("blocked");
          }
        });

        // 3. Session Manager
        const sessionKey = `scan_session_${projectId}`;
        let sid = sessionStorage.getItem(sessionKey);
        if (!sid) {
          sid = Math.random().toString(36).substring(7);
          sessionStorage.setItem(sessionKey, sid);
        }
        sessionIdRef.current = sid;

        setLoading(false);
        return () => unsubBlocked();
      } catch (err) {
        setAuthStatus("error");
        setLoading(false);
      }
    };

    init();
  }, [projectId, ownerUid]);

  const login = async () => {
    if (!ownerUid) return;
    setAuthStatus("authenticating");
    
    projectService.subscribeToCollaborators(ownerUid, projectId, async (cols) => {
      const user = cols.find(c => c.username === userData.username && c.password === userData.password);
      if (user) {
        await projectService.registerSession(ownerUid, projectId, {
          id: sessionIdRef.current!,
          ip: deviceIp,
          device: navigator.userAgent.split(')')[0].split('(')[1] || "Mobile Device",
          username: user.username
        });

        projectService.getProject(ownerUid, projectId, (pData) => {
          setProject(pData);
          setAuthStatus("logged_in");
        });
      } else {
        alert("Sai tài khoản hoặc mật khẩu!");
        setAuthStatus("guest");
      }
    });
  };

  const submitRecord = async (mssv: string, extraData: Record<string, string> = {}, scanType: "Camera" | "Manual") => {
    if (!ownerUid || !project) return;
    setIsSyncing(true);
    
    try {
      const fullData: Record<string, string> = {
        scanDevice: "Mobile",
        scanIp: deviceIp,
        scanType: scanType,
        username: userData.username,
        ...extraData
      };
      
      // Ensure all project fields exist in record
      project.fields.forEach(field => {
        if (field.id !== "mssv" && !fullData[field.id]) fullData[field.id] = "";
      });

      await projectService.addRecord(ownerUid, projectId, { mssv, data: fullData });
      setLastScanned(mssv);
      setTimeout(() => setLastScanned(null), 2500);
      return true;
    } catch (err) {
      alert("Lỗi: " + (err as any).message);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    project,
    loading,
    authStatus,
    userData,
    setUserData,
    deviceIp,
    lastScanned,
    isSyncing,
    login,
    submitRecord
  };
}

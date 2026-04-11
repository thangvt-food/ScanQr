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
  
  const [debugLog, setDebugLog] = useState<string[]>(["Waiting for URL parameters..."]);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("RemoteScan Effect Run", { ownerUid, projectId });
    if (!ownerUid || !projectId) return;

    const init = async () => {
      setDebugLog(prev => [...prev, "IDs detected. Initializing process..."]);
      const timeout = setTimeout(() => {
        if (loading) {
          setAuthStatus("error");
          setLoading(false);
        }
      }, 7000); // 7 second timeout for mobile connections

      try {
        // 1. Get Device IP
        setDebugLog(prev => [...prev, "Step 1: Fetching device IP..."]);
        let currentIp = "unknown";
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(4000) });
          const ipData = await ipRes.json();
          currentIp = ipData.ip;
          setDebugLog(prev => [...prev, `IP detected: ${currentIp}`]);
        } catch (e) {
          console.warn("IP fetch failed, continuing as unknown");
          setDebugLog(prev => [...prev, "IP detection failed (Network block?), using unknown"]);
        }
        setDeviceIp(currentIp);

        // 2. Check Blacklist
        setDebugLog(prev => [...prev, "Step 2: Connecting to Firebase Blacklist..."]);
        const unsubBlocked = projectService.subscribeToBlockedIps(ownerUid, projectId, (blockedIps) => {
          setDebugLog(prev => [...prev, "Firebase response received."]);
          if (blockedIps.includes(currentIp)) {
            setAuthStatus("blocked");
          }
        }, (error) => {
          setDebugLog(prev => [...prev, `FIREBASE ERROR: ${error.message}`]);
          if (error.message.includes("permission_denied")) {
             setDebugLog(prev => [...prev, "HINT: Check your Firebase Database Rules!"]);
          }
        });

        // 3. Session Manager
        setDebugLog(prev => [...prev, "Step 3: Preparing session storage..."]);
        const sessionKey = `scan_session_${projectId}`;
        let sid = sessionStorage.getItem(sessionKey);
        if (!sid) {
          sid = Math.random().toString(36).substring(7);
          sessionStorage.setItem(sessionKey, sid);
        }
        sessionIdRef.current = sid;

        setDebugLog(prev => [...prev, "Step 4: Registering active session via API..."]);
        const sessionPayload = {
          id: sid,
          ip: currentIp,
          device: navigator.userAgent.split(')')[0].split('(')[1] || "Mobile Device"
        };

        const res = await fetch("/api/remote/session", {
          method: "POST",
          body: JSON.stringify({ ownerUid, projectId, session: sessionPayload })
        });

        if (!res.ok) throw new Error("API Session Registration Failed");

        clearTimeout(timeout);
        setDebugLog(prev => [...prev, "INIT COMPLETE."]);
        setLoading(false);
        return () => unsubBlocked();
      } catch (err) {
        clearTimeout(timeout);
        const errMsg = (err as any).message || "Unknown error";
        setDebugLog(prev => [...prev, `CRITICAL ERROR: ${errMsg}`]);
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
        // Register Session with Username
        await fetch("/api/remote/session", {
           method: "POST",
           body: JSON.stringify({ 
             ownerUid, 
             projectId, 
             session: {
               id: sessionIdRef.current!,
               ip: deviceIp,
               device: navigator.userAgent.split(')')[0].split('(')[1] || "Mobile Device",
               username: user.username
             }
           })
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

      const res = await fetch("/api/remote/record", {
        method: "POST",
        body: JSON.stringify({ 
          ownerUid, 
          projectId, 
          record: { mssv, data: fullData } 
        })
      });

      if (!res.ok) throw new Error("API Record Submit Failed");

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
    debugLog,
    login,
    submitRecord
  };
}

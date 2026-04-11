"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectService, ProjectConfig } from "@/lib/projectService";
import Scanner from "@/components/scanner/Scanner";
import { 
  QrCode, 
  Smartphone, 
  UserCheck, 
  ShieldAlert,
  Loader2,
  CheckCircle2,
  LogOut
} from "lucide-react";

export default function RemoteScanPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"connecting" | "active" | "duplicate" | "error">("connecting");
  const [showScanner, setShowScanner] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [deviceIp, setDeviceIp] = useState<string>("");
  
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const ownerUid = urlParams.get("uid");

        if (!ownerUid) {
          setStatus("error");
          setLoading(false);
          return;
        }

        // 1. Fetch Device IP
        const ipRes = await fetch("https://api.ipify.org?format=json").catch(() => ({ json: () => ({ ip: "unknown" }) }));
        const ipData = await (ipRes as any).json();
        const currentIp = ipData.ip;
        setDeviceIp(currentIp);

        // 2. Multi-Session Check (Single tab per device)
        const sessionKey = `scan_session_${projectId}`;
        let sid = sessionStorage.getItem(sessionKey);
        if (!sid) {
           sid = Math.random().toString(36).substring(7);
           sessionStorage.setItem(sessionKey, sid);
        }
        sessionIdRef.current = sid;

        // 3. Register Session in RTDB
        await projectService.registerSession(ownerUid, projectId, {
          id: sid,
          ip: currentIp,
          device: navigator.userAgent.split(')')[0].split('(')[1] || "Mobile Device"
        });

        // 4. Heartbeat
        const heartbeatInterval = setInterval(() => {
          projectService.updateSessionHeartbeat(ownerUid, projectId, sid!);
        }, 10000); // Every 10s

        // 5. Fetch Project & Start Listen
        const unsubProject = projectService.getProject(ownerUid, projectId, (data) => {
          if (data) {
            setProject(data);
            setStatus("active");
          } else {
            setStatus("error");
          }
          setLoading(false);
        });

        return () => {
          clearInterval(heartbeatInterval);
          unsubProject();
          projectService.removeSession(ownerUid, projectId, sid!);
        };

      } catch (err) {
        console.error(err);
        setStatus("error");
        setLoading(false);
      }
    };

    initSession();
  }, [projectId]);

  const handleScanSuccess = async (decodedText: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const ownerUid = urlParams.get("uid");
    
    if (!ownerUid || !project) return;

    try {
      const mssv = decodedText.trim();
      
      const initialData: Record<string, string> = {
        scanDevice: "Mobile",
        scanIp: deviceIp,
        scanType: "Remote"
      };
      
      project.fields.forEach(field => {
        if (field.id !== "mssv") initialData[field.id] = "";
      });

      await projectService.addRecord(ownerUid, projectId, { mssv, data: initialData });
      setLastScanned(mssv);
      setShowScanner(false);
      
      // Auto-reopen scanner after 2 seconds for continuous multi-scanning
      setTimeout(() => setLastScanned(null), 2000);
    } catch (err) {
      alert("Lỗi khi gửi dữ liệu: " + (err as any).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 size={40} className="text-office-primary animate-spin" />
        <p className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Connecting to Project...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-8 text-center space-y-6">
        <ShieldAlert size={64} className="text-office-error-text" />
        <h1 className="text-xl font-bold text-office-text">Link không hợp lệ</h1>
        <p className="office-sm text-office-text-secondary">Vui lòng yêu cầu Admin cung cấp link quét mã mới.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-office-bg p-4 flex flex-col">
      {/* Mobile Header */}
      <div className="office-card p-4 flex items-center justify-between shadow-sm border-b-2 border-office-primary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-office-primary rounded-full flex items-center justify-center text-white">
            <Smartphone size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-office-text uppercase truncate max-w-[150px]">{project?.name}</h1>
            <p className="text-[10px] text-office-success-text font-bold uppercase tracking-wider">Mobile Client Active</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-office-text-muted font-bold">DEVICE IP</p>
           <p className="office-xs font-mono font-bold text-office-text">{deviceIp}</p>
        </div>
      </div>

      {/* Main Action Area */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-8 py-10">
        {lastScanned ? (
          <div className="office-card p-8 text-center space-y-4 animate-in zoom-in duration-300 border-2 border-office-success-text/30">
            <div className="w-16 h-16 bg-office-success-bg/20 text-office-success-text rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-1">
               <h2 className="text-lg font-bold text-office-text uppercase">Quét thành công!</h2>
               <p className="office-sm font-mono text-office-primary font-bold">{lastScanned}</p>
            </div>
            <p className="office-xs text-office-text-secondary">Dữ liệu đã được gửi về máy chủ Admin.</p>
          </div>
        ) : (
          <div className="text-center space-y-6 w-full max-w-xs">
            <div className="p-8 bg-white rounded-office shadow-office border border-office-border">
              <QrCode size={120} className="mx-auto text-office-primary/20" />
            </div>
            <button 
              onClick={() => setShowScanner(true)}
              className="office-btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
            >
              <QrCode size={24} /> BẮT ĐẦU QUÉT
            </button>
            <div className="flex items-center justify-center gap-2 text-office-text-muted">
               <UserCheck size={14} />
               <span className="office-xs font-bold uppercase tracking-widest">Single-session Secure</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center">
        <p className="office-xs text-office-text-muted italic">Mọi hoạt động đều được ghi lại với IP: {deviceIp}</p>
      </footer>

      {showScanner && (
        <Scanner 
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

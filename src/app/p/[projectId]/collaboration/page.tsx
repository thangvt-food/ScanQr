"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig } from "@/lib/projectService";
import { 
  Smartphone, 
  Copy, 
  Share2, 
  Users, 
  ShieldCheck, 
  ExternalLink,
  Wifi,
  Trash2,
  Clock
} from "lucide-react";

export default function CollaborationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) return;
    
    // Subscribe to project info
    const unsubProject = projectService.getProject(user.uid, projectId, setProject);
    
    // Subscribe to active scanning sessions
    const unsubSessions = projectService.subscribeToSessions(user.uid, projectId, (data) => {
      setActiveSessions(data);
      setLoading(false);
    });

    return () => {
      unsubProject();
      unsubSessions();
    };
  }, [user, projectId]);

  const remoteScanUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${projectId}/remote-scan?uid=${user?.uid}` 
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(remoteScanUrl);
    alert("Đã sao chép link quét mã từ xa!");
  };

  const handleKick = (sessionId: string) => {
    if (confirm("Ngắt kết nối thiết bị này?")) {
      projectService.removeSession(user!.uid, projectId, sessionId);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-office-text uppercase tracking-widest flex items-center gap-3">
          <Users size={24} className="text-office-primary" />
          Collaboration Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Link Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="office-card p-6 space-y-4">
            <div className="flex items-center gap-3 text-office-primary">
              <Share2 size={24} />
              <h3 className="office-sm font-bold uppercase tracking-tight">Remote Scan Link</h3>
            </div>
            
            <p className="office-xs text-office-text-secondary leading-tight">
              Chia sẻ link này để người khác có thể dùng điện thoại quét mã và đẩy dữ liệu trực tiếp vào dự án này.
            </p>

            <div className="p-3 bg-office-bg rounded-office border border-office-border space-y-3">
               <div className="flex gap-2">
                  <input 
                    readOnly
                    value={remoteScanUrl}
                    className="flex-1 bg-white border border-office-border rounded-office px-3 py-2 office-xs font-mono text-office-text-secondary truncate shadow-inner"
                  />
                  <button onClick={handleCopy} className="office-btn-primary p-2">
                    <Copy size={18} />
                  </button>
               </div>
               <a 
                 href={remoteScanUrl} 
                 target="_blank" 
                 className="flex items-center justify-center gap-2 w-full office-btn-secondary py-2 office-xs"
               >
                 Test Scanner <ExternalLink size={14} />
               </a>
            </div>

            <div className="bg-office-success-bg/10 p-4 rounded-office border border-office-success-text/10 flex gap-3 text-office-success-text">
               <ShieldCheck size={20} className="shrink-0" />
               <p className="office-xs italic">Quyền truy cập được giới hạn: Chỉ có thể quét mã, không thể xem cấu hình dự án.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Active Devices */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest flex items-center gap-2">
               <Wifi size={16} className="text-green-500" /> 
               Active Scanners ({activeSessions.length})
             </h3>
             <button 
               onClick={() => projectService.clearRecords(user!.uid, projectId)} // Note: Changed to cleanupSessions if needed
               className="office-xs text-office-error-text hover:underline font-bold"
             >
               Force Logout All
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.length === 0 ? (
              <div className="col-span-full office-card p-12 text-center bg-office-header/30 border-dashed border-2">
                <Smartphone size={40} className="mx-auto text-office-text-muted mb-3 opacity-20" />
                <p className="office-sm text-office-text-muted">No devices currently connected.</p>
              </div>
            ) : (
              activeSessions.map((session) => (
                <div key={session.id} className="office-card p-4 hover:border-office-primary transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-office-primary/10 text-office-primary rounded-office">
                        <Smartphone size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="office-sm font-bold text-office-text truncate">{session.device}</p>
                        <p className="office-xs font-mono text-office-text-secondary">IP: {session.ip}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleKick(session.id)}
                      className="text-office-text-muted hover:text-office-error-text transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-4 pt-3 border-t border-office-border flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-green-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Now
                    </span>
                    <span className="text-office-text-muted flex items-center gap-1">
                      <Clock size={10} /> {new Date(session.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Clock,
  Plus,
  ShieldAlert,
  UserPlus,
  Ban,
  Lock,
  QrCode
} from "lucide-react";

export default function CollaborationPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newColab, setNewColab] = useState({ username: "", password: "" });
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!user || !projectId) return;
    
    const unsubProject = projectService.getProject(user.uid, projectId, setProject);
    const unsubSessions = projectService.subscribeToSessions(user.uid, projectId, setActiveSessions);
    const unsubColabs = projectService.subscribeToCollaborators(user.uid, projectId, setCollaborators);
    const unsubBlocked = projectService.subscribeToBlockedIps(user.uid, projectId, setBlockedIps);

    setLoading(false);
    return () => {
      unsubProject();
      unsubSessions();
      unsubColabs();
      unsubBlocked();
    };
  }, [user, projectId]);

  const remoteScanUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/p/${projectId}/remote-scan?uid=${user?.uid}` 
    : "";

  const handleAddCollaborator = async () => {
    if (!newColab.username || !newColab.password) return;
    await projectService.addCollaborator(user!.uid, projectId, newColab);
    setNewColab({ username: "", password: "" });
  };

  const handleBlockIp = async (ip: string) => {
    if (confirm(`Chặn IP ${ip}? Thiết bị này sẽ không thể truy cập lại.`)) {
      await projectService.blockIp(user!.uid, projectId, ip);
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-office-surface p-6 rounded-office border border-office-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-office-primary text-white rounded-office shadow-lg">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-office-text uppercase tracking-widest">Collaboration & Security</h1>
            <p className="office-xs text-office-text-secondary">Quản lý đội ngũ quét mã và cấu hình bảo mật thiết bị.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setShowQr(!showQr)}
             className={`office-btn-secondary flex items-center gap-2 ${showQr ? 'bg-office-primary/10 border-office-primary text-office-primary' : ''}`}
           >
             <QrCode size={18} /> {showQr ? "Hide QR" : "Show Access QR"}
           </button>
           <button onClick={() => {
              navigator.clipboard.writeText(remoteScanUrl);
              alert("Đã copy link!");
           }} className="office-btn-primary flex items-center gap-2">
             <Copy size={18} /> Copy Link
           </button>
        </div>
      </div>

      {showQr && (
        <div className="office-card p-8 flex flex-col items-center justify-center space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-white rounded-office shadow-inner border-2 border-office-primary/20">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(remoteScanUrl)}`}
              alt="Access QR"
              className="w-48 h-48"
            />
          </div>
          <p className="office-sm font-bold text-office-text uppercase">Quét mã để truy cập nhanh từ Mobile</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Management */}
        <div className="space-y-6 lg:col-span-1">
          <div className="office-card overflow-hidden">
            <div className="bg-office-header px-4 py-3 border-b border-office-border flex items-center gap-2 font-bold office-xs text-office-text-secondary uppercase">
               <UserPlus size={16} /> Phát hành tài khoản
            </div>
            <div className="p-4 space-y-4">
               <div className="space-y-2">
                  <input 
                    placeholder="Username"
                    className="w-full office-bg border border-office-border rounded-office px-3 py-2 office-sm outline-none focus:border-office-primary"
                    value={newColab.username}
                    onChange={e => setNewColab({...newColab, username: e.target.value})}
                  />
                  <input 
                    placeholder="Password"
                    className="w-full office-bg border border-office-border rounded-office px-3 py-2 office-sm outline-none focus:border-office-primary"
                    value={newColab.password}
                    onChange={e => setNewColab({...newColab, password: e.target.value})}
                  />
                  <button onClick={handleAddCollaborator} className="w-full office-btn-primary py-2 office-sm">Tạo tài quản</button>
               </div>

               <div className="h-px bg-office-border" />

               <div className="space-y-2 max-h-[300px] overflow-auto">
                  <p className="office-xs font-bold text-office-text-muted uppercase tracking-widest px-1">Danh sách tài khoản</p>
                  {collaborators.map(col => (
                    <div key={col.username} className="flex items-center justify-between p-2 bg-office-bg rounded-office hover:bg-office-primary/5 transition-colors">
                       <div>
                          <p className="office-sm font-bold text-office-text">{col.username}</p>
                          <p className="office-xs text-office-text-secondary flex items-center gap-1 font-mono uppercase">
                             <Lock size={10} /> {col.password}
                          </p>
                       </div>
                       <button onClick={() => projectService.removeCollaborator(user!.uid, projectId, col.username)} className="text-office-text-muted hover:text-office-error-text">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="office-card overflow-hidden border-office-error-text/20">
            <div className="bg-office-error-bg/20 px-4 py-3 border-b border-office-error-text/10 flex items-center gap-2 font-bold office-xs text-office-error-text uppercase">
               <Ban size={16} /> IP Blacklist
            </div>
            <div className="p-4 space-y-4">
               {blockedIps.length === 0 ? (
                 <p className="office-xs text-office-text-muted italic text-center py-4">Chưa có IP bị chặn.</p>
               ) : (
                 <div className="space-y-2">
                    {blockedIps.map(ip => (
                      <div key={ip} className="flex items-center justify-between p-2 bg-red-50 rounded-office text-red-700">
                         <span className="office-xs font-mono font-bold">{ip}</span>
                         <button onClick={() => projectService.unblockIp(user!.uid, projectId, ip)} className="office-xs font-bold underline">Gỡ bỏ</button>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-center px-2">
             <h2 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest flex items-center gap-2">
               <Wifi size={16} className="text-green-500" /> Active Scanners ({activeSessions.length})
             </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {activeSessions.map((session) => {
               const isBlocked = blockedIps.includes(session.ip);
               return (
                <div key={session.id} className={`office-card p-4 transition-all relative ${isBlocked ? 'opacity-50 grayscale' : 'hover:border-office-primary'}`}>
                  {isBlocked && <div className="absolute inset-0 bg-white/40 flex items-center justify-center font-bold text-office-error-text text-sm uppercase tracking-widest -rotate-6">BLOCKED</div>}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-office ${isBlocked ? 'bg-office-text-muted' : 'bg-office-primary/10 text-office-primary'}`}>
                        <Smartphone size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="office-sm font-bold text-office-text truncate">{session.username || "Guest Device"}</p>
                          {session.device?.includes("iPhone") ? <span className="text-[9px] bg-gray-100 px-1 rounded">iOS</span> : <span className="text-[9px] bg-gray-100 px-1 rounded">Android</span>}
                        </div>
                        <p className="office-xs font-mono text-office-text-secondary">{session.ip}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        disabled={isBlocked}
                        onClick={() => handleBlockIp(session.ip)}
                        className="p-1.5 text-office-text-muted hover:text-office-error-text hover:bg-office-error-bg/10 rounded-office transition-colors"
                        title="Block IP"
                      >
                        <Ban size={16} />
                      </button>
                      <button 
                        onClick={() => projectService.removeSession(user!.uid, projectId, session.id)}
                        className="p-1.5 text-office-text-muted hover:text-office-primary hover:bg-office-primary/10 rounded-office transition-colors"
                        title="Kick Session"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-office-border flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className={isBlocked ? "text-office-text-muted" : "text-green-600 flex items-center gap-1"}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-office-text-muted' : 'bg-green-500 animate-pulse'}`} /> 
                      {isBlocked ? "Connection Denied" : "Sync Active"}
                    </span>
                    <span className="text-office-text-muted flex items-center gap-1">
                      <Clock size={10} /> {new Date(session.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
               );
             })}

             {activeSessions.length === 0 && (
               <div className="col-span-full py-20 text-center space-y-4 office-card border-dashed">
                  <Smartphone className="mx-auto text-office-text-muted opacity-10" size={64} />
                  <p className="office-sm text-office-text-muted font-bold uppercase tracking-widest">No devices connected</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

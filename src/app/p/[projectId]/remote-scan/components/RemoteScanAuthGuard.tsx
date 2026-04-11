"use client";

import React from "react";
import { ShieldAlert, UserCheck, User, Key, Loader2, ChevronRight } from "lucide-react";
import { AuthStatus } from "../hooks/useRemoteScan";

interface RemoteScanAuthGuardProps {
  status: AuthStatus;
  deviceIp: string;
  userData: { username: string; password: string };
  setUserData: (data: any) => void;
  onLogin: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const RemoteScanAuthGuard: React.FC<RemoteScanAuthGuardProps> = ({ 
  status, 
  deviceIp, 
  userData, 
  setUserData, 
  onLogin, 
  children 
}) => {
  if (status === "blocked") {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-8 text-center space-y-4">
        <ShieldAlert size={64} className="text-office-error-text" />
        <h1 className="text-xl font-bold text-office-text uppercase tracking-widest">Truy cập bị chặn</h1>
        <p className="office-sm text-office-text-secondary">IP ({deviceIp}) đã bị Admin chặn quyền truy cập.</p>
      </div>
    );
  }

  if (status === "guest" || status === "authenticating") {
    return (
      <div className="min-h-screen bg-office-header flex flex-col items-center justify-center p-6">
        <div className="office-card w-full max-w-sm p-8 space-y-6 shadow-2xl border-t-4 border-office-primary">
          <div className="text-center space-y-2">
            <div className="p-3 bg-office-primary text-white rounded-full inline-block shadow-lg">
              <UserCheck size={32} />
            </div>
            <h1 className="text-xl font-bold text-office-text uppercase tracking-widest">Collaborator Login</h1>
            <p className="office-xs text-office-text-muted italic">Vui lòng dùng tài khoản do Admin cấp</p>
          </div>

          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="office-xs font-bold text-office-text-secondary uppercase">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted" size={16} />
                <input 
                  type="text" required
                  className="w-full bg-office-bg border border-office-border rounded-office py-2.5 pl-10 pr-4 office-sm focus:border-office-primary outline-none transition-all"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="office-xs font-bold text-office-text-secondary uppercase">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted" size={16} />
                <input 
                  type="password" required
                  className="w-full bg-office-bg border border-office-border rounded-office py-2.5 pl-10 pr-4 office-sm focus:border-office-primary outline-none transition-all"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
              </div>
            </div>
            <button 
              disabled={status === "authenticating"}
              className="office-btn-primary w-full py-3 flex items-center justify-center gap-2 text-base shadow-lg"
            >
              {status === "authenticating" ? <Loader2 className="animate-spin" /> : <>ĐĂNG NHẬP <ChevronRight size={18} /></>}
            </button>
          </form>
          <p className="office-xs text-center text-office-text-muted font-mono uppercase">Device IP: {deviceIp}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-8 text-center">
        <ShieldAlert size={64} className="text-office-error-text mb-4" />
        <h1 className="text-xl font-bold text-office-text uppercase">Link không hợp lệ</h1>
        <p className="office-sm text-office-text-secondary mt-2">Vui lòng yêu cầu Admin cung cấp link quét mã mới.</p>
      </div>
    );
  }

  return <>{children}</>;
};

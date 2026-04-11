"use client";

import React from "react";
import { 
  Users, 
  QrCode, 
  CheckCircle, 
  Clock,
  LayoutDashboard
} from "lucide-react";
import { ProjectManager } from "@/components/dashboard/ProjectManager";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-office-bg p-8 rounded-office border-2 border-dashed border-office-border max-w-md">
          <LayoutDashboard size={48} className="mx-auto text-office-primary mb-4" />
          <h1 className="text-2xl font-bold text-office-text mb-2 uppercase tracking-tight">Không gian làm việc</h1>
          <p className="text-office-text-secondary office-sm mb-8">
            Vui lòng đăng nhập bằng tài khoản của bạn để quản lý các dự án quét mã QR và đồng bộ hóa với Google Sheets.
          </p>
          <button 
            onClick={() => login()}
            className="office-btn-primary w-full py-3 text-lg"
          >
            Bắt đầu ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-office-text tracking-tight uppercase">Trung tâm điều khiển</h1>
          <p className="text-office-text-secondary office-sm">Đang quản lý dự án cho {user.displayName || user.email}</p>
        </div>
      </div>

      {/* Main Content: Project List */}
      <div className="pt-4">
        <ProjectManager />
      </div>

      {/* Workspace Footer Info */}
      <div className="bg-office-header border border-office-border p-4 rounded-office flex items-center gap-4">
        <div className="bg-office-success-bg p-2 rounded-full">
          <CheckCircle size={16} className="text-office-success-text" />
        </div>
        <p className="office-xs text-office-text-secondary">
          <span className="font-bold text-office-text">Cloud Sync Active.</span> Your projects are securely stored in Firebase RTDB and session tokens are managed server-side.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

"use client";

import React from "react";
import { Settings, Shield, Bell, Monitor, User, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AppSettingsPage() {
  const { user, login, logout } = useAuth();

  const handleSwitchAccount = async () => {
    await logout();
    await login();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-office-primary rounded-office text-white shadow-lg shadow-office-primary/20">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-office-text uppercase tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-office-text-secondary office-sm">Quản lý tài khoản và tùy chỉnh ứng dụng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Management Section */}
        <section className="office-card p-6 space-y-5 md:col-span-2">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-3 border-b border-office-border pb-3">
            <User size={18} className="text-office-primary" /> Quản lý tài khoản
          </h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-office-primary/10 border-2 border-office-primary/20 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={32} className="text-office-primary" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-office-text leading-tight">{user?.displayName || "Người dùng"}</h3>
                <p className="text-office-text-secondary office-sm">{user?.email}</p>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase border border-green-200">
                  Đang hoạt động
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleSwitchAccount}
                className="office-btn-secondary flex items-center gap-2 py-2.5 px-4"
              >
                <RefreshCw size={16} /> Đổi tài khoản
              </button>
              <button 
                onClick={() => logout()}
                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all office-sm font-bold flex items-center gap-2 py-2.5 px-4 rounded-office shadow-sm"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          </div>
        </section>

        <section className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2 border-b border-office-border pb-2">
            <Monitor size={18} className="text-office-primary" /> Giao diện
          </h2>
          <div className="flex items-center justify-between">
            <span className="office-sm text-office-text-secondary">Chế độ tối (Dark Mode)</span>
            <div className="w-10 h-5 bg-office-bg rounded-full relative border border-office-border grayscale opacity-50 cursor-not-allowed">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full border border-office-border shadow-sm" />
            </div>
          </div>
          <p className="office-xs text-office-text-muted italic">Đang phát triển...</p>
        </section>

        <section className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2 border-b border-office-border pb-2">
            <Shield size={18} className="text-office-primary" /> Bảo mật & Dữ liệu
          </h2>
          <div className="space-y-2">
            <p className="office-sm text-office-text">Xác thực Google OAuth 2.0</p>
            <p className="office-xs text-office-text-secondary leading-relaxed">
              Ứng dụng sử dụng quyền truy cập hạn chế để ghi dữ liệu vào Google Sheets theo cấu hình của từng dự án.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

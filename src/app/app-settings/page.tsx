"use client";

import React from "react";
import { Settings, Shield, Bell, Monitor } from "lucide-react";

export default function AppSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-office-primary rounded-office text-white">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-office-text uppercase tracking-tight">App Settings</h1>
          <p className="text-office-text-secondary office-sm">Cấu hình chung cho toàn bộ ứng dụng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2 border-b border-office-border pb-2">
            <Monitor size={18} className="text-office-primary" /> Giao diện
          </h2>
          <div className="flex items-center justify-between">
            <span className="office-sm text-office-text-secondary">Chế độ tối (Dark Mode)</span>
            <div className="w-10 h-5 bg-office-bg rounded-full relative border border-office-border">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full border border-office-border shadow-sm" />
            </div>
          </div>
          <p className="office-xs text-office-text-muted italic">Coming soon...</p>
        </section>

        <section className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2 border-b border-office-border pb-2">
            <Shield size={18} className="text-office-primary" /> Bảo mật
          </h2>
          <div className="space-y-2">
            <p className="office-sm text-office-text">Tích hợp tài khoản Google</p>
            <p className="office-xs text-office-text-secondary leading-relaxed">
              Dữ liệu của bạn được đồng bộ trực tiếp với Google Sheets cá nhân. Chúng tôi không lưu trữ nội dung file của bạn.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

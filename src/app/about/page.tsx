"use client";

import React from "react";
import { User, Globe, Mail, Code2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 text-center py-12">
      <div className="relative inline-flex items-center justify-center mb-6">
        {/* Human Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl z-20 -mr-4 bg-office-bg">
          <img src="/human.png" alt="Human Developer" className="w-full h-full object-cover" />
        </div>
        
        {/* Collaboration Icon */}
        <div className="w-10 h-10 bg-office-primary rounded-full flex items-center justify-center text-white shadow-lg z-30 border-2 border-white">
          <span className="text-lg font-bold">×</span>
        </div>

        {/* Agent Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl z-20 -ml-4 bg-office-bg">
          <img src="/agent.jpg" alt="Agent Developer" className="w-full h-full object-cover" />
        </div>

        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-office-primary/10 blur-3xl rounded-full -z-10 animate-pulse" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-office-text uppercase tracking-tighter">Thông tin phát triển</h1>
        <p className="text-office-text-secondary mt-2">Hệ thống được kiến tạo bởi sự kết hợp hoàn hảo giữa <span className="font-bold text-office-primary">Agent</span> và <span className="font-bold text-office-primary">Human</span>.</p>
      </div>

      <div className="office-card p-8 grid grid-cols-1 gap-6 text-left relative overflow-hidden">
        {/* Subtle accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-office-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Globe size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Website dự án</p>
            <p className="office-sm text-office-text">www.scanqr-pro.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Mail size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Liên hệ Email</p>
            <p className="office-sm text-office-text">acczaao12@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Code2 size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Mã nguồn mở (GitHub)</p>
            <p className="office-sm text-office-text">github.com/aczaao12/ScanQr</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="office-xs text-office-text-muted italic">
          Phiên bản 2.0.0 - Bản phát hành chính thức hỗ trợ Multi-Project.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-office-bg rounded-full border border-office-border/50">
          <div className="w-2 h-2 bg-office-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-office-text-secondary uppercase tracking-widest">Team Agent & Human Collaboration</span>
        </div>
      </div>
    </div>
  );
}

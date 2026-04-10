"use client";

import React from "react";
import { User, Globe, Mail, Code2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 text-center py-12">
      <div className="inline-block p-4 bg-office-primary/10 rounded-full text-office-primary mb-4">
        <User size={48} />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-office-text uppercase tracking-tighter">Developer Information</h1>
        <p className="text-office-text-secondary mt-2">Hệ thống được phát triển bởi đội ngũ ScanQR Team.</p>
      </div>

      <div className="office-card p-8 grid grid-cols-1 gap-6 text-left">
        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Globe size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Website</p>
            <p className="office-sm text-office-text">www.scanqr-pro.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Mail size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Contact Email</p>
            <p className="office-sm text-office-text">support@scanqr-pro.com</p>
          </div>
        </div>

        <div className="flex items-center gap-4 group">
          <div className="p-3 bg-office-bg rounded-office group-hover:bg-office-primary/10 transition-colors">
            <Code2 size={20} className="text-office-primary" />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Open Source</p>
            <p className="office-sm text-office-text">github.com/scanqr-team/webapp</p>
          </div>
        </div>
      </div>

      <p className="office-xs text-office-text-muted italic">
        Phiên bản 2.0.0 - Bản phát hành chính thức hỗ trợ Multi-Project.
      </p>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface RemoteScanStatusProps {
  mssv: string | null;
}

export const RemoteScanStatus: React.FC<RemoteScanStatusProps> = ({ mssv }) => {
  if (!mssv) return null;

  return (
    <div className="office-card p-8 text-center space-y-4 animate-in zoom-in duration-300 border-2 border-office-success-text/30 shadow-2xl">
      <div className="w-16 h-16 bg-office-success-bg/20 text-office-success-text rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 size={40} />
      </div>
      <div className="space-y-1">
         <h2 className="text-lg font-bold text-office-text uppercase tracking-widest">Gửi thành công!</h2>
         <p className="office-sm font-mono text-office-primary font-bold tracking-widest bg-office-bg px-4 py-1 rounded-office">{mssv}</p>
      </div>
      <p className="office-xs text-office-text-secondary">Dữ liệu đã được lưu trữ an toàn trong GSheet.</p>
    </div>
  );
};

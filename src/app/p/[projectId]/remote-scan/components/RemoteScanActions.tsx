"use client";

import React from "react";
import { Camera } from "lucide-react";

interface RemoteScanActionsProps {
  onOpenScanner: () => void;
}

export const RemoteScanActions: React.FC<RemoteScanActionsProps> = ({ onOpenScanner }) => {
  return (
    <button 
      onClick={onOpenScanner}
      className="office-card group w-full p-8 flex flex-col items-center space-y-4 hover:border-office-primary transition-all active:scale-95 shadow-xl border-2"
    >
      <div className="p-5 bg-office-primary/10 text-office-primary rounded-full group-hover:bg-office-primary group-hover:text-white transition-all shadow-inner">
        <Camera size={56} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-office-text uppercase tracking-widest">Mở Camera Quét</h3>
        <p className="office-xs text-office-text-muted mt-1 uppercase font-bold tracking-widest opacity-70">Tự động đồng bộ hóa</p>
      </div>
    </button>
  );
};

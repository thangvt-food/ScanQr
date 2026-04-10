"use client";

import React from "react";
import { QrCode, Plus } from "lucide-react";

interface ScannerStatsProps {
  totalRecords: number;
  pendingSync: number;
  onOpenScanner: () => void;
  onClearData: () => void;
}

export const ScannerStats: React.FC<ScannerStatsProps> = ({ 
  totalRecords, 
  pendingSync, 
  onOpenScanner, 
  onClearData 
}) => {
  return (
    <div className="space-y-4">
      <div className="office-card p-6 text-center space-y-4 bg-office-header">
        <div className="w-16 h-16 bg-office-primary/10 rounded-full flex items-center justify-center mx-auto text-office-primary">
          <QrCode size={32} />
        </div>
        <button 
          onClick={onOpenScanner}
          className="office-btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
        >
          <Plus size={20} />
          Open Camera
        </button>
      </div>

      <div className="office-card p-4 space-y-3">
        <h4 className="office-xs font-bold text-office-text-secondary uppercase tracking-widest">Local Session Stats</h4>
        <div className="flex items-center justify-between">
          <span className="office-sm text-office-text">Total Local Records</span>
          <span className="text-lg font-bold text-office-primary">{totalRecords}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="office-sm text-office-text">Pending Sync</span>
          <span className="text-lg font-bold text-orange-600">
            {pendingSync}
          </span>
        </div>
      </div>
      
      <button 
         onClick={onClearData}
         className="office-btn-secondary w-full text-red-600 border-red-200 hover:bg-red-50"
      >
        Delete All Local Data
      </button>
    </div>
  );
};

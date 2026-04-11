"use client";

import React from "react";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("@/components/scanner/Scanner"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-office-surface p-8 rounded-office shadow-2xl flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-office-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-office-text-secondary font-medium">Loading Scanner...</p>
      </div>
    </div>
  ),
});
import { ScannerHeader } from "@/app/scanner/ScannerHeader";
import { ScannerStats } from "@/app/scanner/ScannerStats";
import { ScanQueue } from "@/app/scanner/ScanQueue";

interface ScannerViewProps {
  user: any;
  accessToken: string | null;
  project: any;
  records: any[];
  isSyncing: boolean;
  syncStatus: any;
  showScanner: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onSync: () => void;
  onOpenScanner: () => void;
  onCloseScanner: () => void;
  onScanSuccess: (text: string) => void;
  onClearData: () => void;
  onRemoveRecord: (id: string) => void;
  onUpdateRecord: (id: string, field: string, val: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  user,
  accessToken,
  project,
  records,
  isSyncing,
  syncStatus,
  showScanner,
  onLogin,
  onLogout,
  onSync,
  onOpenScanner,
  onCloseScanner,
  onScanSuccess,
  onClearData,
  onRemoveRecord,
  onUpdateRecord
}) => {
  return (
    <div className="space-y-6">
      <ScannerHeader 
        user={user}
        accessToken={accessToken}
        sheetName={project?.sheetName || "Data"}
        projectName={project?.name || ""}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        onLogin={onLogin}
        onLogout={onLogout}
        onSync={onSync}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ScannerStats 
            totalRecords={records.length}
            pendingSync={records.filter(r => !r.isSynced).length}
            onOpenScanner={onOpenScanner}
            onClearData={onClearData}
          />
        </div>

        <div className="lg:col-span-3">
          <ScanQueue 
            records={records}
            onRemoveRecord={onRemoveRecord}
            onUpdateData={onUpdateRecord}
          />
        </div>
      </div>

      {showScanner && (
        <Scanner 
          onScanSuccess={onScanSuccess} 
          onClose={onCloseScanner} 
        />
      )}
    </div>
  );
};

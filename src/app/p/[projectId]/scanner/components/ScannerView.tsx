"use client";

import React from "react";
import Scanner from "@/components/scanner/Scanner";
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

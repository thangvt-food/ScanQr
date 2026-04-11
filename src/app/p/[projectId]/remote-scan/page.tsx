"use client";

import React, { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Scanner from "@/components/scanner/Scanner";
import { UserCheck, Loader2 } from "lucide-react";

// Local Hooks and Components
import { useRemoteScan } from "./hooks/useRemoteScan";
import { RemoteScanAuthGuard } from "./components/RemoteScanAuthGuard";
import { RemoteScanHeader } from "./components/RemoteScanHeader";
import { RemoteScanActions } from "./components/RemoteScanActions";
import { RemoteScanManualForm } from "./components/RemoteScanManualForm";
import { RemoteScanStatus } from "./components/RemoteScanStatus";

function RemoteScanContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const ownerUid = searchParams.get("uid");

  // State for UI toggles
  const [showScanner, setShowScanner] = useState(false);

  // Custom hook for all logic
  const {
    project,
    loading,
    authStatus,
    userData,
    setUserData,
    deviceIp,
    lastScanned,
    isSyncing,
    login,
    submitRecord
  } = useRemoteScan(projectId, ownerUid);

  if (loading) {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="animate-spin text-office-primary" size={40} />
        <p className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Initialising Remote Interface...</p>
      </div>
    );
  }

  return (
    <RemoteScanAuthGuard
      status={authStatus}
      deviceIp={deviceIp}
      userData={userData}
      setUserData={setUserData}
      onLogin={(e) => { e.preventDefault(); login(); }}
    >
      <div className="min-h-screen bg-office-bg p-4 flex flex-col animate-in fade-in duration-500">
        {/* Header */}
        <RemoteScanHeader 
          projectName={project?.name} 
          username={userData.username} 
        />

        {/* Main Interface */}
        <main className="flex-1 flex flex-col items-center justify-center py-10 space-y-6 w-full max-w-sm mx-auto">
          {lastScanned ? (
            <RemoteScanStatus mssv={lastScanned} />
          ) : (
            <div className="w-full space-y-6">
              <RemoteScanActions onOpenScanner={() => setShowScanner(true)} />
              
              <RemoteScanManualForm 
                fields={project?.fields || []}
                isSyncing={isSyncing}
                onSubmit={(mssv, data) => submitRecord(mssv, data, "Manual")}
              />
            </div>
          )}
        </main>

        {/* Footer Info */}
        <footer className="mt-auto py-6 text-center space-y-2 border-t border-office-border/50">
          <div className="flex items-center justify-center gap-2 text-office-text-muted">
            <UserCheck size={14} />
            <span className="office-xs font-bold uppercase tracking-widest">Encrypted Session Secure</span>
          </div>
          <p className="office-xs text-office-text-secondary">
            Thiết bị {deviceIp} đã được xác thực cho hoạt động này.
          </p>
        </footer>

        {/* Overlays */}
        {showScanner && (
          <Scanner 
            onScanSuccess={(val) => {
              submitRecord(val, {}, "Camera");
              setShowScanner(false);
            }}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </RemoteScanAuthGuard>
  );
}

export default function RemoteScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-office-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-office-primary" />
      </div>
    }>
      <RemoteScanContent />
    </Suspense>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Scanner from "@/components/scanner/Scanner";
import { UserCheck, Loader2 } from "lucide-react";

// Local Hooks and Components
import { useRemoteScan } from "./hooks/useRemoteScan";
import { RemoteScanAuthGuard } from "./components/RemoteScanAuthGuard";
import { RemoteScanHeader } from "./components/RemoteScanHeader";
import { RemoteScanManualForm } from "./components/RemoteScanManualForm";
import { RemoteScanStatus } from "./components/RemoteScanStatus";

function RemoteScanContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const ownerUid = searchParams.get("uid");



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
    debugLog,
    login,
    submitRecord,
    allRecords
  } = useRemoteScan(projectId, ownerUid);

  if (loading) {
    return (
      <div className="min-h-screen bg-office-bg flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative">
          <Loader2 className="animate-spin text-office-primary" size={48} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-office-primary rounded-full animate-ping" />
          </div>
        </div>
        
        <div className="space-y-2 text-center">
          <p className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Initialising Remote Interface</p>
          <p className="office-xs text-office-text-muted italic">Connecting securely to project server...</p>
        </div>

        {/* Diagnostic Terminal */}
        <div className="w-full max-w-xs bg-[#1e1e1e] rounded-office p-3 shadow-2xl border border-white/10 font-mono text-[10px] space-y-1">
          <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1">
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
               <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
               <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-white/40 uppercase tracking-tighter">Debug Console</span>
          </div>
          {debugLog.map((log, i) => (
            <div key={i} className="text-green-400 flex gap-2">
              <span className="text-white/20">[{i}]</span>
              <span className="break-all">{log}</span>
            </div>
          ))}
          <div className="text-white/40 animate-pulse">_</div>
        </div>
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
              <RemoteScanManualForm 
                fields={project?.fields || []}
                isSyncing={isSyncing}
                allRecords={allRecords}
                onSubmit={(mssv, data) => submitRecord(mssv, data, "Manual")}
              />
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

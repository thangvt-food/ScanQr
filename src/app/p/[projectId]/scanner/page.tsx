"use client";

import React from "react";
import { useScanner } from "./hooks/useScanner";
import { ScannerView } from "./components/ScannerView";

export default function ProjectScannerPage() {
  const {
    project,
    loading,
    records,
    showScanner,
    setShowScanner,
    openScanner,
    isSyncing,
    syncStatus,
    user,
    accessToken,
    handleScanSuccess,
    syncToSheets,
    login,
    logout,
    updateRecordData,
    removeRecord,
    clearRecords
  } = useScanner();

  if (loading) return null;

  return (
    <ScannerView 
      user={user}
      accessToken={accessToken}
      project={project}
      records={records}
      isSyncing={isSyncing}
      syncStatus={syncStatus}
      showScanner={showScanner}
      onLogin={login}
      onLogout={logout}
      onSync={syncToSheets}
      onOpenScanner={openScanner}
      onCloseScanner={() => setShowScanner(false)}
      onScanSuccess={handleScanSuccess}
      onClearData={() => {
        if (confirm("Clear ALL records for this project?")) clearRecords();
      }}
      onRemoveRecord={removeRecord}
      onUpdateRecord={updateRecordData}
    />
  );
}

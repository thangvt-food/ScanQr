"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Scanner from "@/components/scanner/Scanner";
import { ScannerHeader } from "../ScannerHeader";
import { ScannerStats } from "../ScannerStats";
import { ScanQueue } from "../ScanQueue";
import { useScanStore } from "@/hooks/useScanStore";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig } from "@/lib/projectService";
import { Loader2, AlertCircle } from "lucide-react";

const ScannerProjectPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { user, login, logout, accessToken } = useAuth();
  // Using the map-based records from updated store
  const { projectRecords, addRecord, updateRecordData, removeRecord, clearRecords, markAsSynced } = useScanStore();
  const records = projectRecords[projectId] || [];

  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load project config from RTDB
  useEffect(() => {
    if (!user || !projectId) return;

    const unsubscribe = projectService.getProject(user.uid, projectId, (data) => {
      if (!data) {
        // Project not found or no access
        setLoading(false);
        return;
      }
      setProject(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, projectId]);

  const handleScanSuccess = (decodedText: string) => {
    if (!project) return;
    const mssv = decodedText;
    
    if (records.find(r => r.mssv === mssv)) {
      alert("MSSV already scanned in this project!");
      return;
    }

    const initialData: Record<string, string> = {};
    project.fields.forEach(field => {
      if (field.id !== "mssv") {
        initialData[field.id] = ""; 
      }
    });

    addRecord(projectId, mssv, initialData);
    setShowScanner(false);
  };

  const syncToSheets = async () => {
    const pendingRecords = records.filter(r => !r.isSynced);
    if (pendingRecords.length === 0) {
      alert("No new records to sync!");
      return;
    }

    if (!user || !accessToken) {
      alert("Please login with Google first!");
      login();
      return;
    }

    if (!project?.spreadsheetId) {
      alert("Please configure a Google Spreadsheet ID for this project first!");
      router.push(`/settings?id=${projectId}`);
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          accessToken,
          spreadsheetId: project.spreadsheetId,
          sheetName: project.sheetName,
          fields: project.fields,
          records: pendingRecords,
        }),
      });

      const result = await response.json();
      if (result.success) {
        markAsSynced(projectId, pendingRecords.map(r => r.id));
        alert(`Successfully synced ${pendingRecords.length} records to ${project.sheetName}!`);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error: any) {
      console.error("Sync failed", error);
      alert(`Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <Loader2 className="animate-spin text-office-primary" size={32} />
        <p className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Loading Project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="office-card p-12 text-center max-w-md mx-auto mt-12">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="font-bold text-office-text mb-2 uppercase">Project Not Found</h3>
        <p className="text-office-text-secondary office-sm mb-6 text-balance">
          The project you are looking for does not exist or you don't have permission to access it.
        </p>
        <button onClick={() => router.push("/")} className="office-btn-primary w-full">Back to Workspace</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ScannerHeader 
        user={user}
        accessToken={accessToken}
        sheetName={project.name} // Showing Project Name in header instead of sheet name
        isSyncing={isSyncing}
        onLogin={login}
        onLogout={logout}
        onSync={syncToSheets}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ScannerStats 
            totalRecords={records.length}
            pendingSync={records.filter(r => !r.isSynced).length}
            onOpenScanner={() => setShowScanner(true)}
            onClearData={() => {
              if (confirm("Clear ALL records for this project?")) clearRecords(projectId);
            }}
          />
        </div>

        <div className="lg:col-span-3">
          <ScanQueue 
            records={records}
            onRemoveRecord={(id) => removeRecord(projectId, id)}
            onUpdateData={(id, field, val) => updateRecordData(projectId, id, field, val)}
          />
        </div>
      </div>

      {showScanner && (
        <Scanner 
          onScanSuccess={handleScanSuccess} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
};

export default ScannerProjectPage;

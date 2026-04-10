import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useScanStore } from "@/hooks/useScanStore";
import { projectService, ProjectConfig } from "@/lib/projectService";

export const useScanner = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const { user, login, logout, accessToken } = useAuth();
  const { projectRecords, addRecord, updateRecordData, removeRecord, clearRecords, markAsSynced } = useScanStore();
  const records = projectRecords[projectId] || [];

  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  
  // Bug fix: use a ref to prevent duplicate processing of the same scan event
  const isProcessingScan = useRef(false);

  useEffect(() => {
    if (!user || !projectId) return;
    
    const unsubProject = projectService.getProject(user.uid, projectId, (data) => {
      setProject(data);
      setLoading(false);
    });
    
    const unsubStatus = projectService.subscribeToSyncStatus(user.uid, projectId, (status) => {
      setSyncStatus(status);
    });

    return () => {
      unsubProject();
      unsubStatus();
    };
  }, [user, projectId]);

  const handleScanSuccess = useCallback((decodedText: string) => {
    if (!project || isProcessingScan.current) return;
    
    const mssv = decodedText.trim();
    if (!mssv) return;

    // Set processing to true immediately
    isProcessingScan.current = true;
    
    // Check if duplicate in current records
    if (records.find(r => r.mssv === mssv)) {
      alert(`MSSV ${mssv} already scanned in this project!`);
      isProcessingScan.current = false;
      setShowScanner(false);
      return;
    }

    const initialData: Record<string, string> = {};
    project.fields.forEach(field => {
      if (field.id !== "mssv") {
        initialData[field.id] = ""; 
      }
    });

    addRecord(projectId, mssv, initialData);
    
    // Slight delay before allowing next scan or closing to prevent race conditions
    setTimeout(() => {
      setShowScanner(false);
      isProcessingScan.current = false;
    }, 300);
  }, [project, records, projectId, addRecord]);

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
      router.push(`/p/${projectId}/settings`);
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch("/api/sync-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          projectId,
          accessToken,
          records: pendingRecords,
        }),
      });

      const data = await response.json();
      if (data.success) {
        markAsSynced(projectId, pendingRecords.map(r => r.id));
      } else {
        if (data.error !== "AUTH_FAILED") {
          alert(`Sync failed: ${data.error || "Unknown error"}. ${data.details || ""}`);
        }
      }
    } catch (error: any) {
      alert(`Network Error: Could not reach the sync server. (${error.message})`);
    } finally {
      setIsSyncing(false);
    }
  };

  const openScanner = () => {
    isProcessingScan.current = false;
    setShowScanner(true);
  };

  return {
    projectId,
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
    updateRecordData: (id: string, field: string, val: string) => updateRecordData(projectId, id, field, val),
    removeRecord: (id: string) => removeRecord(projectId, id),
    clearRecords: () => clearRecords(projectId)
  };
};

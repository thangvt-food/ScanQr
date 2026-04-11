import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig, ScanRecord } from "@/lib/projectService";

export const useScanner = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { user, login, logout, accessToken } = useAuth();

  // Local state for records fetched from RTDB
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  // Bug fix: use a ref to prevent duplicate processing of the same scan event
  const isProcessingScan = useRef(false);

  useEffect(() => {
    if (!user || !projectId) return;

    // Subscribe to project config
    const unsubProject = projectService.getProject(user.uid, projectId, (data) => {
      setProject(data);
    });

    // Subscribe to project records (Shared across devices via RTDB)
    const unsubRecords = projectService.subscribeToRecords(user.uid, projectId, (data) => {
      setRecords(data);
      setLoading(false);
    });

    // Subscribe to sync status
    const unsubStatus = projectService.subscribeToSyncStatus(user.uid, projectId, (status) => {
      setSyncStatus(status);
    });

    return () => {
      unsubProject();
      unsubRecords();
      unsubStatus();
    };
  }, [user, projectId]);

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    if (!project || !user || isProcessingScan.current) return;

    const mssv = decodedText.trim();
    if (!mssv) return;

    // Set processing to true immediately
    isProcessingScan.current = true;

    // Duplicate check: records state is already the latest from RTDB subscription
    if (records.find(r => r.mssv === mssv)) {
      alert(`MSSV ${mssv} đã được quét cho dự án này!`);
      setShowScanner(false);
      isProcessingScan.current = false;
      return;
    }

    const initialData: Record<string, string> = {};
    project.fields.forEach(field => {
      if (field.id !== "mssv") {
        initialData[field.id] = "";
      }
    });

    await projectService.addRecord(user.uid, projectId, { mssv, data: initialData });

    // Auto-close scanner after successful scan
    setShowScanner(false);

    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingScan.current = false;
    }, 500);
  }, [project, user, projectId, records]);

  const syncToSheets = async () => {
    if (records.length === 0) {
      alert("Không có hồ sơ nào để đồng bộ!");
      return;
    }

    if (!user || !accessToken) {
      alert("Vui lòng đăng nhập Google trước!");
      login();
      return;
    }

    if (!project?.spreadsheetId) {
      alert("Vui lòng cấu hình Google Spreadsheet ID cho dự án này!");
      router.push(`/p/${projectId}/settings`);
      return;
    }

    if (!confirm(`Xác nhận đồng bộ ${records.length} hồ sơ lên Google Sheets? Sau khi đồng bộ thành công, danh sách tạm thời trên máy chủ sẽ được xóa.`)) {
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
          records: records, // Sync all records currently in RTDB
        }),
      });

      const data = await response.json();
      if (data.success) {
        // PER REQUEST: Delete from RTDB after successful sync to Google Sheets
        await projectService.clearRecords(user.uid, projectId);
        alert("Đồng bộ thành công! Dữ liệu đã được lưu vào Google Sheets và dọn dẹp khỏi RTDB.");
      } else {
        if (data.error !== "AUTH_FAILED") {
          alert(`Lỗi đồng bộ: ${data.error || "Không rõ lỗi"}`);
        }
      }
    } catch (error: any) {
      alert(`Lỗi mạng: Không thể kết nối tới server. (${error.message})`);
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
    updateRecordData: (id: string, field: string, val: string) => projectService.updateRecord(user!.uid, projectId, id, { data: { ...records.find(r => r.id === id)?.data, [field]: val } }),
    removeRecord: (id: string) => projectService.deleteRecord(user!.uid, projectId, id),
    clearRecords: () => projectService.clearRecords(user!.uid, projectId)
  };
};

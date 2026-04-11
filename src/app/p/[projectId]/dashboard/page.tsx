"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useScanStore } from "@/hooks/useScanStore";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig } from "@/lib/projectService";
import { 
  QrCode, 
  Database, 
  Clock, 
  CheckCircle,
  ArrowRight,
  FileSpreadsheet,
  Plus,
  Lock,
  Smartphone,
  Copy,
  Share2
} from "lucide-react";
import Link from "next/link";
import GSheetEditor from "@/components/dashboard/GSheetEditor";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user, accessToken } = useAuth();
  const [project, setProject] = React.useState<ProjectConfig | null>(null);
  const [records, setRecords] = React.useState<any[]>([]);
  const [isCreatingSheet, setIsCreatingSheet] = React.useState(false);
  
  React.useEffect(() => {
    if (!user || !projectId) return;
    
    // Subscribe to project info
    const unsubProject = projectService.getProject(user.uid, projectId, setProject);
    
    // Subscribe to temporary records in RTDB
    const unsubRecords = projectService.subscribeToRecords(user.uid, projectId, setRecords);

    return () => {
      unsubProject();
      unsubRecords();
    };
  }, [user, projectId]);

  const handleCreateSheet = async () => {
    if (!accessToken || !project || !user) return;
    setIsCreatingSheet(true);
    try {
      const res = await fetch("/api/google/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          title: `ScanQR: ${project.name}`
        })
      });
      const data = await res.json();
      if (data.spreadsheetId) {
        await projectService.updateProject(user.uid, projectId, {
          spreadsheetId: data.spreadsheetId,
          sheetName: "Data",
          sheetId: "0"
        });
        alert("Success! A new Google Sheet has been created and linked to this project.");
      } else {
        throw new Error(data.error || "Failed to create sheet");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const pendingCount = records.length;
  // In this model, RTDB only stores records that haven't been pushed to Sheets yet
  const stats = [
    { label: "Pending Records", value: pendingCount, icon: Database, color: "text-blue-600" },
    { label: "Status", value: pendingCount > 0 ? "Needs Sync" : "Clean", icon: Clock, color: pendingCount > 0 ? "text-orange-600" : "text-green-600" },
    { label: "Storage", value: "RTDB (Temp)", icon: CheckCircle, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="office-card p-4 flex items-start justify-between">
            <div>
              <p className="office-xs font-bold text-office-text-secondary uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-office-text">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded-office bg-office-bg ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Action Card */}
        <div className="office-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-office-primary/10 rounded-full text-office-primary">
            <QrCode size={32} />
          </div>
          <h3 className="text-lg font-bold text-office-text uppercase">Operations Scanner</h3>
          <p className="office-sm text-office-text-secondary">Ready to collect data? The scanner is synchronized with your project settings.</p>
          <Link href={`/p/${projectId}/scanner`} className="office-btn-primary w-full flex items-center justify-center gap-2">
            Open Scanner <ArrowRight size={16} />
          </Link>
        </div>

        {/* Sync Status / Quick Setup Card */}
        <div className="office-card p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest mb-1">Spreadsheet Connection</h3>
            <p className="office-xs text-office-text-muted">Storage location for this project's records.</p>
          </div>

          {!project?.spreadsheetId ? (
            <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4 bg-office-bg/50 rounded-office border border-dashed border-office-border">
              <div className="p-3 bg-white rounded-full text-office-text-muted shadow-sm">
                <FileSpreadsheet size={24} />
              </div>
              <div className="text-center px-4">
                <p className="office-sm font-bold text-office-text">No Spreadsheet Found</p>
                <p className="office-xs text-office-text-secondary mt-1">Connect your project to start syncing data.</p>
              </div>
              <button 
                onClick={handleCreateSheet}
                disabled={isCreatingSheet}
                className="office-btn-primary office-xs py-2 px-4 flex items-center gap-2"
              >
                {isCreatingSheet ? "Creating..." : <><Plus size={14} /> Create Automatically</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-office-bg rounded-office">
                <div className="p-2 bg-white rounded-office text-green-600 shadow-sm">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="office-xs font-bold text-office-text truncate">{project.sheetName}</p>
                  <a 
                    href={`https://docs.google.com/spreadsheets/d/${project.spreadsheetId}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="office-xs text-office-primary hover:underline flex items-center gap-1"
                  >
                    Open Sheet <Plus size={10} className="rotate-45" /> 
                  </a>
                </div>
              </div>

              {/* Permission Reminder for Linked Sheets */}
              <div className="bg-office-warning-bg/50 border border-office-warning-text/20 p-3 rounded-office flex gap-3 items-start animate-in slide-in-from-top-2 duration-300">
                <Lock size={14} className="text-office-warning-text shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="office-xs font-bold text-office-warning-text uppercase tracking-wider">Cấu hình quyền truy cập</p>
                  <p className="office-xs text-office-text-secondary leading-tight">
                    Để chỉnh sửa trực tiếp trên Web, hãy nhấn <b>Share</b> trong Google Sheets và chọn <b>"Anyone with the link"</b> là <b>"Editor"</b>.
                  </p>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-office-bg/50 rounded-office border border-office-border">
                <div className="flex justify-between office-xs font-bold uppercase tracking-widest text-office-text-secondary">
                  <span>Current Queue</span>
                  <span>{records.length} Records</span>
                </div>
                <p className="office-xs text-office-text-muted leading-tight">
                  These records are stored temporarily in RTDB. Syncing will move them to Google Sheets permanently.
                </p>
              </div>
              
              <p className="office-xs text-office-text-muted italic text-center">
                Latest activity: {records.length > 0 ? new Date(records[0].timestamp).toLocaleTimeString() : "No pending data"}
              </p>
            </div>
          )}
        </div>

        {/* Remote Scan Link Generator */}
        <div className="office-card p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest mb-1 flex items-center gap-2">
              <Smartphone size={16} /> Remote Scan Link
            </h3>
            <p className="office-xs text-office-text-muted">Generate a link for mobile devices to join as scanners.</p>
          </div>

          <div className="space-y-4">
             <div className="p-3 bg-office-bg rounded-office border border-office-border">
                <p className="office-xs font-bold text-office-text-secondary uppercase mb-2">Secure Access Link</p>
                <div className="flex gap-2">
                   <input 
                     readOnly
                     value={typeof window !== 'undefined' ? `${window.location.origin}/p/${projectId}/remote-scan?uid=${user?.uid}` : ""}
                     className="flex-1 bg-white border border-office-border rounded-office px-3 py-1.5 office-xs font-mono text-office-text-secondary truncate shadow-inner"
                   />
                   <button 
                     onClick={() => {
                       const url = `${window.location.origin}/p/${projectId}/remote-scan?uid=${user?.uid}`;
                       navigator.clipboard.writeText(url);
                       alert("Đã sao chép link quét mã cho di động!");
                     }}
                     className="office-btn-secondary p-1.5"
                     title="Copy Link"
                   >
                     <Copy size={16} />
                   </button>
                </div>
             </div>

             <div className="bg-office-primary/5 p-4 rounded-office border border-office-primary/10 flex gap-4 items-center">
                <div className="p-3 bg-office-primary text-white rounded-office shadow-sm">
                   <Share2 size={24} />
                </div>
                <div className="flex-1">
                   <p className="office-sm font-bold text-office-text uppercase tracking-tight">Cộng tác từ xa</p>
                   <p className="office-xs text-office-text-secondary leading-tight mt-0.5">
                     Gửi link này cho nhân viên hoặc thiết bị di động. Dữ liệu sẽ được đẩy trực tiếp về project này.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Google Sheets Editor (Desktop Only) - Outside the 2-column grid */}
      {project?.spreadsheetId && (
        <div className="pt-4">
          <GSheetEditor 
            spreadsheetId={project.spreadsheetId} 
            sheetName={project.sheetName} 
          />
        </div>
      )}
    </div>
  );
}

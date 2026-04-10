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
  Plus
} from "lucide-react";
import Link from "next/link";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user, accessToken } = useAuth();
  const { projectRecords } = useScanStore();
  const [project, setProject] = React.useState<ProjectConfig | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = React.useState(false);
  
  const records = projectRecords[projectId] || [];
  
  React.useEffect(() => {
    if (!user || !projectId) return;
    const unsubscribe = projectService.getProject(user.uid, projectId, setProject);
    return () => unsubscribe();
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

  const pendingCount = records.filter(r => !r.isSynced).length;
  const syncedCount = records.filter(r => r.isSynced).length;

  const stats = [
    { label: "Total Records", value: records.length, icon: Database, color: "text-blue-600" },
    { label: "Synced", value: syncedCount, icon: CheckCircle, color: "text-green-600" },
    { label: "Pending Sync", value: pendingCount, icon: Clock, color: "text-orange-600" },
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

              <div className="space-y-2">
                <div className="flex justify-between office-xs font-bold uppercase tracking-widest color-office-text-secondary">
                  <span>Sync Progress</span>
                  <span>{records.length > 0 ? Math.round((syncedCount / records.length) * 100) : 0}%</span>
                </div>
                <div className="w-full h-2 bg-office-bg rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-office-success-bg transition-all duration-500" 
                    style={{ width: `${records.length > 0 ? (syncedCount / records.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <p className="office-xs text-office-text-muted italic text-center">
                Latest scan: {records.length > 0 ? new Date(records[0].timestamp).toLocaleTimeString() : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

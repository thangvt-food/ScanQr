"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig } from "@/lib/projectService";
import GSheetEditor from "@/components/dashboard/GSheetEditor";
import { FileSpreadsheet, ExternalLink, ShieldCheck } from "lucide-react";

export default function ProjectSheetsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) return;
    const unsubscribe = projectService.getProject(user.uid, projectId, (data) => {
      setProject(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-office-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project?.spreadsheetId) {
    return (
      <div className="office-card p-12 text-center max-w-2xl mx-auto mt-10">
        <FileSpreadsheet size={48} className="mx-auto text-office-text-muted mb-4" />
        <h2 className="text-xl font-bold text-office-text uppercase">No Spreadsheet Linked</h2>
        <p className="text-office-text-secondary office-sm mt-2 mb-6">
          This project hasn&apos;t been connected to a Google Sheet yet. Goto Project Settings to link one.
        </p>
        <a href={`/p/${projectId}/settings`} className="office-btn-primary">Go to Settings</a>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-office-surface p-4 rounded-office border border-office-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 text-green-700 rounded-office">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-office-text uppercase tracking-tight">
              Live Spreadsheet: <span className="text-office-primary">{project.sheetName}</span>
            </h1>
            <p className="office-xs text-office-text-secondary flex items-center gap-1">
              <ShieldCheck size={12} className="text-office-success-text" /> 
              Secure connection active via Google Workspace API
            </p>
          </div>
        </div>
        
        <a 
          href={`https://docs.google.com/spreadsheets/d/${project.spreadsheetId}/edit`}
          target="_blank"
          rel="noreferrer"
          className="office-btn-secondary office-xs flex items-center gap-2"
        >
          Full Google Sheets <ExternalLink size={14} />
        </a>
      </div>

      {/* Full Size Editor */}
      <div className="min-h-[700px]">
        <GSheetEditor 
          spreadsheetId={project.spreadsheetId} 
          sheetName={project.sheetName}
        />
      </div>
      
      {/* Mobile Warning */}
      <div className="lg:hidden office-card p-6 text-center bg-office-warning-bg/20 border-office-warning-text/20">
        <p className="office-sm text-office-warning-text font-bold">Desktop Only View</p>
        <p className="office-xs text-office-text-secondary mt-1">
          The interactive spreadsheet editor is optimized for large screens. Please use a desktop device or open in Google Sheets app.
        </p>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useConfigStore } from "@/hooks/useConfigStore";
import { SchemaEditor } from "@/components/config/SchemaEditor";
import { projectService, ProjectConfig } from "@/lib/projectService";
import { 
  Settings, 
  Table as TableIcon,
  AlertTriangle,
  Save,
  Check
} from "lucide-react";

// Sub-components
import { AuthStatusCard } from "@/app/settings/components/AuthStatusCard";
import { SpreadsheetSelector } from "@/app/settings/components/SpreadsheetSelector";
import { ManualIdOverride } from "@/app/settings/components/ManualIdOverride";
import { VerificationGuide } from "@/app/settings/components/VerificationGuide";
import { StatusSection } from "@/app/settings/components/StatusSection";

interface GoogleFile {
  id: string;
  name: string;
  modifiedTime: string;
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { user, login, accessToken } = useAuth();
  const config = useConfigStore();
  const { spreadsheetId, sheetName, setConfig, setSpreadsheetId, setSheetName, setSheetId } = config;
  
  const [spreadsheets, setSpreadsheets] = useState<GoogleFile[]>([]);
  const [availableSheets, setAvailableSheets] = useState<{id: string, title: string}[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [project, setProject] = useState<ProjectConfig | null>(null);

  const isInitialLoad = useRef(true);

  // Sync RTDB to Store
  useEffect(() => {
    if (!user || !projectId) return;
    const unsubscribe = projectService.getProject(user.uid, projectId, (data) => {
      setProject(data);
      if (data && isInitialLoad.current) {
        setConfig({
          spreadsheetId: data.spreadsheetId,
          sheetName: data.sheetName,
          sheetId: data.sheetId,
          fields: data.fields || []
        });
        isInitialLoad.current = false;
      }
    });
    return () => unsubscribe();
  }, [user, projectId, setConfig]);

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
        setSpreadsheetId(data.spreadsheetId);
        setSheetName("Data");
        setSheetId("0");
        alert("Success! A new Google Sheet has been created. Don't forget to SAVE your settings.");
      } else {
        throw new Error(data.error || "Failed to create sheet");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Google APIs
  const fetchSpreadsheets = async () => {
    if (!accessToken) return;
    setIsLoadingFiles(true);
    try {
      const res = await fetch("/api/google/spreadsheets", {
        method: "POST",
        body: JSON.stringify({ userId: user?.uid, accessToken }),
      });
      const data = await res.json();
      if (data.files) setSpreadsheets(data.files);
    } catch (err: any) {
      setErrorMessage(`Failed to load spreadsheets: ${err.message}`);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const fetchSheets = async (id: string) => {
    if (!accessToken || !id) return;
    setIsLoadingSheets(true);
    try {
      const res = await fetch("/api/google/sheets", {
        method: "POST",
        body: JSON.stringify({ userId: user?.uid, accessToken, spreadsheetId: id }),
      });
      const data = await res.json();
      if (data.sheets) setAvailableSheets(data.sheets);
    } catch (err: any) {
      setErrorMessage(`Failed to load sheets/tabs: ${err.message}`);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  useEffect(() => { if (accessToken) fetchSpreadsheets(); }, [accessToken]);
  useEffect(() => { if (spreadsheetId && accessToken) fetchSheets(spreadsheetId); }, [spreadsheetId, accessToken]);

  const handleSave = async () => {
    if (!user || !projectId) return;
    
    // Get the absolute latest state from the store directly
    const latestConfig = useConfigStore.getState();

    // VALIDATION: Ensure sheetName is selected
    if (!latestConfig.spreadsheetId || !latestConfig.sheetName) {
      alert("Validation Error: Please select both a Spreadsheet AND a specific Tab (Sheet Name) before saving.");
      return;
    }
    
    setSaveStatus("saving");
    try {
      console.log("Saving project config to RTDB:", latestConfig);
      await projectService.updateProject(user.uid, projectId, {
        spreadsheetId: latestConfig.spreadsheetId,
        sheetName: latestConfig.sheetName,
        sheetId: latestConfig.sheetId,
        fields: latestConfig.fields
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err: any) {
      console.error("Failed to save project config:", err);
      alert("Failed to save settings: " + err.message);
      setSaveStatus("idle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saveStatus !== "idle"}
          className={`office-btn-primary flex items-center gap-2 px-6 py-2.5 ${saveStatus === "saved" ? "bg-green-600 border-green-700" : ""}`}
        >
          {saveStatus === "idle" && <><Save size={18} /> Save Settings</>}
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && <><Check size={18} /> Saved!</>}
        </button>
      </div>

      <AuthStatusCard user={user} accessToken={accessToken} login={login} />

      {user && accessToken && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SpreadsheetSelector 
              spreadsheets={spreadsheets}
              spreadsheetId={spreadsheetId}
              sheetName={sheetName}
              availableSheets={availableSheets}
              isLoadingFiles={isLoadingFiles}
              isLoadingSheets={isLoadingSheets}
              isCreating={isCreatingSheet}
              fetchSpreadsheets={fetchSpreadsheets}
              setSheetName={setSheetName}
              setSheetId={setSheetId}
              handleSelectFile={(file) => {
                setSpreadsheetId(file.id);
                setSheetName("");
                setSheetId("");
              }}
              onCreateNew={handleCreateSheet}
            />
            <ManualIdOverride spreadsheetId={spreadsheetId} setSpreadsheetId={setSpreadsheetId} />
          </div>

          <div className="space-y-6">
            <VerificationGuide />
            <section className="office-card">
              <div className="office-toolbar">
                <TableIcon className="text-office-primary" size={16} />
                <span className="office-sm font-bold uppercase tracking-widest text-office-text-secondary">Data Schema</span>
              </div>
              <div className="p-4"><SchemaEditor /></div>
            </section>
            <StatusSection />
          </div>
        </div>
      )}
    </div>
  );
}

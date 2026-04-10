"use client";

import React from "react";
import { FileSpreadsheet, RefreshCw } from "lucide-react";

interface GoogleFile {
  id: string;
  name: string;
  modifiedTime: string;
}

interface SpreadsheetSelectorProps {
  spreadsheets: GoogleFile[];
  spreadsheetId: string;
  sheetName: string;
  availableSheets: { id: string; title: string }[];
  isLoadingFiles: boolean;
  isLoadingSheets: boolean;
  isCreating?: boolean;
  fetchSpreadsheets: () => void;
  setSheetName: (name: string) => void;
  setSheetId: (id: string) => void;
  handleSelectFile: (file: GoogleFile) => void;
  onCreateNew?: () => void;
}

export const SpreadsheetSelector: React.FC<SpreadsheetSelectorProps> = ({
  spreadsheets,
  spreadsheetId,
  sheetName,
  availableSheets,
  isLoadingFiles,
  isLoadingSheets,
  isCreating,
  fetchSpreadsheets,
  setSheetName,
  setSheetId,
  handleSelectFile,
  onCreateNew,
}) => {
  return (
    <section className="office-card overflow-hidden">
      <div className="office-toolbar">
        <FileSpreadsheet className="text-office-primary" size={16} />
        <span className="office-sm font-bold uppercase tracking-widest text-office-text-secondary">
          Target Spreadsheet
        </span>
        <div className="ml-auto flex items-center gap-2">
           {onCreateNew && (
             <button 
               onClick={onCreateNew} 
               disabled={isCreating}
               className="office-xs font-bold text-office-primary hover:underline uppercase tracking-tighter"
             >
               {isCreating ? "Creating..." : "+ Create New"}
             </button>
           )}
           {isLoadingFiles && <RefreshCw size={14} className="animate-spin text-office-primary" />}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <label className="office-xs font-bold text-office-text-secondary uppercase">Selected File</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-office-bg border border-office-border px-3 py-2 rounded-office office-sm font-medium truncate">
              {spreadsheets.find((f) => f.id === spreadsheetId)?.name || "Chưa chọn file"}
            </div>
            <button onClick={fetchSpreadsheets} className="office-btn-secondary p-2" title="Refresh list">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="office-xs font-bold text-office-text-secondary uppercase">
            {isLoadingSheets ? "Loading Tabs..." : "Selected Sheet Name (Tab)"}
          </label>
          <div className="relative">
            <select
              value={sheetName}
              onChange={(e) => {
                if (!e.target.value) return;
                const selected = availableSheets.find((s) => s.title === e.target.value);
                if (selected) {
                  setSheetName(selected.title);
                  setSheetId(selected.id);
                }
              }}
              className={`w-full bg-office-surface border border-office-border px-3 py-2 rounded-office office-sm focus:border-office-primary outline-none transition-all ${
                isLoadingSheets ? "opacity-50 cursor-not-allowed" : ""
              } ${!sheetName ? "border-orange-300 ring-1 ring-orange-100" : ""}`}
              disabled={isLoadingSheets}
            >
              <option value="">-- Select a Sheet (Required) --</option>
              {availableSheets.map((s) => (
                <option key={s.id} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
            {isLoadingSheets && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <RefreshCw size={14} className="animate-spin text-office-primary" />
              </div>
            )}
          </div>
          {!sheetName && !isLoadingSheets && availableSheets.length > 0 && (
            <p className="office-xs text-orange-600 italic">⚠️ Please select a specific tab for data syncing.</p>
          )}
        </div>
      </div>

      {/* Grid of Spreadsheets */}
      <div className="border-t border-office-border max-h-64 overflow-y-auto bg-office-surface">
        <table className="w-full office-xs text-left">
          <thead className="sticky top-0 bg-office-header">
            <tr>
              <th className="px-4 py-2 border-b border-office-border text-office-text-muted">FILENAME</th>
              <th className="px-4 py-2 border-b border-office-border text-office-text-muted">MODIFIED</th>
              <th className="px-4 py-2 border-b border-office-border text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-office-border/50">
            {spreadsheets.map((file) => (
              <tr
                key={file.id}
                className={`hover:bg-office-bg transition-colors ${
                  spreadsheetId === file.id ? "bg-office-primary/5 font-semibold" : ""
                }`}
              >
                <td className="px-4 py-2 text-office-text truncate max-w-[150px]">{file.name}</td>
                <td className="px-4 py-2 text-office-text-muted italic">
                  {new Date(file.modifiedTime).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleSelectFile(file)}
                    className={`office-xs font-bold uppercase transition-colors ${
                      spreadsheetId === file.id
                        ? "text-office-primary"
                        : "text-office-text-muted hover:text-office-primary"
                    }`}
                  >
                    {spreadsheetId === file.id ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

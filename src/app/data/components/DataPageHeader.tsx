"use client";

import React from "react";
import { Database, RefreshCw, ExternalLink } from "lucide-react";

interface DataPageHeaderProps {
  sheetName: string;
  hasHydrated: boolean;
  isLoading: boolean;
  fetchData: () => void;
  openSheet: () => void;
}

export const DataPageHeader: React.FC<DataPageHeaderProps> = ({
  sheetName,
  hasHydrated,
  isLoading,
  fetchData,
  openSheet,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-office-primary rounded-office text-white">
          <Database size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-office-text uppercase tracking-tight">Cloud Data Explorer</h1>
          <p className="text-office-text-secondary office-sm">
            Viewing <span className="font-bold text-office-primary">{hasHydrated ? sheetName : "Loading..."}</span> on
            Google Sheets
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={fetchData} disabled={isLoading} className="office-btn-secondary flex items-center gap-2">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
        <button onClick={openSheet} className="office-btn-primary flex items-center gap-2">
          <ExternalLink size={16} />
          Open Spreadsheet
        </button>
      </div>
    </div>
  );
};

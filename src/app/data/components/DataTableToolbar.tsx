"use client";

import React from "react";
import { Search } from "lucide-react";

interface DataTableToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalRows: number;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ searchTerm, setSearchTerm, totalRows }) => {
  return (
    <div className="office-card p-2 flex items-center gap-4 bg-office-header/50">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted" size={16} />
        <input
          type="text"
          placeholder="Search within cloud data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-office-surface border border-office-border pl-10 pr-4 py-1.5 rounded-office office-sm outline-none focus:border-office-primary"
        />
      </div>
      <div className="flex items-center gap-2 px-2 border-l border-office-border">
        <span className="office-xs font-bold text-office-text-secondary uppercase">Total Rows: {totalRows}</span>
      </div>
    </div>
  );
};

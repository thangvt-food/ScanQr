"use client";

import React from "react";
import { Key, Info } from "lucide-react";

interface ManualIdOverrideProps {
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;
}

export const ManualIdOverride: React.FC<ManualIdOverrideProps> = ({ spreadsheetId, setSpreadsheetId }) => {
  return (
    <section className="office-card">
      <div className="office-toolbar">
        <Key className="text-office-primary" size={16} />
        <span className="office-sm font-bold uppercase tracking-widest text-office-text-secondary">
          Manual ID Override
        </span>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <label className="office-xs font-bold text-office-text-secondary uppercase">Spreadsheet ID</label>
          <input
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            placeholder="e.g. 1aBC-def_GHiJkLmNoPqRsTuVwXyZ"
            className="w-full bg-office-surface border border-office-border px-3 py-2 rounded-office office-sm focus:border-office-primary outline-none"
          />
        </div>

        <div className="bg-office-header border border-office-border rounded-office p-3 flex gap-3">
          <Info className="text-office-primary shrink-0" size={18} />
          <div>
            <p className="office-xs font-bold text-office-text uppercase">Cách lấy ID Spreadsheet:</p>
            <p className="office-xs text-office-text-secondary mt-1">
              Mở Google Sheet trên trình duyệt, ID là chuỗi ký tự nằm giữa <span className="text-office-primary">/d/</span>{" "}
              và <span className="text-office-primary">/edit</span> trên thanh địa chỉ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

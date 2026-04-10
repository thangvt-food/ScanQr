"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export const NoSpreadsheetGuard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] office-card p-12 text-center">
      <FileSpreadsheet size={48} className="text-office-text-muted mb-4" />
      <h2 className="text-xl font-bold text-office-text">No Spreadsheet Configured</h2>
      <p className="text-office-text-secondary mt-2 mb-6">Hãy vào phần Settings để chọn file Google Sheets đích.</p>
      <Link href="/settings" className="office-btn-primary px-8 py-2">
        Go to Settings
      </Link>
    </div>
  );
};

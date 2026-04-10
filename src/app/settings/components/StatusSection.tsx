"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export const StatusSection: React.FC = () => {
  return (
    <section className="office-card">
      <div className="office-toolbar">
        <CheckCircle2 className="text-office-success-text" size={16} />
        <span className="office-sm font-bold uppercase tracking-widest text-office-text-secondary">Current Status</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between office-sm">
          <span className="text-office-text-secondary">OAuth Credential</span>
          <span className="text-office-success-text font-bold uppercase office-xs">Valid</span>
        </div>
        <div className="flex items-center justify-between office-sm">
          <span className="text-office-text-secondary">Sheets Permission</span>
          <span className="text-office-success-text font-bold uppercase office-xs">Authorized</span>
        </div>
        <div className="flex items-center justify-between office-sm border-t border-office-border pt-2 mt-2">
          <span className="text-office-text-secondary">Active Project</span>
          <span className="text-office-primary font-bold office-xs text-right truncate ml-4">scanqr-da13a</span>
        </div>
      </div>
    </section>
  );
};

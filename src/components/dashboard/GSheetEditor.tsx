'use client';

import React, { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, RefreshCcw, FileSpreadsheet, Lock } from 'lucide-react';

interface GSheetEditorProps {
  spreadsheetId: string | null;
  sheetName?: string;
}

export default function GSheetEditor({ spreadsheetId, sheetName = "Data" }: GSheetEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [key, setKey] = useState(0); 

  if (!spreadsheetId) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center p-12 border-2 border-dashed border-office-border rounded-office bg-office-header/30">
        <Lock className="text-office-text-muted mb-4" size={48} />
        <h3 className="office-sm font-bold text-office-text uppercase tracking-widest">No Spreadsheet Linked</h3>
        <p className="office-xs text-office-text-secondary mt-2">Connect a Google Sheet to enable live editing on desktop.</p>
      </div>
    );
  }

  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?rm=minimal`; 
  const handleReload = () => setKey(prev => prev + 1);

  return (
    <div className="hidden lg:flex flex-col w-full border border-office-border rounded-office bg-office-surface shadow-office overflow-hidden transition-all duration-500">
      {/* Header Toolbar */}
      <div className="office-toolbar justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-office-success-text rounded-full animate-pulse" />
          <h3 className="office-xs font-bold text-office-text-secondary uppercase tracking-widest flex items-center gap-2">
            <FileSpreadsheet size={14} className="text-green-600" />
            Google Sheets Live Sync
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={handleReload}
            className="office-btn-ghost"
            title="Reload Frame"
          >
            <RefreshCcw size={16} />
          </button>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="office-btn-ghost"
            title={isExpanded ? "Minimize" : "Full View"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <div className="w-[1px] h-4 bg-office-border mx-1" />

          <a 
            href={SHEET_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="office-btn-ghost text-office-primary hover:text-office-primary-hover"
            title="Open in New Tab"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Warning/Info bar for permissions */}
      <div className="bg-office-warning-bg px-4 py-1.5 border-b border-office-border flex items-center justify-between">
         <p className="office-xs text-office-warning-text flex items-center gap-2 italic">
           <Lock size={12} />
           If the sheet is not loading, ensure you have set "Anyone with link" as "Editor" in Google Sheets.
         </p>
      </div>

      {/* Iframe Container */}
      <div className={`relative transition-all duration-300 ${isExpanded ? 'h-[85vh]' : 'h-[600px]'} bg-office-bg`}>
        <iframe
          key={key}
          src={SHEET_URL}
          className="w-full h-full border-none"
          allow="autoplay"
          loading="lazy"
          title="Google Sheet Editor"
        ></iframe>
      </div>
      
      {/* Footer Info */}
      <div className="px-4 py-2 bg-office-header border-t border-office-border flex justify-between items-center">
        <span className="office-xs text-office-text-muted font-medium">Auto-syncing changes...</span>
        <span className="office-xs text-office-text-muted">ID: {spreadsheetId.substring(0, 15)}...</span>
      </div>
    </div>
  );
}

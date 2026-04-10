"use client";

import React from "react";
import { LogIn, LogOut, Send, CloudUpload } from "lucide-react";

interface ScannerHeaderProps {
  user: any;
  accessToken: string | null;
  sheetName: string;
  projectName?: string;
  isSyncing: boolean;
  syncStatus?: any;
  onLogin: () => void;
  onLogout: () => void;
  onSync: () => void;
}

export const ScannerHeader: React.FC<ScannerHeaderProps> = ({ 
  user, 
  accessToken,
  sheetName, 
  projectName,
  isSyncing, 
  syncStatus,
  onLogin, 
  onLogout, 
  onSync 
}) => {
  const showStatus = isSyncing || (syncStatus && (syncStatus.isError || syncStatus.stage === "COMPLETED"));

  return (
    <div className="flex flex-col gap-4 border-b border-office-border pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-office-text tracking-tight uppercase flex items-center gap-2">
            {projectName || "Scanning Session"}
          </h1>
          <p className="text-office-text-secondary office-sm">
            Target Sheet: <span className="font-bold text-office-primary">{sheetName}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          {!user ? (
            <button 
              onClick={onLogin}
              className="office-btn-secondary flex items-center gap-2"
            >
              <LogIn size={16} />
              Login with Google
            </button>
          ) : !accessToken ? (
             <button 
              onClick={onLogin}
              className="office-btn-primary flex items-center gap-2 bg-blue-600 animate-pulse"
            >
              <LogIn size={16} />
              Session Expired - Login Now
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="office-xs font-bold text-office-text leading-tight">{user.displayName}</span>
                <span className="office-xs text-office-text-secondary leading-tight text-right">{user.email}</span>
              </div>
              <button onClick={onLogout} className="office-btn-ghost text-red-600" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}

          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="office-btn-primary flex items-center gap-2 disabled:opacity-50 min-w-[160px] justify-center"
          >
            {isSyncing ? (
               <CloudUpload className="animate-bounce" size={16} />
            ) : (
               <Send size={16} />
            )}
            {isSyncing ? "Syncing..." : "Quick Sync Now"}
          </button>
        </div>
      </div>

      {showStatus && syncStatus && (
        <div className={`p-3 rounded border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          syncStatus.isError 
            ? "bg-red-50 border-red-200 text-red-700" 
            : syncStatus.stage === "COMPLETED"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
        }`}>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/50 border border-current/20">
                {syncStatus.stage}
              </span>
              <span className="text-sm font-medium">{syncStatus.message}</span>
            </div>
            {syncStatus.details && typeof syncStatus.details === 'string' && (
              <span className="text-xs opacity-80 mt-1">{syncStatus.details}</span>
            )}
          </div>
          {isSyncing && (
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

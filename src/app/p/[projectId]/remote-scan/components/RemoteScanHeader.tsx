"use client";

import React from "react";
import { Smartphone, User } from "lucide-react";

interface RemoteScanHeaderProps {
  projectName?: string;
  username?: string;
}

export const RemoteScanHeader: React.FC<RemoteScanHeaderProps> = ({ projectName, username }) => {
  return (
    <div className="office-card p-4 flex items-center justify-between shadow-sm border-b-2 border-office-primary">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-office-primary rounded-full flex items-center justify-center text-white shadow-md">
          <Smartphone size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-office-text uppercase truncate max-w-[120px]">{projectName}</h1>
          <p className="text-[10px] text-office-primary font-bold uppercase tracking-wider flex items-center gap-1">
            <User size={10} /> {username}
          </p>
        </div>
      </div>
      <div className="text-right">
         <p className="text-[10px] text-office-text-muted font-bold uppercase">System Status</p>
         <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Encrypted Live
         </p>
      </div>
    </div>
  );
};

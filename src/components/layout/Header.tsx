"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  User, 
  Cloud, 
  HelpCircle,
  Maximize2
} from "lucide-react";

const Header = () => {
  return (
    <header className="h-14 bg-office-surface border-b border-office-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar - System Style */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted group-focus-within:text-office-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search commands or records... (Ctrl+/)"
            className="w-full bg-office-bg border border-office-border focus:border-office-primary focus:ring-1 focus:ring-office-primary/20 rounded-office pl-10 pr-4 py-1.5 office-sm transition-all outline-none text-office-text"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-office text-office-success-text bg-office-success-bg/50 border border-office-success-text/10 mr-4">
          <div className="w-1.5 h-1.5 rounded-full bg-office-success-text animate-pulse" />
          <span className="office-xs font-bold uppercase tracking-wider">Sheet Connected</span>
        </div>

        <button className="office-btn-ghost" title="Fullscreen">
          <Maximize2 size={18} />
        </button>
        
        <button className="office-btn-ghost relative" title="Notifications">
          <Bell size={18} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-office-surface" />
        </button>

        <button className="office-btn-ghost" title="Help">
          <HelpCircle size={18} />
        </button>

        <div className="h-6 w-[1px] bg-office-border mx-2" />

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-office hover:bg-office-bg transition-colors border border-transparent hover:border-office-border">
          <div className="flex flex-col items-end">
            <span className="office-sm font-semibold text-office-text leading-tight">Admin User</span>
            <span className="office-xs text-office-text-secondary leading-tight">Administrator</span>
          </div>
          <div className="w-8 h-8 rounded-office bg-office-primary/10 border border-office-primary/20 flex items-center justify-center text-office-primary">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;

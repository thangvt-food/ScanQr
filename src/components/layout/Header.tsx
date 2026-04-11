"use client";

import React from "react";
import {
  Bell,
  Search,
  User,
  Cloud,
  HelpCircle,
  Maximize2,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="h-14 bg-office-surface border-b border-office-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search Bar - Removed as per feedback it was "ảo" */}
      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button className="office-btn-ghost active:scale-95" title="Toàn màn hình" onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}>
          <Maximize2 size={18} />
        </button>

        <button className="office-btn-ghost relative active:scale-95" title="Thông báo">
          <Bell size={18} />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-office-primary rounded-full border border-office-surface" />
        </button>

        <div className="h-6 w-[1px] bg-office-border mx-2" />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-office hover:bg-office-bg transition-all border border-transparent hover:border-office-border active:scale-95 group"
          >
            <div className="flex flex-col items-end">
              <span className="office-sm font-semibold text-office-text leading-tight truncate max-w-[120px]">
                {user?.displayName || "Người dùng"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-office-primary/10 border border-office-primary/20 flex items-center justify-center text-office-primary group-hover:bg-office-primary group-hover:text-white transition-all overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={18} />
              )}
            </div>
            <ChevronDown size={14} className={`text-office-text-muted transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-office-border rounded-lg shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-office-border/50">
                  <p className="office-xs text-office-text-muted font-bold uppercase tracking-widest mb-1">Tài khoản hiện tại</p>
                  <p className="office-sm font-bold text-office-text truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 office-sm font-bold transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

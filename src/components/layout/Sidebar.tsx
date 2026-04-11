"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { 
  QrCode, 
  LayoutDashboard, 
  Settings, 
  BookOpen,
  PlayCircle,
  User,
  ArrowLeft,
  History,
  FileSpreadsheet,
  Smartphone
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params?.projectId as string;

  // Menu items for the Workspace (Global level)
  const workspaceMenuItems = [
    { icon: LayoutDashboard, label: "Dự án của bạn", href: "/" },
    { icon: Settings, label: "Cài đặt ứng dụng", href: "/app-settings" }, // Global settings
    { icon: BookOpen, label: "Tài liệu hướng dẫn", href: "/docs" },
    { icon: PlayCircle, label: "Kênh YouTube", href: "https://youtube.com", external: true },
    { icon: User, label: "Thông tin phát triển", href: "/about" },
  ];

  // Menu items for a Specific Project
  const projectMenuItems = [
    { icon: LayoutDashboard, label: "Tổng quan dự án", href: `/p/${projectId}/dashboard` },
    { icon: QrCode, label: "Trình quét QR", href: `/p/${projectId}/scanner` },
    { icon: FileSpreadsheet, label: "Bảng tính trực tiếp", href: `/p/${projectId}/sheets` },
    { icon: Smartphone, label: "Quét qua di động", href: `/p/${projectId}/collaboration` },
    { icon: Settings, label: "Cài đặt dự án", href: `/p/${projectId}/settings` },
    { icon: History, label: "Lịch sử đồng bộ", href: `/p/${projectId}/history` },
  ];

  const currentMenu = projectId ? projectMenuItems : workspaceMenuItems;

  return (
    <aside className="w-64 bg-office-surface border-r border-office-border flex flex-col h-full transition-all duration-300">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-6 border-b border-office-border justify-between bg-office-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-office-primary rounded flex items-center justify-center text-white shrink-0">
            <QrCode size={20} />
          </div>
          <span className="font-bold text-office-text tracking-tight office-sm uppercase truncate">
            {projectId ? "Chế độ dự án" : "Quản trị ScanQR"}
          </span>
        </div>
      </div>

      {/* Context Switcher (Only in project view) */}
      {projectId && (
        <div className="px-2 pt-4">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-office-text-secondary hover:text-office-primary hover:bg-office-primary/5 rounded-office transition-all office-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            <span>Chuyển dự án</span>
          </Link>
          <div className="mt-4 px-4 pb-2">
            <div className="h-px bg-office-border w-full" />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {currentMenu.map((item) => {
          const isActive = pathname === item.href;
          const isExternal = 'external' in item && item.external;
          
          const content = (
            <>
              <item.icon 
                size={18} 
                className={isActive ? "text-office-primary" : "text-office-text-muted group-hover:text-office-text"} 
              />
              <span className="font-medium office-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-4 bg-office-primary rounded-full" />
              )}
            </>
          );

          if (isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-2 rounded-office text-office-text-secondary hover:bg-office-bg hover:text-office-text transition-all duration-200 group"
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-office transition-all duration-200 group
                ${isActive 
                  ? "bg-office-primary/10 text-office-primary" 
                  : "text-office-text-secondary hover:bg-office-bg hover:text-office-text"
                }
              `}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-office-border bg-office-header">
        <div className="office-xs text-office-text-muted font-bold uppercase tracking-widest text-center">
          v2.0 Hỗ trợ dự án
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

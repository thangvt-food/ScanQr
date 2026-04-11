"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isRemoteScan = pathname?.includes("/remote-scan");

  if (isRemoteScan) {
    return <div className="h-screen w-full bg-office-bg overflow-auto">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-office-bg text-office-text overflow-hidden">
      {/* Sidebar - Fixed width for Business Desktop look */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-auto p-6 scrollbar-thin">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

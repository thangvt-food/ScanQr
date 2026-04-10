"use client";

import React from "react";
import { Database } from "lucide-react";

interface DataAuthGuardProps {
  user: any;
  login: () => void;
}

export const DataAuthGuard: React.FC<DataAuthGuardProps> = ({ user, login }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] office-card p-12 text-center border-blue-100 bg-blue-50/30">
      <Database size={48} className="text-blue-400 mb-4" />
      <h2 className="text-xl font-bold text-blue-900">
        {!user ? "Authentication Required" : "Session Expired"}
      </h2>
      <p className="text-blue-700 mt-2 mb-6">
        {!user
          ? "Bạn cần đăng nhập bằng Google để xem dữ liệu trực tuyến."
          : "Phiên làm việc với Google đã hết hạn. Vui lòng đăng nhập lại để tiếp tục."}
      </p>
      <button onClick={login} className="office-btn-primary px-8 py-2 bg-blue-600 border-blue-700">
        {user ? "Refresh Session Now" : "Sign In with Google"}
      </button>
    </div>
  );
};

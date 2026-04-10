"use client";

import React from "react";
import { AlertTriangle, Info } from "lucide-react";

interface AuthStatusCardProps {
  user: any;
  accessToken: string | null;
  login: () => void;
}

export const AuthStatusCard: React.FC<AuthStatusCardProps> = ({ user, accessToken, login }) => {
  if (!user) {
    return (
      <div className="office-card p-6 border-office-warning-text/20 bg-office-warning-bg/30">
        <div className="flex gap-4">
          <AlertTriangle className="text-office-warning-text shrink-0" size={24} />
          <div className="space-y-3">
            <h3 className="office-base font-bold text-office-text">Google Account Required</h3>
            <p className="office-sm text-office-text-secondary">
              Bạn chưa đăng nhập. Để kết nối với Google Sheets, vui lòng đăng nhập bằng tài khoản Google.
            </p>
            <button onClick={login} className="office-btn-primary px-6 py-2 flex items-center gap-2">
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="office-card p-6 border-blue-200 bg-blue-50">
        <div className="flex gap-4">
          <Info className="text-blue-600 shrink-0" size={24} />
          <div className="space-y-3">
            <h3 className="office-base font-bold text-blue-900">Session Expired or Incomplete</h3>
            <p className="office-sm text-blue-700">
              Phiên làm việc với Google đã hết hạn. Bạn cần nhấn nút bên dưới để cấp quyền truy cập lại vào Sheets & Drive.
            </p>
            <button onClick={login} className="office-btn-primary px-6 py-2 bg-blue-600 border-blue-700">
              Refresh Token / Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

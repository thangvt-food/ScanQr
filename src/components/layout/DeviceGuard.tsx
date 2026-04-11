"use client";

import React, { useEffect, useState } from "react";
import { Monitor, Smartphone, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DeviceGuard({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

      // Check for Samsung DeX (often has specific strings or specific aspect ratios, but basic UA check is usually enough)
      const isDex = /SamsungDex/i.test(ua);

      setIsMobile(mobile || isDex);
    };

    checkDevice();
  }, []);

  // Don't apply guard to the remote scanner page
  if (pathname.includes("/remote-scan")) {
    return <>{children}</>;
  }

  if (isMobile === null) return null; // Loading state

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] bg-office-bg flex items-center justify-center p-6 text-center">
        <div className="office-card max-w-md p-8 space-y-6 shadow-2xl border-2 border-office-primary/20 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <Monitor size={64} className="text-office-text-muted mx-auto" />
            <div className="absolute -top-2 -right-2 bg-office-error-bg p-1.5 rounded-full border-2 border-white shadow-sm">
              <Smartphone size={16} className="text-office-error-text" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-office-text uppercase tracking-widest">Thiết bị không hỗ trợ</h1>
            <p className="office-sm text-office-text-secondary">
              Phiên bản <b>Admin Dashboard</b> yêu cầu sử dụng máy tính để có trải nghiệm cấu hình và quản lý tốt nhất.
            </p>
          </div>

          <div className="bg-office-warning-bg/30 p-4 rounded-office border border-office-warning-text/10 text-left flex gap-3">
            <AlertTriangle size={20} className="text-office-warning-text shrink-0" />
            <p className="office-xs text-office-warning-text italic">
              <b>Lưu ý:</b> Tính năng Samsung DeX và Tablet hiện đang được phát triển, vui lòng quay lại sau.
              Nếu bạn muốn quét mã bằng điện thoại, hãy sử dụng <b>Remote Scan Link</b> do Admin dự án cung cấp.
            </p>
          </div>

          <p className="office-xs text-office-text-muted">Vui lòng đăng nhập trên PC hoặc Laptop.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

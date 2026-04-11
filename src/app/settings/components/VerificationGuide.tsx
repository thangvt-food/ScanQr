"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export const VerificationGuide: React.FC = () => {
  return (
    <section className="office-card border-office-error-text/20">
      <div className="office-toolbar bg-office-error-bg/20">
        <AlertTriangle className="text-office-error-text" size={16} />
        <span className="office-sm font-bold uppercase tracking-widest text-office-error-text">
          Lỗi &quot;Google hasn&apos;t verified this app&quot;
        </span>
      </div>
      <div className="p-5 space-y-4">
        <p className="office-sm text-office-text leading-relaxed">
          Khi đăng nhập lần đầu, bạn có thể thấy màn hình cảnh báo &quot;Google hasn&apos;t verified this app&quot;. Đây là điều bình
          thường với ứng dụng đang phát triển.
        </p>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-office-primary text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              1
            </div>
            <p className="office-sm text-office-text">
              Nhấn nút <b>Advanced</b> phía dưới thông báo.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-office-primary text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              2
            </div>
            <p className="office-sm text-office-text">
              Nhấn link <b>Go to scanqr-da13a (unsafe)</b> ở cuối trang.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-office-primary text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              3
            </div>
            <p className="office-sm text-office-text">Cấp quyền (Allow) cho các yêu cầu truy cập Sheets API.</p>
          </div>
        </div>

        <div className="bg-office-success-bg/30 border border-office-success-text/20 rounded-office p-4">
          <p className="office-xs font-bold text-office-success-text uppercase">Lưu ý cho Developer:</p>
          <p className="office-xs text-office-success-text mt-1 italic">
            Hãy thêm địa chỉ email của user vào danh sách &quot;Test Users&quot; trong Google Cloud Console mục &quot;OAuth consent
            screen&quot; để được phép đăng nhập.
          </p>
        </div>
      </div>
    </section>
  );
};

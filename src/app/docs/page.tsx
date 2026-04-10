"use client";

import React from "react";
import { BookOpen, HelpCircle, CheckCircle } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-office-primary rounded-office text-white">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-office-text uppercase tracking-tight">Documentation</h1>
          <p className="text-office-text-secondary office-sm">Hướng dẫn sử dụng hệ thống ScanQR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" /> Bắt đầu nhanh
          </h2>
          <ol className="list-decimal list-inside space-y-2 office-xs text-office-text-secondary leading-relaxed">
            <li>Tạo một dự án mới tại màn hình chính.</li>
            <li>Kết nối Google Sheet trong phần Cấu hình sản phẩm.</li>
            <li>Chia sẻ link Scanner cho điện thoại.</li>
            <li>Bắt đầu quét và theo dõi dữ liệu đồng bộ thời gian thực.</li>
          </ol>
        </div>

        <div className="office-card p-6 space-y-4">
          <h2 className="font-bold text-office-text uppercase office-sm flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-600" /> Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            <div>
              <p className="office-xs font-bold text-office-text uppercase">Làm sao để đổi Sheet?</p>
              <p className="office-xs text-office-text-secondary">Vào Settings của dự án đó và chọn lại file từ Google Drive.</p>
            </div>
            <div>
              <p className="office-xs font-bold text-office-text uppercase">Có cần cài App không?</p>
              <p className="office-xs text-office-text-secondary">Không, chỉ cần trình duyệt web trên điện thoại là đủ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

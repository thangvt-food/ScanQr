"use client";

import React, { useState, useCallback } from "react";
import { Keyboard, Loader2, Scan, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to prevent html5-qrcode from running on server
const Scanner = dynamic(() => import("@/components/scanner/Scanner"), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-black w-full max-w-lg aspect-square rounded-3xl flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-white" size={32} />
        <p className="text-white text-xs font-bold uppercase tracking-widest">Loading Scanner Module...</p>
      </div>
    </div>
  )
});

interface RemoteScanManualFormProps {
  fields: { id: string; label: string }[];
  isSyncing: boolean;
  allRecords?: any[];
  onSubmit: (mssv: string, data: Record<string, string>) => void;
}

export const RemoteScanManualForm: React.FC<RemoteScanManualFormProps> = ({ fields, isSyncing, allRecords = [], onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showScanner, setShowScanner] = useState(false);
  const [scanFailCount, setScanFailCount] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastScanInfo, setLastScanInfo] = useState<{ value: string; count: number } | null>(null);

  // Default targets the first field from settings
  // If no fields are provided, fallback to 'mssv'
  const primaryField = fields[0] || { id: 'mssv', label: 'MSSV' };
  const otherFields = fields.slice(1);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = () => {
    const primaryValue = formData[primaryField.id]?.toUpperCase().trim();
    if (!primaryValue) return;

    // Calculate current count from global records
    const currentCount = allRecords.filter(r => r.mssv?.toUpperCase() === primaryValue).length;

    if (currentCount >= 3) {
      setScanError(`Lỗi: Giá trị "${primaryValue}" đã đạt giới hạn 3 lần quét. Không thể lưu thêm.`);
      return;
    }
    
    // We send primaryValue as the main identifier (mssv) for backend compatibility
    onSubmit(primaryValue, formData);
    setFormData({}); // Reset logic
    setScanError(null);
    setLastScanInfo(null);
  };


  const handleScanSuccess = useCallback((val: string) => {
    const newVal = val.toUpperCase().trim();
    
    // Calculate current count from global records
    const currentCount = allRecords.filter(r => r.mssv?.toUpperCase() === newVal).length;

    if (currentCount >= 3) {
      setScanError(`Lỗi: Giá trị "${newVal}" đã được quét tối đa 3 lần trong hệ thống.`);
      setLastScanInfo(null);
      setShowScanner(false);
      return;
    }

    const nextCount = currentCount + 1;
    setLastScanInfo({ value: newVal, count: nextCount });
    
    handleInputChange(primaryField.id, newVal);
    setShowScanner(false);
    setScanFailCount(0);
    setScanError(null);
    
    // Auto-clear success info after a few seconds
    setTimeout(() => setLastScanInfo(null), 5000);
  }, [allRecords, primaryField.id]);

  const handleScanClose = useCallback(() => {
    setShowScanner(false);
    
    // Count as a failed attempt if we haven't succeeded
    const newCount = scanFailCount + 1;
    if (newCount >= 3) {
      setScanError("Lỗi scan: Đã quá 3 lần thử mà không nhận diện được mã. Hệ thống tự động chuyển về nhập tay.");
      setScanFailCount(0);
    } else {
      setScanFailCount(newCount);
    }
  }, [scanFailCount]);

  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="office-card p-5 shadow-xl border-2 border-office-border space-y-6 relative overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* Modern Design Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-office-primary/20 via-office-primary to-office-primary/20" />
        
        <div className="space-y-5">
          {/* Main Field with Scan Integration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="office-xs font-bold text-office-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Keyboard size={14} className="text-office-primary" />
                {primaryField.label} (Trường chính)
              </label>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  placeholder={`NHẬP ${primaryField.label.toUpperCase()}...`} 
                  className="w-full bg-white border-2 border-office-border rounded-2xl py-4 px-5 office-sm font-bold uppercase tracking-widest outline-none focus:border-office-primary focus:ring-4 focus:ring-office-primary/5 transition-all shadow-sm"
                  value={formData[primaryField.id] || ""}
                  onChange={(e) => handleInputChange(primaryField.id, e.target.value)}
                />
              </div>
              <button 
                type="button"
                onClick={() => setShowScanner(true)}
                className="bg-office-primary text-white p-4 rounded-2xl shadow-lg shadow-office-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                title="Mở trình quét QR"
              >
                <Scan size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
            
            <div className="bg-office-bg/50 p-2 rounded-lg border border-office-border/40">
              <p className="text-[10px] text-office-text-muted leading-relaxed">
                <span className="font-bold text-office-primary">Lưu ý:</span> Theo cấu hình hiện tại, dữ liệu quét được sẽ tự động điền vào ô <span className="text-office-text-secondary font-semibold">"{primaryField.label}"</span>.
              </p>
            </div>
          </div>

          {/* Scan Count Feedback / Last Scan Info */}
          {lastScanInfo && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-2xl text-green-700 animate-in slide-in-from-right-2 duration-300">
              <div className="bg-green-500 text-white p-1.5 rounded-full">
                <Scan size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Nhận diện thành công</p>
                <p className="text-xs font-black uppercase tracking-tighter">
                  {lastScanInfo.value} • Đã quét lần {lastScanInfo.count}/3
                </p>
              </div>
            </div>
          )}

          {/* Automatic Error Feedback */}
          {scanError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-in bounce-in duration-500">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle size={18} />
              </div>
              <p className="text-xs font-bold uppercase tracking-tight leading-snug">{scanError}</p>
            </div>
          )}

          {/* Configured Fields Header */}
          {otherFields.length > 0 && (
            <div className="pt-2 border-t border-office-border/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-office-border/30" />
                <span className="office-xs text-office-text-muted font-bold uppercase tracking-tighter px-2">Cấu hình mở rộng</span>
                <div className="h-px flex-1 bg-office-border/30" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {otherFields.map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[10px] font-bold text-office-text-muted uppercase tracking-widest ml-1">{field.label}</label>
                    <input 
                      type="text"
                      placeholder={field.label.toUpperCase()}
                      className="w-full bg-office-bg border border-office-border rounded-xl py-2.5 px-3 office-xs outline-none focus:border-office-primary focus:bg-white transition-all uppercase font-medium"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            disabled={!formData[primaryField.id] || isSyncing}
            onClick={handleFormSubmit}
            className="office-btn-primary w-full py-4 office-sm font-black shadow-xl shadow-office-primary/10 disabled:opacity-50 disabled:grayscale tracking-[0.2em] transition-all relative overflow-hidden group mt-4 rounded-2xl"
          >
            {isSyncing ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2">
                GỬI DỮ LIỆU ĐẾN SERVER
              </span>
            )}
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {showScanner && (
        <Scanner 
          onScanSuccess={handleScanSuccess}
          onClose={handleScanClose}
          onScanError={setScanError}
        />
      )}
    </div>
  );
};

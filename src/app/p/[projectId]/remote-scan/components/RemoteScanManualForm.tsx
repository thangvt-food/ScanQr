"use client";

import React, { useState } from "react";
import { Keyboard, Loader2 } from "lucide-react";

interface RemoteScanManualFormProps {
  fields: { id: string; label: string }[];
  isSyncing: boolean;
  onSubmit: (mssv: string, data: Record<string, string>) => void;
}

export const RemoteScanManualForm: React.FC<RemoteScanManualFormProps> = ({ fields, isSyncing, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({ mssv: "" });

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFormSubmit = () => {
    if (!formData.mssv) return;
    onSubmit(formData.mssv.toUpperCase(), formData);
    setFormData({ mssv: "" }); // Reset after submit
  };

  return (
    <div className="office-card p-4 shadow-lg border-2 border-dashed border-office-border space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-px flex-1 bg-office-border" />
        <span className="office-xs font-bold text-office-text-muted uppercase tracking-widest">Hoặc nhập tay</span>
        <div className="h-px flex-1 bg-office-border" />
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted" size={16} />
          <input 
            type="text" 
            placeholder="NHẬP MSSV / GIÁ TRỊ..." 
            className="w-full bg-white border border-office-border rounded-office py-3 pl-10 pr-4 office-sm font-bold uppercase tracking-widest outline-none focus:border-office-primary transition-all"
            value={formData.mssv}
            onChange={(e) => handleInputChange("mssv", e.target.value)}
          />
        </div>
        
        {fields.filter(f => f.id !== 'mssv').map(field => (
          <input 
            key={field.id}
            type="text"
            placeholder={`NHẬP ${field.label.toUpperCase()}...`}
            className="w-full bg-white border border-office-border rounded-office py-2 px-3 office-xs outline-none focus:border-office-primary transition-all uppercase"
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        ))}

        <button 
          disabled={!formData.mssv || isSyncing}
          onClick={handleFormSubmit}
          className="office-btn-primary w-full py-3 office-sm font-bold shadow-md disabled:opacity-50 tracking-widest transition-all"
        >
          {isSyncing ? <Loader2 className="animate-spin mx-auto" /> : "GỬI DỮ LIỆU THỦ CÔNG"}
        </button>
      </div>
    </div>
  );
};

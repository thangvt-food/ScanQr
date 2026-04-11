"use client";

import React, { useState } from "react";
import { useConfigStore, SchemaField } from "@/hooks/useConfigStore";
import { Plus, Trash2, ListTree, GripVertical } from "lucide-react";

export const SchemaEditor = () => {
  const { fields, setFields, addField, removeField } = useConfigStore();
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    
    const id = newFieldLabel.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    addField({ id, label: newFieldLabel });
    setNewFieldLabel("");
  };

  const updateFieldLabel = (id: string, newLabel: string) => {
    const updated = fields.map(f => f.id === id ? { ...f, label: newLabel } : f);
    setFields(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="text-office-primary" size={18} />
          <h3 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Google Sheets Columns</h3>
        </div>
        <span className="office-xs text-office-text-muted">{fields.length} columns defined</span>
      </div>

      <div className="office-card overflow-hidden">
        <table className="w-full office-sm">
          <thead className="bg-office-header border-b border-office-border">
            <tr>
              <th className="px-4 py-2 text-left text-office-text-muted font-bold office-xs w-10">#</th>
              <th className="px-4 py-2 text-left text-office-text-muted font-bold office-xs">COLUMN LABEL (Display & Google Sheets)</th>
              <th className="px-4 py-2 text-right text-office-text-muted font-bold office-xs w-20">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-office-border/50">
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-office-bg/30">
                <td className="px-4 py-2 text-office-text-muted flex items-center gap-2">
                   <GripVertical size={14} className="cursor-grab active:cursor-grabbing text-office-border" />
                   {index + 1}
                </td>
                <td className="px-4 py-2">
                  <input 
                    type="text" 
                    value={field.label}
                    onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 office-sm font-medium text-office-text p-0 outline-none"
                    disabled={field.id === "mssv"}
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  {field.id !== "mssv" && (
                    <button 
                      onClick={() => removeField(field.id)}
                      className="text-office-text-muted hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAddField} className="flex gap-2">
        <input 
          type="text" 
          placeholder="New column name (e.g. Note, Status, Room...)"
          value={newFieldLabel}
          onChange={(e) => setNewFieldLabel(e.target.value)}
          className="flex-1 bg-office-surface border border-office-border px-3 py-2 rounded-office office-sm outline-none focus:border-office-primary"
        />
        <button 
          type="submit"
          disabled={!newFieldLabel.trim()}
          className="office-btn-secondary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          <Plus size={16} />
          Add Column
        </button>
      </form>
      
      <div className="bg-blue-50 border border-blue-100 rounded-office p-3 flex gap-3">
        <Plus className="text-blue-500 shrink-0" size={18} />
        <p className="office-xs text-blue-700">
           <b>Lưu ý:</b> Cột &quot;MSSV&quot; luôn được cố định vì là dữ liệu quét từ mã QR. Thứ tự các hàng trong bảng này tương ứng với thứ tự các cột (A, B, C...) trên Google Sheet.
        </p>
      </div>
    </div>
  );
};

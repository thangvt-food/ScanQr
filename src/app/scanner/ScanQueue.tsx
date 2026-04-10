"use client";

import React from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { ScanRecord } from "@/hooks/useScanStore";
import { useConfigStore } from "@/hooks/useConfigStore";

interface ScanQueueProps {
  records: ScanRecord[];
  onRemoveRecord: (id: string) => void;
  onUpdateData: (id: string, fieldId: string, value: string) => void;
}

export const ScanQueue: React.FC<ScanQueueProps> = ({ records, onRemoveRecord, onUpdateData }) => {
  const { fields } = useConfigStore();

  return (
    <div className="office-card min-h-[400px] flex flex-col">
      <div className="office-toolbar justify-between">
        <span className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Local Storage Queue</span>
        <div className="flex items-center gap-4">
          <span className="office-xs text-office-text-muted italic">Persisted in Browser</span>
        </div>
      </div>
      
      {records.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 bg-office-bg rounded-full text-office-text-muted mb-4 opacity-50">
            <UserPlus size={48} />
          </div>
          <h3 className="office-base font-bold text-office-text-secondary">No local records found</h3>
          <p className="office-xs text-office-text-muted mt-2 max-w-xs">
            Data is saved automatically to your browser storage even if you close this tab.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full office-sm">
            <thead>
              <tr className="bg-office-header text-left">
                {fields.map(field => (
                  <th key={field.id} className="px-5 py-3 font-bold text-office-text-secondary border-b border-office-border uppercase office-xs tracking-wider">
                    {field.label}
                  </th>
                ))}
                <th className="px-5 py-3 font-bold text-office-text-secondary border-b border-office-border uppercase office-xs tracking-wider">Timestamp</th>
                <th className="px-5 py-3 font-bold text-office-text-secondary border-b border-office-border uppercase office-xs tracking-wider">Status</th>
                <th className="px-5 py-3 font-bold text-office-text-secondary border-b border-office-border uppercase office-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-office-border/50">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-office-header transition-colors">
                  {fields.map(field => (
                    <td key={field.id} className="px-5 py-2.5">
                      {field.id === "mssv" ? (
                        <span className="font-bold text-office-primary">{record.mssv}</span>
                      ) : (
                        <input 
                          type="text" 
                          value={record.data[field.id] || ""}
                          onChange={(e) => onUpdateData(record.id, field.id, e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 office-sm text-office-text p-0 outline-none"
                          placeholder="..."
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-2.5 text-office-text-secondary italic">
                    {new Date(record.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full office-xs font-bold uppercase ${
                      record.isSynced 
                        ? 'bg-office-success-bg text-office-success-text' 
                        : 'bg-office-warning-bg text-office-warning-text'
                    }`}>
                      {record.isSynced ? 'Synced' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {!record.isSynced && (
                      <button 
                        onClick={() => onRemoveRecord(record.id)}
                        className="office-btn-ghost text-red-600 hover:bg-red-50 p-1"
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
      )}
    </div>
  );
};

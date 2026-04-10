"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useScanStore } from "@/hooks/useScanStore";
import { 
  History, 
  CheckCircle, 
  Clock, 
  Database,
  Search,
  Download
} from "lucide-react";

export default function ProjectHistoryPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { projectRecords } = useScanStore();
  const records = projectRecords[projectId] || [];
  
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredRecords = records.filter(r => 
    r.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(r.data).some(val => val.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

  const syncedCount = records.filter(r => r.isSynced).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="office-card p-4 flex-1 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-office">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Synced Records</p>
            <p className="text-xl font-black text-office-text">{syncedCount}</p>
          </div>
        </div>
        <div className="office-card p-4 flex-1 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-office">
            <Clock size={20} />
          </div>
          <div>
            <p className="office-xs font-bold text-office-text-secondary uppercase">Pending Sync</p>
            <p className="text-xl font-black text-office-text">{records.length - syncedCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="office-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-office-text-muted" size={16} />
          <input 
            type="text"
            placeholder="Search records (MSSV, Name...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="office-input w-full pl-10"
          />
        </div>
        <button 
          onClick={() => alert("CSV Export feature coming soon!")}
          className="office-btn-secondary flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* History Table */}
      <div className="office-card overflow-hidden">
        <div className="office-toolbar">
          <History size={16} className="text-office-primary" />
          <span className="office-sm font-bold uppercase tracking-widest text-office-text-secondary">Scan History</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full office-xs text-left border-collapse">
            <thead className="bg-office-header">
              <tr>
                <th className="px-6 py-3 border-b border-office-border text-office-text-muted">TIME</th>
                <th className="px-6 py-3 border-b border-office-border text-office-text-muted">MSSV</th>
                <th className="px-6 py-3 border-b border-office-border text-office-text-muted">STATUS</th>
                <th className="px-6 py-3 border-b border-office-border text-office-text-muted text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-office-border/50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-office-bg transition-colors group">
                    <td className="px-6 py-4 text-office-text-secondary">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-office-text">
                      {record.mssv}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase leading-tight ${
                        record.isSynced 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {record.isSynced ? "Synced" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Placeholder for detail view/edit */}
                      <button className="text-office-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-office-text-muted italic">
                    No records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

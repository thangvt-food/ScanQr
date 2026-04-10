"use client";

import React from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

interface DataTableProps {
  isLoading: boolean;
  data: string[][];
  filteredData: string[][];
}

export const DataTable: React.FC<DataTableProps> = ({ isLoading, data, filteredData }) => {
  return (
    <div className="office-card overflow-hidden flex-1 flex flex-col min-h-[500px]">
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <RefreshCw size={40} className="text-office-primary animate-spin mb-4" />
          <p className="text-office-text-secondary office-sm animate-pulse font-bold uppercase tracking-widest">
            Connecting to Google Cloud...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
          <AlertCircle size={40} className="text-office-text-muted mb-4 opacity-50" />
          <p className="text-office-text-secondary office-sm">No data found in this sheet.</p>
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full office-xs text-left border-collapse">
            <thead className="sticky top-0 bg-office-header shadow-sm z-10">
              <tr>
                <th className="px-4 py-2 border-b border-office-border font-bold text-office-text-secondary uppercase tracking-wider w-12 text-center">
                  Row
                </th>
                {data[0]?.map((header, i) => (
                  <th
                    key={header + i}
                    className="px-4 py-2 border-b border-office-border font-bold text-office-text-secondary uppercase tracking-wider border-l border-office-border/30"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-office-border/50">
              {filteredData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-office-bg transition-colors odd:bg-office-surface/50">
                  <td className="px-4 py-1.5 border-r border-office-border/30 text-center text-office-text-muted font-mono">
                    {rowIndex + 2}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-1.5 text-office-text border-l border-office-border/30 truncate max-w-[200px]"
                      title={cell}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

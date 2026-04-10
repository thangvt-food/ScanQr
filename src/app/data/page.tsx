"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useConfigStore } from "@/hooks/useConfigStore";
import { Download } from "lucide-react";

// Components
import { DataAuthGuard } from "./components/DataAuthGuard";
import { NoSpreadsheetGuard } from "./components/NoSpreadsheetGuard";
import { DataPageHeader } from "./components/DataPageHeader";
import { DataTableToolbar } from "./components/DataTableToolbar";
import { DataTable } from "./components/DataTable";

// Hooks (Services)
import { useSheetsData } from "./hooks/useSheetsData";

const DataManagementPage = () => {
  const { user, accessToken, login } = useAuth();
  const { spreadsheetId, sheetName, sheetId } = useConfigStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { data, isLoading, error, fetchData } = useSheetsData({
    user,
    accessToken,
    spreadsheetId,
    sheetName
  });

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const filteredData = data.filter(row => 
    row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openSheet = () => {
    if (spreadsheetId) {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${sheetId}`;
      window.open(url, "_blank");
    }
  };

  // Guard Clauses
  if (!user || !accessToken) {
    return <DataAuthGuard user={user} login={login} />;
  }

  if (!spreadsheetId) {
    return <NoSpreadsheetGuard />;
  }

  return (
    <div className="space-y-6">
      <DataPageHeader 
        sheetName={sheetName}
        hasHydrated={hasHydrated}
        isLoading={isLoading}
        fetchData={fetchData}
        openSheet={openSheet}
      />

      <DataTableToolbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalRows={data.length}
      />

      <DataTable 
        isLoading={isLoading}
        data={data}
        filteredData={filteredData}
      />
      
      <div className="flex justify-end p-2">
         <p className="office-xs text-office-text-muted italic flex items-center gap-1">
            <Download size={12} />
            Dữ liệu được lấy trực tiếp từ Google Sheets API.
         </p>
      </div>
    </div>
  );
};

export default DataManagementPage;

"use client";

import { useState, useEffect } from "react";

interface UseSheetsDataProps {
  user: any;
  accessToken: string | null;
  spreadsheetId: string;
  sheetName: string;
}

export const useSheetsData = ({ user, accessToken, spreadsheetId, sheetName }: UseSheetsDataProps) => {
  const [data, setData] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!accessToken || !spreadsheetId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/google/fetch-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, accessToken, spreadsheetId, sheetName }),
      });
      const result = await res.json();
      if (result.values) {
        setData(result.values);
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && spreadsheetId) {
      fetchData();
    }
  }, [accessToken, spreadsheetId, sheetName]);

  return { data, isLoading, error, fetchData };
};

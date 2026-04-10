import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ScanRecord {
  id: string;
  mssv: string;
  data: Record<string, string>;
  timestamp: string;
  isSynced: boolean;
}

interface ScanState {
  // records is now a map of projectId -> ScanRecord[]
  projectRecords: Record<string, ScanRecord[]>;
  addRecord: (projectId: string, mssv: string, data: Record<string, string>) => void;
  updateRecordData: (projectId: string, id: string, fieldId: string, value: string) => void;
  removeRecord: (projectId: string, id: string) => void;
  clearRecords: (projectId: string) => void;
  markAsSynced: (projectId: string, ids: string[]) => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      projectRecords: {},
      
      addRecord: (projectId, mssv, data) => set((state) => {
        const records = state.projectRecords[projectId] || [];
        const newRecord: ScanRecord = {
          mssv,
          data,
          id: Math.random().toString(36).substring(2, 11),
          isSynced: false,
          timestamp: new Date().toISOString(),
        };
        return {
          projectRecords: {
            ...state.projectRecords,
            [projectId]: [newRecord, ...records]
          }
        };
      }),

      updateRecordData: (projectId, id, fieldId, value) => set((state) => {
        const records = state.projectRecords[projectId] || [];
        return {
          projectRecords: {
            ...state.projectRecords,
            [projectId]: records.map((r) => 
              r.id === id ? { ...r, data: { ...r.data, [fieldId]: value } } : r
            )
          }
        };
      }),

      removeRecord: (projectId, id) => set((state) => {
        const records = state.projectRecords[projectId] || [];
        return {
          projectRecords: {
            ...state.projectRecords,
            [projectId]: records.filter((r) => r.id !== id)
          }
        };
      }),

      clearRecords: (projectId) => set((state) => ({
        projectRecords: {
          ...state.projectRecords,
          [projectId]: []
        }
      })),

      markAsSynced: (projectId, ids) => set((state) => {
        const records = state.projectRecords[projectId] || [];
        return {
          projectRecords: {
            ...state.projectRecords,
            [projectId]: records.map((r) => 
              ids.includes(r.id) ? { ...r, isSynced: true } : r
            )
          }
        };
      }),
    }),
    {
      name: "scan-storage-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

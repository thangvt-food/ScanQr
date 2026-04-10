import { create } from "zustand";

export interface SchemaField {
  id: string;
  label: string;
}

interface ConfigState {
  spreadsheetId: string;
  sheetName: string;
  sheetId: string; // Numerical GID of the sheet tab
  fields: SchemaField[];
  setSpreadsheetId: (id: string) => void;
  setSheetName: (name: string) => void;
  setSheetId: (id: string) => void;
  setFields: (fields: SchemaField[]) => void;
  addField: (field: SchemaField) => void;
  removeField: (id: string) => void;
  setConfig: (config: Partial<ConfigState>) => void;
}

export const useConfigStore = create<ConfigState>()(
  (set) => ({
    spreadsheetId: "",
    sheetName: "Sheet1",
    sheetId: "0",
    fields: [
      { id: "mssv", label: "MSSV" },
      { id: "name", label: "Họ Tên" },
      { id: "class", label: "Lớp" },
    ],
    setSpreadsheetId: (id) => set({ spreadsheetId: id }),
    setSheetName: (name) => set({ sheetName: name }),
    setSheetId: (id) => set({ sheetId: id }),
    setFields: (fields) => set({ fields }),
    addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
    removeField: (id) => set((state) => ({ fields: state.fields.filter(f => f.id !== id) })),
    setConfig: (config) => set((state) => ({ ...state, ...config })),
  })
);

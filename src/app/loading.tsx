import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 border-4 border-office-primary border-t-transparent rounded-full animate-spin" />
      <div className="flex flex-col items-center">
        <h2 className="office-sm font-bold text-office-text-secondary uppercase tracking-widest animate-pulse">
          Loading Content
        </h2>
        <p className="office-xs text-office-text-muted">Synchronizing with workspace data...</p>
      </div>
    </div>
  );
}

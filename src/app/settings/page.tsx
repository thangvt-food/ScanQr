"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <p className="office-sm font-bold text-office-text-secondary uppercase">Settings are now project-specific.</p>
        <p className="office-xs text-office-text-muted">Redirecting to Workspace to select a project...</p>
      </div>
    </div>
  );
}

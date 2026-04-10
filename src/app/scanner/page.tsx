"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScannerRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="office-sm font-bold text-office-text-secondary uppercase animate-pulse">Redirecting to Workspace...</p>
    </div>
  );
}

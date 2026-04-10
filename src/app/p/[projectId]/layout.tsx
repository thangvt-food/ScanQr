"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { projectService, ProjectConfig } from "@/lib/projectService";
import { 
  Loader2, 
  QrCode, 
  Settings, 
  LayoutDashboard, 
  ChevronRight,
  Database,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) return;

    const unsubscribe = projectService.getProject(user.uid, projectId, (data) => {
      setProject(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, projectId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-office-primary" size={32} />
        <p className="office-sm font-bold text-office-text-secondary uppercase tracking-widest">Loading Project Context...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-office-text uppercase">Project Not Found</h2>
        <p className="text-office-text-secondary office-sm">The project you're looking for doesn't exist or you don't have access.</p>
        <button onClick={() => router.push("/")} className="office-btn-primary w-full">Back to Workspace</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-Header / Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-office-border pb-6">
        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="p-2 hover:bg-office-bg rounded-full text-office-text-secondary transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 office-sm font-bold text-office-text-secondary uppercase tracking-widest">
            <span>Workspace</span>
            <ChevronRight size={14} className="text-office-text-muted" />
            <span className="text-office-primary font-black px-2 py-0.5 bg-office-primary/10 rounded uppercase">
              {project.name}
            </span>
          </div>
        </div>

        <div className="office-xs text-office-text-muted font-bold uppercase tracking-widest bg-office-bg px-3 py-1 rounded-full border border-office-border">
          Project Mode
        </div>
      </div>

      {/* Module Content */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </main>
    </div>
  );
}

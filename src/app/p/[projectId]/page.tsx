"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectIndexRedirect() {
  const params = useParams();
  const router = useRouter();
  
  useEffect(() => {
    router.replace(`/p/${params.projectId}/dashboard`);
  }, [router, params.projectId]);

  return null;
}

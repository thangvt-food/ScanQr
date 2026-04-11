import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { ownerUid, projectId, session } = await req.json();

    if (!ownerUid || !projectId || !session?.id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sessionRef = db.ref(`users/${ownerUid}/projects/${projectId}/activeSessions/${session.id}`);
    
    await sessionRef.set({
      ...session,
      lastActive: Date.now()
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

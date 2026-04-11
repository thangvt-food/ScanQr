import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { ownerUid, projectId, record } = await req.json();

    if (!ownerUid || !projectId || !record?.mssv) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recordsRef = db.ref(`users/${ownerUid}/projects/${projectId}/records`);
    const newRecordRef = recordsRef.push();
    
    await newRecordRef.set({
      ...record,
      id: newRecordRef.key,
      timestamp: Date.now(),
      isSynced: false
    });

    return NextResponse.json({ success: true, id: newRecordRef.key });
  } catch (error: any) {
    console.error("API Record Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

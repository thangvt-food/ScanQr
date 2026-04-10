import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/token-manager";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  let userId, projectId, records;
  
  try {
    const body = await req.json();
    userId = body.userId;
    projectId = body.projectId;
    const accessToken = body.accessToken;
    records = body.records;

    if (!userId || !projectId || !records || records.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const statusRef = db.ref(`users/${userId}/projects/${projectId}/syncStatus`);
    
    const updateStatus = async (stage: string, message: string, details?: any) => {
      await statusRef.set({
        stage,
        message,
        details: details || null,
        timestamp: Date.now(),
        isError: stage === "ERROR",
        isComplete: stage === "COMPLETED"
      });
    };

    await updateStatus("STARTING", "Initializing sync process...");

    // 1. Fetch the LATEST project config
    await updateStatus("VALIDATING", "Fetching project configuration...");
    const projectSnapshot = await db.ref(`users/${userId}/projects/${projectId}`).once("value");
    const project = projectSnapshot.val();

    if (!project) {
      await updateStatus("ERROR", "Project not found in database.");
      return NextResponse.json({ 
        error: "PROJECT_NOT_FOUND",
        details: `We couldn't find project ${projectId} for user ${userId}.`
      }, { status: 404 });
    }

    if (!project.spreadsheetId) {
      await updateStatus("ERROR", "Spreadsheet mismatch: No ID configured.");
      return NextResponse.json({ 
        error: "PROJECT_INCOMPLETE",
        details: "The project exists but has no Google Spreadsheet ID connected."
      }, { status: 400 });
    }

    const { spreadsheetId, sheetName, fields } = project;

    // 2. Get a valid access token (refresh if needed)
    await updateStatus("AUTH", "Verifying Google Authentication...");
    let validToken;
    try {
      validToken = await getValidAccessToken(userId, accessToken);
    } catch (e: any) {
      await updateStatus("ERROR", "Authentication failed: Please login again.");
      return NextResponse.json({ 
        error: "AUTH_FAILED", 
        details: e.message 
      }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: validToken });

    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = sheetName || "Data";

    // Prepare data for Google Sheets
    const values = records.map((r: any) => {
      return fields.map((field: any) => {
        if (field.id === "mssv") return r.mssv;
        return r.data[field.id] || "";
      }).concat([
        new Date(r.timestamp).toLocaleString("vi-VN"),
        "Synced"
      ]);
    });

    await updateStatus("SYNCING", `Writing ${records.length} records to "${targetSheet}"...`);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${targetSheet}'!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    await updateStatus("COMPLETED", "Successfully synced all records.");
    
    // Clear status after a short delay or just leave it as COMPLETED
    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    console.error("Google Sheets Sync Error:", error);
    
    if (userId && projectId) {
      const statusRef = db.ref(`users/${userId}/projects/${projectId}/syncStatus`);
      await statusRef.set({
        stage: "ERROR",
        message: error.message || "Unknown server error",
        details: error.response?.data || error.errors || null,
        timestamp: Date.now(),
        isError: true,
        isComplete: false
      });
    }

    return NextResponse.json({ 
      error: error.message, 
      details: error.response?.data || error.errors 
    }, { status: 500 });
  }
}

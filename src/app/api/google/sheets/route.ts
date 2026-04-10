import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/token-manager";

export async function POST(req: Request) {
  try {
    const { userId, accessToken, spreadsheetId } = await req.json();

    if (!userId || !spreadsheetId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Get a valid access token (refresh if needed)
    let validToken;
    try {
      validToken = await getValidAccessToken(userId, accessToken);
    } catch (e: any) {
      return NextResponse.json({ error: "Authentication required", details: e.message }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: validToken });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetsList = response.data.sheets?.map(s => ({
      id: s.properties?.sheetId?.toString() || "0",
      title: s.properties?.title || "Sheet1"
    })) || [];

    return NextResponse.json({ sheets: sheetsList });
  } catch (error: any) {
    console.error("List Sheets Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

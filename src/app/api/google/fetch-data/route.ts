import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/token-manager";

export async function POST(req: Request) {
  try {
    const { userId, accessToken, spreadsheetId, sheetName } = await req.json();

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
    const range = `${sheetName || "Sheet1"}!A:Z`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return NextResponse.json({ values: response.data.values || [] });
  } catch (error: any) {
    console.error("Fetch Data Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

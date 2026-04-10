import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/token-manager";

export async function POST(req: Request) {
  try {
    const { userId, accessToken } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const drive = google.drive({ version: "v3", auth });

    // List all spreadsheets
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'",
      fields: "files(id, name, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 20,
    });

    return NextResponse.json({ files: response.data.files });
  } catch (error: any) {
    console.error("List Spreadsheets Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

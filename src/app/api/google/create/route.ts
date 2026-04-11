import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken, title } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call Google Sheets API to create a new spreadsheet with an explicit sheet name
    const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: title || "New ScanQR Spreadsheet",
        },
        sheets: [
          {
            properties: {
              title: "Data",
            },
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to create spreadsheet");
    }

    const spreadsheetId = data.spreadsheetId;

    // Set permission to 'anyone' as 'writer' so it can be edited in the iframe
    // This requires the 'https://www.googleapis.com/auth/drive.file' scope
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "writer",
          type: "anyone",
        }),
      });
    } catch (e) {
      console.warn("Failed to set public permissions, but spreadsheet was created", e);
    }

    return NextResponse.json({
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetUrl: data.spreadsheetUrl,
    });
  } catch (error: any) {
    console.error("Create Spreadsheet Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

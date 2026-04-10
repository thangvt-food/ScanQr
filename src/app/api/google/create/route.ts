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

    return NextResponse.json({
      success: true,
      spreadsheetId: data.spreadsheetId,
      spreadsheetUrl: data.spreadsheetUrl,
    });
  } catch (error: any) {
    console.error("Create Spreadsheet Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

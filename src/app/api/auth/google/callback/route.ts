import admin from "firebase-admin";
import { getTokensFromCode } from "@/lib/google-auth";
import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state"); // UID passed as state

  if (!code || !userId) {
    return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
  }

  try {
    const tokens = await getTokensFromCode(code);
    
    // Save refresh token to RTDB
    if (tokens.refresh_token) {
      await db.ref(`users/${userId}/tokens`).set({
        refresh_token: tokens.refresh_token,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
      });
    }

    // Return a script to close the popup and notify the parent window
    return new NextResponse(
      `<html>
        <body>
          <script>
            window.opener.postMessage({ 
              type: 'GOOGLE_AUTH_SUCCESS', 
              accessToken: '${tokens.access_token}' 
            }, window.location.origin);
            window.close();
          </script>
          Loading...
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

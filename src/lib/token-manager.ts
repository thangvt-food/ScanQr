import { google } from "googleapis";
import { db } from "./firebase-admin";

export async function getValidAccessToken(userId: string, currentToken?: string | null) {
  // 1. Try with current token if provided
  if (currentToken) {
    try {
      const auth = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      auth.setCredentials({ access_token: currentToken });
      // Validate or dummy call (optional, simpler to just use it and handle 401 later, 
      // but let's try to get a fresh one if we have a refresh token)
    } catch (e) {
      // Proceed to refresh
    }
  }

  // 2. Fetch Refresh Token from RTDB
  const snapshot = await db.ref(`users/${userId}/tokens`).once("value");
  const data = snapshot.val();

  if (!data || !data.refresh_token) {
    throw new Error("No refresh token found. User must re-authenticate.");
  }

  // 3. Get fresh access token
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: data.refresh_token });
  
  const { token } = await oauth2Client.getAccessToken();
  if (!token) throw new Error("Failed to refresh access token");

  return token;
}

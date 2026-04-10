import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBS0PmkUsbOjBPxIXZnwGu6Uz0se2A4gRA",
  authDomain: "scanqr-da13a.firebaseapp.com",
  databaseURL: "https://scanqr-da13a-default-rtdb.firebaseio.com",
  projectId: "scanqr-da13a",
  storageBucket: "scanqr-da13a.firebasestorage.app",
  messagingSenderId: "511921408075",
  appId: "1:511921408075:web:2ca3de344a266842e165ce",
  measurementId: "G-PVD64LC5FR"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// Google Auth Provider with necessary scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/spreadsheets");
googleProvider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");
// Ensure we get the access token and ask for permission again if needed
googleProvider.setCustomParameters({
  prompt: "consent",
});

export { auth, db, rtdb, googleProvider };

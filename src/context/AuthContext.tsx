"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  accessToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("google_access_token");
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Step 2: Ensure we have a refresh token in RTDB
      // We'll open a popup to our /api/auth/google/url which forces consent for refresh_token
      const res = await fetch(`/api/auth/google/url?userId=${user.uid}`);
      const { url } = await res.json();
      
      const popup = window.open(url, "Google Auth", "width=500,height=600");
      
      // Listen for success message from the callback window
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
           setAccessToken(event.data.accessToken);
           localStorage.setItem("google_access_token", event.data.accessToken);
           window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAccessToken(null);
    localStorage.removeItem("google_access_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

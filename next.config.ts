import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // swcMinify: true, // Enabled by default in modern Next.js

  // Fix HMR/WebSocket origins for tunnel/IP access
  allowedDevOrigins: ['26.243.185.95', 'localhost:3000', 'my-pro-app.loca.lt'],

  experimental: {
    serverActions: {
      allowedOrigins: ['26.243.185.95', 'localhost:3000', 'my-pro-app.loca.lt'],
    },

    optimizePackageImports: [
      "lucide-react", 
      "googleapis", 
      "firebase", 
      "firebase-admin",
      "html5-qrcode", 
      "zod", 
      "zustand", 
      "@hookform/resolvers", 
      "react-hook-form"
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Bỏ qua lỗi TypeScript để build nhanh hơn (tốt cho giai đoạn dev/testing)
  typescript: { 
    ignoreBuildErrors: true 
  },
};

export default nextConfig;
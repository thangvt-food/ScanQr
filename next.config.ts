/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to reduce double-renders and speed up dev
  swcMinify: true, // Use high-performance Rust compiler
  experimental: {
    serverActions: {
      allowedOrigins: ['26.243.185.95', 'localhost:3000'],
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
  devIndicators: {
    appIsrStatus: true,
  },
  allowedDevOrigins: ['26.243.185.95'],
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
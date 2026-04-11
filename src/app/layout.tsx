import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScanQR Admin - Office Desktop",
  description: "Hệ thống quản trị quét mã QR chuyên nghiệp",
};

import { Providers } from "@/components/Providers";
import DeviceGuard from "@/components/layout/DeviceGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full">
        <Providers>
          <DeviceGuard>
            <MainLayout>{children}</MainLayout>
          </DeviceGuard>
        </Providers>
      </body>
    </html>
  );
}

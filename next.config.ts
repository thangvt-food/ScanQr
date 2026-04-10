/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['26.243.185.95', 'localhost:3000'],
    },
  },
  // Nếu phiên bản Next.js của bạn yêu cầu trực tiếp allowedDevOrigins:
  devIndicators: {
    appIsrStatus: true,
  },
  // Thêm dòng này theo hướng dẫn của thông báo lỗi bạn nhận được:
  allowedDevOrigins: ['26.243.185.95'],
};

export default nextConfig;
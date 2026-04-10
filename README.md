# 🚀 ScanQr - Hệ Thống Điểm Danh QR Multi-Project

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)](https://www.google.com/sheets/about/)

**ScanQr** là một nền tảng web hiện đại được thiết kế để quản lý điểm danh và thu thập dữ liệu thông qua mã QR trên nhiều dự án khác nhau. Hệ thống tích hợp sâu với Google Sheets để đồng bộ dữ liệu thời gian thực và sử dụng Firebase để quản lý trạng thái ứng dụng.

## ✨ Tính Năng Nổi Bật

- **Quản Lý Đa Dự Án (Multi-Project):** Quản lý nhiều chiến dịch/dự án quét mã QR khác nhau trên cùng một nền tảng.
- **Quét Mã QR Hiệu Suất Cao:** Tích hợp trình quét mã QR mượt mà, hỗ trợ nhiều loại thiết bị.
- **Đồng Bộ Google Sheets Thông Minh:** Tự động tạo và cập nhật dữ liệu vào trang tính Google Sheets theo từng dự án.
- **Thiết Kế "Office Desktop":** Giao diện chuyên nghiệp, tối ưu cho năng suất làm việc, lấy cảm hứng từ các ứng dụng văn phòng hiện đại.
- **Phân Quyền & Bảo Mật:** Hệ thống Admin mạnh mẽ để quản lý cấu hình và theo dõi hoạt động.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** Next.js 15 (App Router), React, CSS Modules (Office Design System).
- **Backend/Database:** Firebase Realtime Database, Firestore, Firebase Admin SDK.
- **Integration:** Google OAuth2, Google Sheets API v4.
- **Deployment:** Vercel.

## 🚀 Hướng Dẫn Cài Đặt

### 1. Clone Repository
```bash
git clone https://github.com/aczaao12/ScanQr.git
cd ScanQr
```

### 2. Cấu Hình Biến Môi Trường
Tạo file `.env.local` tại thư mục gốc và cấu hình các thông số sau:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... bổ sung các key khác
```

### 3. Cài Đặt Dependencies
```bash
pnpm install
# hoặc
npm install
```

### 4. Chạy Development
```bash
pnpm dev
```

## 📄 Giấy Phép
Dự án được phát triển bởi **aczaao12**. Mọi quyền được bảo lưu.

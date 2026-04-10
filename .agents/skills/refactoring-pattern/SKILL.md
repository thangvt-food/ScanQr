---
name: refactoring-pattern
description: Quy chuẩn refactor component và logic cho dự án Next.js (App Router), phân biệt rõ cấu trúc local (nội bộ page) và global (chung).
---

# Next.js Refactoring Pattern (App Router)

Bộ skill này hướng dẫn cách chia nhỏ một trang (`page.tsx`) cồng kềnh thành các component và service (hooks) nhỏ gọn, đảm bảo tính sạch sẽ và dễ bảo trì.

## 1. Phân cấp Cấu trúc (Local vs Global)

### A. Nội bộ Page (Local - Ưu tiên)
Nếu component hoặc logic **chỉ dùng cho một route duy nhất**, hãy lưu chúng ngay tại thư mục của route đó. Điều này giúp tránh làm "ô nhiễm" thư mục global và dễ dàng tìm kiếm khi sửa trang đó.

- **UI Components:** `src/app/[route]/components/`
  - Ví dụ: `src/app/data/components/DataTable.tsx`
- **Logic/Services (Hooks):** `src/app/[route]/hooks/`
  - Ví dụ: `src/app/data/hooks/useSheetsData.ts`

### B. Toàn cục (Global)
Nếu component hoặc logic **được dùng cho từ 2 trang trở lên**, hãy đưa chúng ra các thư mục chung.

- **UI Components:** `src/components/`
  - Ví dụ: `src/components/ui/Button.tsx`, `src/components/config/SchemaEditor.tsx`
- **Shared Hooks:** `src/hooks/`
  - Ví dụ: `src/hooks/useConfigStore.ts`
- **Context/Providers:** `src/context/`

---

## 2. Quy trình Refactor 4 Bước

### Bước 1: Nhận diện Khối (Logical Blocks)
Phân tích `page.tsx` và xác định các phần có thể đứng độc lập:
- **Guards:** (Auth check, Loading, Error states)
- **Header/Footer:** (Title, Actions bar)
- **Main Content:** (Bảng, Form, List)
- **Overlay/Modals:** (Dialogs, Toggles)

### Bước 2: Tách Logic (Service/Hook)
Nếu trang có logic phức tạp (fetch API, tính toán dữ liệu, state management), hãy trích xuất vào một Custom Hook.
- Tên hook bắt đầu bằng `use...`.
- Để hook tại `src/app/[route]/hooks/`.

### Bước 3: Tạo Sub-Components
Tạo file mới cho mỗi khối đã nhận diện tại `src/app/[route]/components/`.
- Sử dụng **TypeScript Interface** rõ ràng cho Props.
- Đảm bảo component là "Pure" nhất có thể (nhận props và hiển thị).

### Bước 4: Hợp nhất tại Page
Cập nhật `page.tsx` để:
- Gọi Hook lấy dữ liệu/state.
- Truyền dữ liệu xuống các Sub-Components qua Props.
- `page.tsx` lúc này chỉ đóng vai trò là "Orchestrator" (người điều phối).

---

## 3. Quy tắc Đặt tên

- **Component:** PascalCase (ví dụ: `SpreadsheetSelector.tsx`). Nên có tiền tố liên quan đến tính năng nếu cần (ví dụ: `DataAuthGuard.tsx`).
- **Hook:** camelCase (ví dụ: `useSheetsData.ts`).
- **Props Interface:** `[ComponentName]Props` (ví dụ: `interface DataTableProps { ... }`).

---

## 4. Ví dụ Điển hình

| Trước khi Refactor | Sau khi Refactor |
| :--- | :--- |
| `page.tsx` (500 lines) | `page.tsx` (100 lines) |
| Logic fetch API nằm trong `useEffect` của page | Logic nằm trong `useSheetsData` hook |
| JSX lồng nhau nhiều tầng | Mỗi section là một component (e.g., `<DataHeader />`, `<DataTable />`) |
| Khó debug vì state quá nhiều | Debug dễ dàng tại từng component/hook riêng lẻ |

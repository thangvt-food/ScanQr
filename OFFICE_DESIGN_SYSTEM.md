# Office Desktop Design System (Business Aesthetic)

Tài liệu này định nghĩa hệ quy chuẩn thiết kế "Office Desktop" được áp dụng cho hệ thống quản trị DH23VT. Phong cách này ưu tiên sự chuyên nghiệp, sạch sẽ, mật độ thông tin cao và tính thực dụng (Productivity-First).

---

## 1. Bảng màu (Color Palette)

Hệ màu được lấy cảm hứng từ các ứng dụng năng suất chuyên nghiệp (Microsoft Office, Windows System).

| Vai trò | Mã màu | Ứng dụng |
|:---|:---|:---|
| **Primary (Office Blue)** | `#0078d4` | Button chính, title modal, trạng thái focus, link. |
| **Primary Hover** | `#106ebe` | Trạng thái hover của các thành phần chính. |
| **Background (Main)** | `#f3f2f1` | Màu nền của layout chính. |
| **Surface (White)** | `#ffffff` | Màu nền của các card, container, bảng. |
| **Header/Toolbar** | `#faf9f8` | Màu nền của các thanh công cụ, header bảng. |
| **Border (Soft)** | `#edebe9` | Viền của các container, bảng, input. |
| **Border (Darker)** | `#d2d0ce` | Viền của các nút bấm thứ cấp hoặc trạng thái hover. |
| **Text (Primary)** | `#323130` | Màu chữ nội dung chính. |
| **Text (Secondary)** | `#605e5c` | Màu chữ mô tả, nhãn (label). |
| **Text (Muted)** | `#a19f9d` | Màu chữ cực mờ hoặc placeholder. |

---

## 2. Hệ Typography

Sử dụng phông chữ **Inter** (hoặc Segoe UI/System Sans-serif) để tối ưu khả năng đọc.

-   **Heading (Modal/Section):** `14px`, Semibold/Bold, Uppercase, Tracking `-0.02em`.
-   **Table Header:** `11px`, Bold, Uppercase, Color `#605e5c`, Tracking `0.05em`.
-   **Body Text:** `13px` hoặc `12px` cho mật độ cao, Normal/Medium.
-   **Input Label:** `11px`, Bold, Uppercase, Color `#605e5c`.
-   **Status Text:** `10px`, Bold, Uppercase, Tracking `0.1em`.

---

## 3. Thành phần UI (UI Components)

### 3.1. Container & Cards
-   **Border-radius:** `4px` (rounded). Tránh sử dụng bo góc lớn (2xl).
-   **Border:** `1px solid #edebe9`.
-   **Shadow:** Sử dụng đổ bóng cực nhẹ: `shadow-sm` hoặc `shadow-[0px_2px_4px_rgba(0,0,0,0.05)]`.

### 3.2. Bảng dữ liệu (Data Grid)
-   Mật độ cao (padding dọc thấp: `py-2` hoặc `py-2.5`).
-   Header bảng có nền `#faf9f8`.
-   Đường kẻ phân cách mảnh: `#f3f2f1`.
-   Trạng thái Hover trên hàng: `bg-[#faf9f8]`.

### 3.3. Nút bấm (Buttons)
-   **Primary:** Nền `#0078d4`, chữ trắng, không viền đen. Đổ bóng mờ nhẹ màu xanh.
-   **Secondary/Outline:** Nền trắng, viền `#d2d0ce`, chữ `#323130`.
-   **Toolbar Button:** Trong suốt, nền chỉ hiện khi hover (`hover:bg-[#f3f2f1]`).

### 3.4. Input & Form
-   Nền trắng, viền `#edebe9`.
-   Focus chuyển sang viền `#0078d4` với hiệu ứng `ring-1`.
-   Layout: Ưu tiên bố cục hàng ngang (Grid) trên desktop để giảm số hàng, tăng số cột.

---

## 4. Nguyên tắc bố cục (Layout Principles)

1.  **Horizontal Expansion:** Tận dụng tối đa chiều ngang của màn hình PC. Form nên chia theo cột thay vì xếp chồng.
2.  **Information Density:** Không ngại sử dụng size chữ nhỏ (`11px`, `12px`) và padding hẹp để hiển thị nhiều dữ liệu hơn trên một màn hình.
3.  **Command Bar Logic:** Các chức năng quản trị (Thêm, Nhập, Xuất, Lọc) luôn nằm trên một thanh công cụ (Toolbar) riêng biệt phía trên nội dung chính.
4.  **Feedback System:** Sử dụng các dải màu (Info Bar) gắn ở đầu trang/component để thông báo trạng thái:
    -   Success: `#dff6dd` (nền), `#107c10` (chữ).
    -   Warning: `#fff8f1` (nền), `#d83f00` (chữ).
    -   Error: `#fde7e9` (nền), `#d83b01` (chữ).

---

## 5. Mẫu Code Tailwind (Shorthand)
```html
<!-- Card Container -->
<div class="bg-white rounded border border-[#edebe9] shadow-sm overflow-hidden">
  <!-- Toolbar -->
  <div class="bg-[#faf9f8] border-b border-[#edebe9] px-6 py-3">...</div>
  <!-- Table Section -->
  <div class="p-0">...</div>
</div>
```

# Báo cáo Tuần 2

**Tuần:** 3 (16/3/2026 - 22/3/2026)

**Nhóm:** 6

**Đề tài:** 5 - Hệ Thống Quản Lý Chung Cư

**Nhóm trưởng:** Nguyễn Nhật Minh - 2151053039

---

## 1. Công việc đã hoàn thành

| Thành viên         | MSSV       | Công việc                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Link Commit/PR                                                                                                                                                                                                                                                     |
| ------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nguyễn Nhật Minh   | 2151053039 | - Hoàn thiện hệ thống xác thực bằng JWT cho backend, bao gồm cấu hình Security, filter, service, controller và các DTO liên quan (đăng nhập, refresh token, đổi mật khẩu).<br><br>- Bổ sung xử lý lỗi toàn cục với Global Exception Handler, ErrorCode, AppException, đồng thời Việt hóa message validation và tối ưu một số xử lý token.<br><br>- Cấu hình CORS cho hệ thống, thêm DataSeeder để khởi tạo role và tài khoản admin mặc định, cập nhật RoleRepository. | [- Hoàn thiện xác thực bằng JWT và cấu hình xử lý các lỗi kèm mã lỗi chi tiết.](https://github.com/ngnhatminh1711/apartment-management-system/commit/33ff64c0e25a54a13703dd81e0fdd7e9e4111908)                                                                     |
| Nguyễn Văn Thành   | 2251050066 | - Xây dựng nền tảng xác thực backend với JWT, bao gồm DTO request/response, xử lý exception và service tạo/xác thực token.<br><br>- Tích hợp Spring Security với CustomUserDetails và CustomUserDetailsService để hỗ trợ đăng nhập, phân quyền và xác thực người dùng.<br><br>- Khởi tạo giao diện frontend bằng Vite + React + TypeScript, thiết lập cấu trúc thư mục.                                                                                               | [Khởi tạo auth backend với JWT và frontend React](https://github.com/ngnhatminh1711/apartment-management-system/commit/4a271406cea9e15fc2093e8c8570c9580a9d8cad)                                                                                                   |
| Nguyễn Trường Bách | 2351050010 | - Cập nhật DTO response cho chức năng quản lý cư dân.<br><br>- Bổ sung response riêng cho thông tin căn hộ liên kết với cư dân.<br><br>- Tìm hiểu thêm các video về Java Spring Boot và React Typescript trong thời gian chờ hoàn thành codebase.                                                                                                                                                                                                                     | [Cập nhật DTO response và bổ sung response riêng cho thông tin căn hộ.](https://github.com/ngnhatminh1711/apartment-management-system/commit/cfee01c9836c322f273b2415079bb77b5dd27f22#diff-a7e0ea63a78b04d261401efe81bef31e40c76ca9588f3b12b4017ea3af0a3c8bR1-R32) |

---

## 2. Tiến độ tổng thể

| Hạng mục           | Trạng thái   | %    |
| ------------------ | ------------ | ---- |
| Phân tích yêu cầu  | Done         | 100% |
| Thiết kế kiến trúc | Done         | 100% |
| Backend API        | Đang làm     | 40%  |
| Frontend UI        | Đang làm     | 5%   |
| Docker             | Chưa bắt đầu | 0%   |
| Testing            | Chưa bắt đầu | 0%   |

**Tổng tiến độ: 45%**

---

## 3. Kế hoạch tuần tới

| Thành viên         | Công việc dự kiến                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nguyễn Nhật Minh   | - Implement trang Login (dùng chung 3 roles). Implement Layout Admin: Sidebar, Header. Trang Dashboard Admin (static data trước).<br>- Implement toàn bộ JPA Entities + Repositories theo ERD. CRUD APIs hoàn chỉnh cho: Building, ApartmentConfig, FeeConfig (Admin module backend). |
| Nguyễn Văn Thành   | - CRUD APIs cho Apartment + Resident (BQL module backend).<br>- Implement trang BQL layout + Sidebar. Trang Danh sách căn hộ (static). Tích hợp Auth API: lưu JWT, Protected Route, redirect theo role.                                                                               |
| Nguyễn Trường Bách | - Implement CRUD APIs cho: ServiceRequest, Vehicle (module Cư dân backend). Tìm hiểu cách viết Controller + Service + Exception handling.<br>- Implement trang Dashboard Cư dân (static). Trang Thông tin cá nhân / Profile. Layout Cư dân: Sidebar, Header.                          |

---

_Ngày nộp: 22/03/2026_

_Xác nhận của Nhóm trưởng: Nguyễn Nhật Minh_

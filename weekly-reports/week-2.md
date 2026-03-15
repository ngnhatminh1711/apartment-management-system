# Báo cáo Tuần 2

**Tuần:** 2 (9/3/2026 - 15/3/2026)

**Nhóm:** 6

**Đề tài:** 5 - Hệ Thống Quản Lý Chung Cư

**Nhóm trưởng:** Nguyễn Nhật Minh - 2151053039

---

## 1. Công việc đã hoàn thành

| Thành viên         | MSSV       | Công việc                                                                                                                                                                                                                                                                                                                                                         | Link Commit/PR                                                                                                                                                                                                                                                                                             |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nguyễn Nhật Minh   | 2151053039 | - Phân tích nghiệp vụ Admin: quản lý tòa nhà, cấu hình phí dịch vụ, báo cáo thu chi. Liệt kê 6–8 API Admin cần có.<br>- Thiết kế sơ đồ use case và toàn bộ ERD.<br>- Tổng hợp API blueprint hoàn chỉnh từ các thành viên (30+ endpoints, RESTful convention).<br>- Setup Spring Boot project: cấu trúc package, dependencies (Security, JPA, Lombok, PostgreSQL). | [- Sơ đồ use case, ERD và set up Spring Boot project.](https://github.com/ngnhatminh1711/apartment-management-system/tree/599986fe89f9dd4ffea19a30d49d371653e60019)<br>[- Upload API design.](https://github.com/ngnhatminh1711/apartment-management-system/tree/7a5f35ec730dc626773ac4c26a650a9d4f92f15b) |
| Nguyễn Văn Thành   | 2251050066 | - Phân tích nghiệp vụ Ban quản lý (BQL): quản lý căn hộ, cư dân, hóa đơn, xử lý yêu cầu. Liệt kê 8–10 API BQL cần có.<br> - Vẽ wireframe 4 màn hình BQL: Danh sách hóa đơn, Xử lý yêu cầu dịch vụ, Quản lý cư dân, Gửi thông báo.                                                                                                                                 | []()                                                                                                                                                                                                                                                                                                       |
| Nguyễn Trường Bách | 2351050010 | - Phân tích nghiệp vụ Cư dân (End User): xem hóa đơn, thanh toán, đăng ký dịch vụ, gửi phản ánh. Liệt kê 6–8 API cần có.<br>- Vẽ wireframe 4 màn hình Cư dân: Login, Dashboard cá nhân, Xem hóa đơn, Gửi phản ánh.                                                                                                                                                | []()                                                                                                                                                                                                                                                                                                       |

---

## 2. Tiến độ tổng thể

| Hạng mục           | Trạng thái   | %    |
| ------------------ | ------------ | ---- |
| Phân tích yêu cầu  | Done         | 100% |
| Thiết kế kiến trúc | Done         | 100% |
| Backend API        | Đang làm     | 5%   |
| Frontend UI        | Chưa bắt đầu | 0%   |
| Docker             | Chưa bắt đầu | 0%   |
| Testing            | Chưa bắt đầu | 0%   |

**Tổng tiến độ: 20%**

---

## 3. Kế hoạch tuần tới

| Thành viên         | Công việc dự kiến                                                                                                                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nguyễn Nhật Minh   | - Implement toàn bộ JPA Entities + Repositories theo ERD. CRUD APIs hoàn chỉnh cho: `Building`, `ApartmentConfig`, `FeeConfig` (Admin module backend).<br>- Implement trang Login (dùng chung 3 roles). Implement Layout Admin: Sidebar, Header. Trang Dashboard Admin (static data trước).        |
| Nguyễn Văn Thành   | - Setup React project, cấu trúc thư mục, cài Tailwind, React Router, Axios. Thiết kế UI mockup BQL.<br>- Implement Spring Security + JWT: Register, Login, Refresh Token, phân quyền `ROLE_ADMIN` / `ROLE_MANAGER` / `ROLE_RESIDENT`. CRUD APIs cho `Apartment` + `Resident` (BQL module backend). |
| Nguyễn Trường Bách | - Viết DTO / Request / Response models cho toàn bộ APIs của module Cư dân. Tìm hiểu Spring Boot Controller/Service/Repository pattern.<br>- Thiết kế UI mockup Cư dân. Xây dựng component library chung: Button, Card, Table, Form Input, Modal.                                                   |

---

_Ngày nộp: 15/03/2026_
_Xác nhận của Nhóm trưởng: Nguyễn Nhật Minh_

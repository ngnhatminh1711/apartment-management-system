# 📋 LỊCH PHÂN CÔNG CÔNG VIỆC – HỆ THỐNG QUẢN LÝ CHUNG CƯ

> **Mỗi thành viên đảm nhận cả Backend (Spring Boot) lẫn Frontend (ReactJS) cho module được giao**
> Timeline: Tuần 2 – Tuần 10 (9 tuần)

---

## 👥 Phân chia Module

| Thành viên | Module phụ trách | Backend | Frontend |
|---|---|---|---|
| **MINH** | 🔵 Admin | CRUD tòa nhà, FeeConfig, Stats APIs, Email notification | Admin Dashboard, biểu đồ, cấu hình phí, quản lý users |
| **THÀNH** | 🟢 Ban quản lý (BQL) | Spring Security/JWT *(toàn hệ thống)* + BQL APIs | BQL UI: hóa đơn, xử lý yêu cầu, gửi thông báo |
| **BÁCH** | 🟡 Cư dân (End User) | ServiceRequest, Vehicle, Payment history APIs | Cư dân UI: xem hóa đơn, thanh toán, phản ánh, xe |

---

## 📅 Chi tiết phân công theo tuần

---

### Tuần 2 – Phân tích yêu cầu

📦 **Output:** `docs/requirements.md` | Wireframes | GitHub repo

🤝 **Chung:** Họp nhóm: thống nhất tech stack, phân chia module, lập GitHub repo. Mỗi người viết phần phân tích cho module mình phụ trách.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | Phân tích nghiệp vụ Admin: quản lý tòa nhà, cấu hình phí dịch vụ, báo cáo thu chi. Liệt kê 6–8 API Admin cần có. |
| 🖥 **Frontend** | Vẽ wireframe (low-fi) 4 màn hình Admin: Dashboard tổng quan, Quản lý tòa nhà, Cấu hình phí, Báo cáo. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Phân tích nghiệp vụ Ban quản lý (BQL): quản lý căn hộ, cư dân, hóa đơn, xử lý yêu cầu. Liệt kê 8–10 API BQL cần có. |
| 🖥 **Frontend** | Vẽ wireframe (low-fi) 4 màn hình BQL: Danh sách hóa đơn, Xử lý yêu cầu dịch vụ, Quản lý cư dân, Gửi thông báo. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Phân tích nghiệp vụ Cư dân (End User): xem hóa đơn, thanh toán, đăng ký dịch vụ, gửi phản ánh. Liệt kê 6–8 API cần có. |
| 🖥 **Frontend** | Vẽ wireframe (low-fi) 4 màn hình Cư dân: Login, Dashboard cá nhân, Xem hóa đơn, Gửi phản ánh. |

---

### Tuần 3 – Thiết kế hệ thống

🏁 **MILESTONE M2:** Database + API Design hoàn chỉnh (cuối tuần 3)

📦 **Output:** `docs/database-design.md` | `docs/api-docs.md` | UI mockup hi-fi

🤝 **Chung:** Minh thiết kế DB → Thành & Bách setup project. Cả 3 review ERD + API blueprint cùng nhau trước khi code.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Thiết kế toàn bộ ERD (8–10 bảng): `users`, `roles`, `apartments`, `buildings`, `bills`, `payments`, `service_requests`, `vehicles`, `notifications`, `fee_configs`. Viết migration SQL scripts. |
| 🖥 **Frontend** | Thiết kế UI mockup hi-fi Admin (Figma/draw.io): Dashboard KPI, Quản lý tòa nhà/cư dân, Trang cấu hình phí dịch vụ. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Thiết kế API blueprint hoàn chỉnh (30+ endpoints, RESTful convention). Setup Spring Boot project: cấu trúc package, dependencies (Security, JPA, Lombok, PostgreSQL). |
| 🖥 **Frontend** | Setup React project: cấu trúc thư mục (`pages/components/services/hooks`), cài Tailwind/MUI, React Router, Axios. Thiết kế UI mockup hi-fi BQL. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Viết DTO / Request / Response models cho toàn bộ APIs của module Cư dân. Tìm hiểu Spring Boot Controller/Service/Repository pattern. |
| 🖥 **Frontend** | Thiết kế UI mockup hi-fi Cư dân. Xây dựng component library chung: Button, Card, Table, Form Input, Modal. |

---

### Tuần 4 – Core Backend

📦 **Output:** JPA Entities + Auth APIs + CRUD cơ bản chạy được

🤝 **Chung:** Minh viết tất cả JPA Entities (cả nhóm dùng chung). Thành setup Auth. Bách có thể bắt đầu Frontend static song song.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Implement toàn bộ JPA Entities + Repositories theo ERD. CRUD APIs hoàn chỉnh cho: `Building`, `ApartmentConfig`, `FeeConfig` (Admin module backend). |
| 🖥 **Frontend** | Implement trang Login (dùng chung 3 roles). Implement Layout Admin: Sidebar, Header. Trang Dashboard Admin (static data trước). |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement Spring Security + JWT: Register, Login, Refresh Token, phân quyền `ROLE_ADMIN` / `ROLE_MANAGER` / `ROLE_RESIDENT`. CRUD APIs cho `Apartment` + `Resident` (BQL module backend). |
| 🖥 **Frontend** | Implement trang BQL layout + Sidebar. Trang Danh sách căn hộ (static). Tích hợp Auth API: lưu JWT, Protected Route, redirect theo role. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement CRUD APIs cho: `ServiceRequest`, `Vehicle` (module Cư dân backend). Tìm hiểu cách viết Controller + Service + Exception handling. |
| 🖥 **Frontend** | Implement trang Dashboard Cư dân (static). Trang Thông tin cá nhân / Profile. Layout Cư dân: Sidebar, Header. |

---

### Tuần 5 – Business APIs

📦 **Output:** Core business APIs + Frontend kết nối được API Auth & CRUD cơ bản

🤝 **Chung:** Bắt đầu tích hợp: Bách gọi API của Minh (Apartment) và Thành (Auth). Mỗi người test API của mình bằng Postman trước khi cho người khác dùng.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Implement Bill Service: tự động tạo hóa đơn tháng, tính phí theo loại (điện, nước, dịch vụ). Payment Service: xử lý thanh toán, cập nhật trạng thái. Admin Stats APIs. |
| 🖥 **Frontend** | Tích hợp Admin APIs: CRUD tòa nhà (gọi API thực). Trang Cấu hình phí dịch vụ (form + submit). Trang Báo cáo thu chi (table). |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement Bill Management APIs đầy đủ cho BQL: tạo/gửi/xóa hóa đơn, lọc theo căn hộ/tháng. Implement Announcement/Notice APIs. |
| 🖥 **Frontend** | Tích hợp BQL APIs: Trang Danh sách hóa đơn (gọi API thực, filter, pagination). Trang Gửi thông báo đến cư dân. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement Notification APIs (lấy danh sách thông báo cho Cư dân). Hoàn thiện ServiceRequest APIs: submit, track status. Thêm validation + error handling cho toàn bộ module Cư dân. |
| 🖥 **Frontend** | Tích hợp Cư dân APIs: Trang Xem danh sách hóa đơn (gọi API thực). Trang Gửi phản ánh / yêu cầu dịch vụ (form + submit). |

---

### Tuần 6 – Backend hoàn thiện

📦 **Output:** APIs Business User hoàn chỉnh + Authorization đầy đủ

🤝 **Chung:** Code review chéo: mỗi người review 1 PR của thành viên khác. Thành implement Authorization bảo vệ tất cả endpoints của cả nhóm.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement Admin User Management APIs: khóa/mở tài khoản, reset mật khẩu. Admin Report APIs nâng cao: thống kê công nợ, tỷ lệ thanh toán theo tháng. |
| 🖥 **Frontend** | Implement Admin Dashboard đầy đủ: biểu đồ doanh thu (Chart.js/Recharts), bảng thống kê. Trang Quản lý Users (admin xem/khóa tài khoản). |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Implement Authorization chi tiết: phân quyền endpoint theo role, kiểm tra ownership (cư dân chỉ xem hóa đơn của mình). Global Exception Handler + chuẩn hóa API response. |
| 🖥 **Frontend** | Implement trang BQL Xử lý yêu cầu dịch vụ (cập nhật trạng thái, ghi chú). Trang BQL Quản lý cư dân (assign căn hộ, xem thông tin). Responsive mobile BQL. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Implement Payment APIs phía Cư dân: xem lịch sử thanh toán, mock VNPay/MoMo redirect. Thêm API lấy thông tin căn hộ của cư dân đang ở. |
| 🖥 **Frontend** | Trang Thanh toán hóa đơn (nút thanh toán → mock payment flow). Trang Lịch sử thanh toán. Trang Đăng ký xe (form upload + submit API). |

---

### Tuần 7 – Backend final

🏁 **MILESTONE M3:** Toàn bộ backend APIs chạy hoàn chỉnh (cuối tuần 7)

📦 **Output:** Swagger/API docs hoàn chỉnh + Backend ổn định

🤝 **Chung:** Freeze backend: không thêm tính năng mới sau tuần này. Viết Postman collection đầy đủ. Nộp weekly-report M3.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Integrate Email notification (JavaMail): gửi thông báo hóa đơn đến cư dân. Code review & fix bugs toàn bộ backend. Tối ưu queries DB (thêm index). |
| 🖥 **Frontend** | Hoàn thiện Admin UI: loading states, empty states, error messages. Kiểm tra và fix responsive Admin trên mobile/tablet. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Hoàn thiện tất cả endpoints còn thiếu để đạt 20–30 endpoints. Viết Swagger/OpenAPI annotations cho toàn bộ API. Kiểm thử toàn bộ luồng Auth + Authorization. |
| 🖥 **Frontend** | Implement tính năng Search/Filter nâng cao cho BQL: tìm kiếm cư dân, lọc hóa đơn theo trạng thái. Hoàn thiện responsive BQL. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Viết Postman collection đầy đủ cho module Cư dân. Fix tất cả bugs backend module Cư dân được report. Thêm logging + error handling còn thiếu. |
| 🖥 **Frontend** | Trang Thông báo / Announcements (đánh dấu đã đọc). Trang Thông tin căn hộ của cư dân. Hoàn thiện responsive Cư dân. |

---

### Tuần 8 – Frontend hoàn thiện

📦 **Output:** Frontend đầy đủ tính năng, tích hợp API hoàn chỉnh

🤝 **Chung:** End-to-end walkthrough: thử toàn bộ user flow từng role. Lập danh sách bugs cần fix. Cả nhóm họp 1 buổi test cùng nhau.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | Thêm tính năng nâng cao (nếu nhóm chọn AI): gợi ý phát hiện bất thường tiêu thụ điện nước. Hoặc: Real-time notification WebSocket. |
| 🖥 **Frontend** | UX polish Admin: animation transitions, biểu đồ interactive, tooltip. Implement Breadcrumb, Back button. Kiểm tra cross-browser. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Hỗ trợ fix backend bugs được phát hiện trong quá trình test tổng thể. Tối ưu performance API (response time, N+1 queries). |
| 🖥 **Frontend** | Implement tính năng phức tạp BQL: Calendar xem lịch hóa đơn, bulk action (gửi hóa đơn hàng loạt). Component reuse audit. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Hỗ trợ viết thêm test data (data seeding script) để demo đẹp hơn. Fix backend bugs nhỏ module Cư dân. |
| 🖥 **Frontend** | UX polish Cư dân: loading skeleton, toast notifications. Implement Dark/Light mode toggle (bonus). Kiểm tra accessibility cơ bản. |

---

### Tuần 9 – Testing & hoàn thiện

🏁 **MILESTONE M4:** MVP – Sản phẩm demo được (cuối tuần 9)

📦 **Output:** Sản phẩm ổn định, không lỗi nghiêm trọng + `docs/screenshots/`

🤝 **Chung:** Thành dẫn dắt testing session chung. Mỗi người test chéo module người khác và báo bugs. Mục tiêu: zero critical bugs trước tuần 10.

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | Fix bugs backend được report từ testing. Tối ưu DB lần cuối. Chuẩn bị nội dung kỹ thuật: ERD diagram đẹp, kiến trúc hệ thống cho slide bảo vệ. |
| 🖥 **Frontend** | Chụp screenshots đầy đủ tất cả màn hình Admin → lưu `docs/screenshots/admin/`. Fix UI Admin bugs từ testing session. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | ⭐ Viết test cases (happy path + edge cases) cho toàn bộ 3 modules. Thực hiện manual testing end-to-end. Tổng hợp bug list phân loại theo severity. |
| 🖥 **Frontend** | Chụp screenshots đầy đủ màn hình BQL → `docs/screenshots/manager/`. Fix UI BQL bugs. Viết weekly-report tuần 9. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Viết user manual (`.md`): hướng dẫn sử dụng chi tiết cho từng role (Cư dân, BQL, Admin). Chuẩn bị dữ liệu demo thực tế (5–10 căn hộ, hóa đơn mẫu). |
| 🖥 **Frontend** | Chụp screenshots đầy đủ màn hình Cư dân → `docs/screenshots/resident/`. Fix UI bugs từ testing. Kiểm tra toàn bộ form validation. |

---

### Tuần 10 – Bảo vệ & nộp bài

🏁 **MILESTONE M5:** FINAL – Nộp bài + Bảo vệ (cuối tuần 10)

📦 **Output:** GitHub repo hoàn chỉnh + Báo cáo + Video demo + Slide + Bảo vệ

🤝 **Chung:** Luyện demo live 2–3 lần trước ngày bảo vệ. Mỗi người chuẩn bị câu trả lời cho phần mình phụ trách (cả backend lẫn frontend của module mình).

#### 🔵 MINH – Admin module
| | Công việc |
|---|---|
| 🔧 **Backend** | Hoàn thiện `docs/database-design.md` (ERD + giải thích từng bảng + relationships). Review lần cuối toàn bộ source code trước khi nộp. |
| 🖥 **Frontend** | Chuẩn bị trả lời vấn đáp về: DB design, Admin module (cả BE + FE), kiến trúc hệ thống. Hỗ trợ setup live demo environment. |

#### 🟢 THÀNH – BQL module
| | Công việc |
|---|---|
| 🔧 **Backend** | Hoàn thiện `docs/api-docs.md`. Viết `README.md` (cài đặt, chạy, tính năng). Nộp bài lên GitHub, kiểm tra repo structure đúng yêu cầu thầy. |
| 🖥 **Frontend** | Quay video demo (5–10 phút) đầy đủ tất cả tính năng. Làm slide thuyết trình (10–12 slide). Chuẩn bị trả lời vấn đáp về BQL module (BE + FE) + Auth/Security. |

#### 🟡 BÁCH – Cư dân module
| | Công việc |
|---|---|
| 🔧 **Backend** | Đảm bảo tất cả `weekly-reports/week-X.md` đã commit đủ. Luyện tập live demo phần Cư dân. |
| 🖥 **Frontend** | Chuẩn bị trả lời vấn đáp về: Cư dân module (cả BE + FE), React components, cách tích hợp API. Chạy thử demo lần cuối đảm bảo không lỗi. |

---

## 📊 Tổng kết phân công module & cân bằng khối lượng

| | MINH – Admin | THÀNH – BQL | BÁCH – Cư dân | Ghi chú |
|---|---|---|---|---|
| **Backend** | CRUD Building, FeeConfig, User Mgmt, Report APIs, Email, Stats | Spring Security/JWT *(toàn hệ thống)* + BQL APIs: Apartment/Resident, Bill/Payment | ServiceRequest, Vehicle, Notification, Payment history APIs | Thành làm Auth/Security cho cả hệ thống vì phức tạp nhất |
| **Frontend** | Admin Dashboard: KPI chart, cấu hình phí, quản lý users, báo cáo | BQL UI: hóa đơn, xử lý yêu cầu, gửi thông báo, quản lý cư dân + Auth flow | Cư dân UI: xem hóa đơn, thanh toán, gửi phản ánh, đăng ký xe, thông báo | Mỗi người sở hữu cả BE + FE của module mình |
| **DB Design** | ⭐ Thiết kế toàn bộ ERD (cả nhóm dùng chung) | Đóng góp: xác định API blueprint & DTO models | Đóng góp: viết DTO cho module Cư dân | DB Design là điều kiện tiên quyết – phải xong cuối Tuần 3 |

---

## 📌 Lưu ý quan trọng

- ⭐ **Minh phải hoàn thành ERD cuối Tuần 3** – đây là điều kiện để cả nhóm bắt đầu code Tuần 4. Ưu tiên số 1.
- 🔗 **Mỗi người sở hữu end-to-end một module** (cả BE + FE) → tự tin trả lời vấn đáp về phần mình. Không nhận code mà không hiểu.
- 🛡 **Thành implement Spring Security/JWT cho toàn hệ thống** (Tuần 4) trước, sau đó Minh & Bách tích hợp vào module của mình.
- 🔀 **Commit ≥ 1 lần/tuần.** Mỗi tính năng = 1 feature branch. Merge vào `develop` sau code review, chỉ merge → `main` khi milestone.
- 🧪 **Tuần 9 – test chéo module:** Minh test module Bách, Thành test module Minh, Bách test module Thành để phát hiện bugs nhanh hơn.

---

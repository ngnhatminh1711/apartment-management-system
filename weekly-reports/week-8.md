# Báo cáo Tuần 8

**Tuần:** 8 (20/4/2026 - 26/4/2026)

**Nhóm:** 6

**Đề tài:** 5 - Hệ Thống Quản Lý Chung Cư

**Nhóm trưởng:** Nguyễn Nhật Minh - 2151053039

---

## 1. Công việc đã hoàn thành

| Thành viên         | MSSV       | Công việc                                                                                                                                                                                                                                                                                                                                                            | Link Commit/PR                                                                                                                                                                              |
| ------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nguyễn Nhật Minh   | 2151053039 | - Admin: Xây dựng đầy đủ UI quản lý building (tạo, sửa, danh sách) với filter trạng thái, phân trang, progress bar, xử lý deactivate và cải thiện hiển thị bảng + empty state.<br>- Hệ thống: Thêm services và types riêng cho admin (building, user), cập nhật routing và layout, đồng thời cải thiện UX (toast, xử lý lỗi, tinh chỉnh UI nhỏ).                     | [Hoàn thành quản lý tòa nhà của role Admin ở FE](https://github.com/ngnhatminh1711/apartment-management-system/commit/9039495df455ef461292e81ffb53e39ca61468c6)                             |
| Nguyễn Văn Thành   | 2251050066 | - Backend: Bổ sung API cập nhật và bật/tắt publish cho announcements, chỉnh sửa entity và response (đổi tên, thêm field), cải thiện search và fix một số mapping/controller.<br>- Frontend: Xây dựng UI quản lý announcements (list + form), thêm trang chi tiết apartment/resident, cập nhật routes/services/types và tinh chỉnh UI (badge, toast, sidebar, theme). | [Hoàn thành trang quản lý dashboard, xem và tạo thông báo của role Manager.](https://github.com/ngnhatminh1711/apartment-management-system/commit/859d5e539f67179790a59cf238c6a43865b7f5b4) |
| Nguyễn Trường Bách | 2351050010 | - Hoàn thành toàn bộ frontend của role User.                                                                                                                                                                                                                                                                                                                         | [Hoàn thành toàn bộ frontend của role User](https://github.com/ngnhatminh1711/apartment-management-system/pull/29)                                                                          |

---

## 2. Tiến độ tổng thể

| Hạng mục           | Trạng thái   | %    |
| ------------------ | ------------ | ---- |
| Phân tích yêu cầu  | Done         | 100% |
| Thiết kế kiến trúc | Done         | 100% |
| Backend API        | Done         | 100% |
| Frontend UI        | Đang làm     | 90%  |
| Docker             | Chưa bắt đầu | 0%   |
| Testing            | Chưa bắt đầu | 0%   |

**Tổng tiến độ: 85%**

---

## 3. Kế hoạch tuần tới

| Thành viên         | Công việc dự kiến                                                      |
| ------------------ | ---------------------------------------------------------------------- |
| Nguyễn Nhật Minh   | - Hoàn thành toàn bộ Frontend của role Admin.                          |
| Nguyễn Văn Thành   | - Viết unit test cho role Manager và test các chức năng của role User. |
| Nguyễn Trường Bách | - Viết unit test cho role User và test các chức năng của role Manager. |

---

_Ngày nộp: 26/04/2026_

_Xác nhận của Nhóm trưởng: Nguyễn Nhật Minh_

# 📊 Biểu Đồ Use Case – Hệ Thống Quản Lý Chung Cư

> **3 Actor chính:** Admin · Ban Quản Lý (Manager) · Cư Dân (Resident)  
> **Tổng số use case:** 42  
> Ký hiệu quan hệ: `«include»` = bắt buộc chạy | `«extend»` = chạy có điều kiện

---

## 1. Tổng quan hệ thống

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                     HỆ THỐNG QUẢN LÝ CHUNG CƯ                                    ║
║                                                                                  ║
║   ┌─────────────────────────┐    ┌──────────────────────────┐                    ║
║   │     QUẢN TRỊ HỆ THỐNG   │    │   NGHIỆP VỤ CHUNG CƯ     │                    ║
║   │  UC01 Đăng nhập         │    │  UC11 Quản lý tòa nhà    │                    ║
║   │  UC02 Đăng xuất         │    │  UC12 Quản lý căn hộ     │                    ║
║   │  UC03 Đổi mật khẩu      │    │  UC13 Quản lý cư dân     │                    ║
║   │  UC04 Xem thông báo     │    │  UC14 Cấu hình phí       │                    ║
║   └─────────────────────────┘    │  UC15 Quản lý hóa đơn    │                    ║
║                                  │  UC16 Thanh toán         │                    ║
║   ┌─────────────────────────┐    │  UC17 Quản lý xe         │                    ║
║   │    DỊCH VỤ & YÊU CẦU    │    │  UC18 Dịch vụ tiện ích   │                    ║
║   │  UC19 Gửi yêu cầu       │    │  UC19 Xử lý yêu cầu      │                    ║
║   │  UC20 Theo dõi yêu cầu  │    └──────────────────────────┘                    ║
║   │  UC21 Đánh giá xử lý    │                                                    ║
║   └─────────────────────────┘    ┌──────────────────────────┐                    ║
║                                  │  THỐNG KÊ & BÁO CÁO      │                    ║
║                                  │  UC35 Doanh thu          │                    ║
║                                  │  UC36 Tỷ lệ lấp đầy      │                    ║
║                                  │  UC37 Công nợ            │                    ║
║                                  │  UC38 Dashboard KPI      │                    ║
║                                  └──────────────────────────┘                    ║
╚══════════════════════════════════════════════════════════════════════════════════╝

  👤 Admin          👤 Ban Quản Lý        👤 Cư Dân
```

---

## 2. Biểu đồ Use Case theo Actor

### 2.1 Actor: ADMIN

```
                    ╔══════════════════════════════════════════╗
                    ║          HỆ THỐNG QUẢN LÝ CHUNG CƯ       ║
                    ║                                          ║
                    ║  ┌───────────────────────────────────┐   ║
                    ║  │  🔐 XÁC THỰC                      │  ║
                    ║  │  (UC01) Đăng nhập                 │   ║
                    ║  │  (UC02) Đăng xuất                 │   ║
                    ║  │  (UC03) Đổi mật khẩu              │   ║
                    ║  └───────────────────────────────────┘   ║
                    ║                                          ║
  ┌──────┐          ║  ┌──────────────────────────────────┐    ║
  │      │──────────╬──│  🏢 QUẢN LÝ TÒA NHÀ              │   ║
  │      │          ║  │  (UC11) Xem danh sách tòa nhà    │   ║
  │      │          ║  │  (UC12) Thêm tòa nhà mới         │   ║
  │      │          ║  │  (UC13) Sửa thông tin tòa nhà    │   ║
  │      │          ║  │  (UC14) Vô hiệu hoá tòa nhà      │   ║
  │      │          ║  │  (UC15) Gán Manager cho tòa nhà  │   ║
  │      │          ║  └──────────────────────────────────┘   ║
  │ADMIN │          ║                                         ║
  │      │          ║  ┌──────────────────────────────────┐   ║
  │      │──────────╬──│  🏠 QUẢN LÝ CĂN HỘ               │   ║
  │      │          ║  │  (UC16) Xem danh sách căn hộ     │   ║
  │      │          ║  │  (UC17) Thêm căn hộ mới          │   ║
  │      │          ║  │  (UC18) Sửa thông tin căn hộ     │   ║
  │      │          ║  │  (UC19) Đổi trạng thái căn hộ    │   ║
  │      │          ║  └──────────────────────────────────┘   ║
  │      │          ║                                          ║
  │      │          ║  ┌──────────────────────────────────┐   ║
  │      │──────────╬──│  👥 QUẢN LÝ NGƯỜI DÙNG           │   ║
  │      │          ║  │  (UC20) Xem danh sách users      │   ║
  │      │          ║  │  (UC21) Tạo tài khoản            │   ║
  │      │          ║  │  (UC22) Sửa thông tin user       │   ║
  │      │          ║  │  (UC23) Khoá / mở tài khoản      │   ║
  │      │          ║  │  (UC24) Reset mật khẩu           │   ║
  │      │          ║  │  (UC25) Gán / thu hồi role       │   ║
  └──────┘          ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  💰 CẤU HÌNH PHÍ                  │   ║
                    ║  │  (UC26) Xem bảng giá hiện tại    │   ║
                    ║  │  (UC27) Tạo cấu hình phí mới     │   ║
                    ║  │  (UC28) Xem lịch sử thay đổi giá │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🛎️ QUẢN LÝ DỊCH VỤ TIỆN ÍCH    │   ║
                    ║  │  (UC29) Xem danh sách dịch vụ    │   ║
                    ║  │  (UC30) Thêm loại dịch vụ mới    │   ║
                    ║  │  (UC31) Sửa thông tin dịch vụ    │   ║
                    ║  │  (UC32) Bật / tắt dịch vụ        │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  📊 BÁO CÁO & THỐNG KÊ           │   ║
                    ║  │  (UC33) Xem Dashboard KPI        │   ║
                    ║  │  (UC34) Báo cáo doanh thu        │   ║
                    ║  │  (UC35) Báo cáo tỷ lệ lấp đầy   │   ║
                    ║  │  (UC36) Báo cáo công nợ          │   ║
                    ║  │  (UC37) Lịch sử thanh toán       │   ║
                    ║  └──────────────────────────────────┘   ║
                    ╚══════════════════════════════════════════╝
```

---

### 2.2 Actor: BAN QUẢN LÝ (Manager)

```
                    ╔══════════════════════════════════════════╗
                    ║           HỆ THỐNG QUẢN LÝ CHUNG CƯ     ║
                    ║                                          ║
  ┌──────────┐      ║  ┌──────────────────────────────────┐   ║
  │          │      ║  │  🔐 XÁC THỰC                      │   ║
  │          │──────╬──│  (UC01) Đăng nhập                 │   ║
  │          │      ║  │  (UC02) Đăng xuất                 │   ║
  │          │      ║  │  (UC03) Đổi mật khẩu              │   ║
  │          │      ║  └──────────────────────────────────┘   ║
  │   BAN    │      ║                                          ║
  │  QUẢN LÝ │      ║  ┌──────────────────────────────────┐   ║
  │          │──────╬──│  🏠 QUẢN LÝ CĂN HỘ & CƯ DÂN      │   ║
  │          │      ║  │  (UC38) Xem danh sách căn hộ     │   ║
  │          │      ║  │  (UC39) Xem chi tiết căn hộ      │   ║
  │          │      ║  │  (UC40) Gán cư dân vào căn hộ    │   ║
  │          │      ║  │  (UC41) Ghi nhận chuyển đi        │   ║
  │          │      ║  │  (UC42) Xem danh sách cư dân     │   ║
  │          │      ║  │  (UC43) Xem chi tiết cư dân      │   ║
  │          │      ║  └──────────────────────────────────┘   ║
  │          │      ║                                          ║
  │          │      ║  ┌──────────────────────────────────┐   ║
  │          │──────╬──│  🧾 QUẢN LÝ HÓA ĐƠN              │   ║
  │          │      ║  │  (UC44) Xem danh sách hóa đơn   │   ║
  │          │      ║  │  (UC45) Xem chi tiết hóa đơn    │   ║
  │          │      ║  │  (UC46) Tạo hóa đơn tháng        │   ║
  │          │      ║  │  (UC47) Huỷ hóa đơn              │   ║
  └──────────┘      ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🔧 XỬ LÝ YÊU CẦU & PHẢN ÁNH    │   ║
                    ║  │  (UC48) Xem danh sách yêu cầu   │   ║
                    ║  │  (UC49) Xem chi tiết yêu cầu    │   ║
                    ║  │  (UC50) Tiếp nhận & phân công    │   ║
                    ║  │  (UC51) Cập nhật trạng thái      │   ║
                    ║  │  (UC52) Đóng / từ chối yêu cầu  │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🚗 DUYỆT ĐĂNG KÝ XE & DỊCH VỤ  │   ║
                    ║  │  (UC53) Xem danh sách xe chờ    │   ║
                    ║  │  (UC54) Duyệt / từ chối đăng ký │   ║
                    ║  │  (UC55) Duyệt đăng ký dịch vụ   │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  📢 THÔNG BÁO                     │   ║
                    ║  │  (UC56) Tạo thông báo mới        │   ║
                    ║  │  (UC57) Xem / sửa / xoá thông báo│  ║
                    ║  └──────────────────────────────────┘   ║
                    ╚══════════════════════════════════════════╝
```

---

### 2.3 Actor: CƯ DÂN (Resident)

```
                    ╔══════════════════════════════════════════╗
                    ║           HỆ THỐNG QUẢN LÝ CHUNG CƯ     ║
                    ║                                          ║
  ┌──────────┐      ║  ┌──────────────────────────────────┐   ║
  │          │──────╬──│  🔐 XÁC THỰC                      │   ║
  │          │      ║  │  (UC01) Đăng nhập                 │   ║
  │          │      ║  │  (UC02) Đăng xuất                 │   ║
  │          │      ║  │  (UC03) Đổi mật khẩu              │   ║
  │          │      ║  └──────────────────────────────────┘   ║
  │  CƯ DÂN  │      ║                                          ║
  │          │      ║  ┌──────────────────────────────────┐   ║
  │          │──────╬──│  🏠 THÔNG TIN CĂN HỘ & HỒ SƠ    │   ║
  │          │      ║  │  (UC58) Xem thông tin căn hộ     │   ║
  │          │      ║  │  (UC59) Xem hồ sơ cá nhân        │   ║
  │          │      ║  │  (UC60) Cập nhật hồ sơ cá nhân  │   ║
  │          │      ║  └──────────────────────────────────┘   ║
  │          │      ║                                          ║
  │          │      ║  ┌──────────────────────────────────┐   ║
  │          │──────╬──│  🧾 HÓA ĐƠN & THANH TOÁN         │   ║
  │          │      ║  │  (UC61) Xem danh sách hóa đơn   │   ║
  │          │      ║  │  (UC62) Xem chi tiết hóa đơn    │   ║
  │          │      ║  │  (UC63) Thanh toán hóa đơn       │   ║
  │          │      ║  │  (UC64) Xem lịch sử thanh toán  │   ║
  └──────────┘      ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🚗 ĐĂNG KÝ XE                    │   ║
                    ║  │  (UC65) Xem danh sách xe         │   ║
                    ║  │  (UC66) Đăng ký xe mới           │   ║
                    ║  │  (UC67) Huỷ đăng ký xe           │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🛎️ DỊCH VỤ TIỆN ÍCH             │   ║
                    ║  │  (UC68) Xem danh sách dịch vụ   │   ║
                    ║  │  (UC69) Đăng ký dịch vụ         │   ║
                    ║  │  (UC70) Huỷ đăng ký dịch vụ     │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  📝 YÊU CẦU & PHẢN ÁNH           │   ║
                    ║  │  (UC71) Gửi yêu cầu / phản ánh  │   ║
                    ║  │  (UC72) Theo dõi trạng thái      │   ║
                    ║  │  (UC73) Đánh giá kết quả xử lý  │   ║
                    ║  └──────────────────────────────────┘   ║
                    ║                                          ║
                    ║  ┌──────────────────────────────────┐   ║
                    ║  │  🔔 THÔNG BÁO                     │   ║
                    ║  │  (UC74) Xem thông báo            │   ║
                    ║  │  (UC75) Đánh dấu đã đọc          │   ║
                    ║  └──────────────────────────────────┘   ║
                    ╚══════════════════════════════════════════╝
```

---

## 3. Quan hệ «include» và «extend»

```
UC63 Thanh toán hóa đơn
    «include» ──► UC62 Xem chi tiết hóa đơn
    «extend»  ──► UC63a Chọn phương thức (VNPAY / MoMo / Chuyển khoản)
    «extend»  ──► UC63b Gửi email xác nhận thanh toán

UC46 Tạo hóa đơn tháng
    «include» ──► UC26 Lấy bảng giá hiện tại (fee_configs)
    «extend»  ──► UC46a Gửi thông báo hóa đơn đến cư dân (notifications)

UC66 Đăng ký xe mới
    «extend»  ──► UC54 BQL duyệt đăng ký (thay đổi status → ACTIVE)

UC69 Đăng ký dịch vụ
    «extend»  ──► UC55 BQL duyệt đăng ký dịch vụ

UC71 Gửi yêu cầu / phản ánh
    «extend»  ──► UC50 BQL tiếp nhận & phân công xử lý
    «extend»  ──► UC72 Cập nhật thông báo trạng thái cho cư dân

UC73 Đánh giá kết quả xử lý
    «include» ──► UC52 Yêu cầu phải ở trạng thái RESOLVED

UC01 Đăng nhập
    «include» ──► UC01a Xác thực JWT token
    «extend»  ──► UC01b Redirect theo role (Admin/Manager/Resident)
```

---

## 4. Mô tả chi tiết Use Case

### 4.1 Use Cases dùng chung (3 Actor)

| UC   | Tên                   | Actor              | Mô tả tóm tắt                                                                  | Bảng DB liên quan              |
| ---- | --------------------- | ------------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| UC01 | Đăng nhập             | Admin, BQL, Cư dân | Nhập email + password → hệ thống xác thực → trả JWT token → redirect theo role | `users`, `user_roles`, `roles` |
| UC02 | Đăng xuất             | Admin, BQL, Cư dân | Xóa JWT khỏi client, hủy session                                               | _(client-side)_                |
| UC03 | Đổi mật khẩu          | Admin, BQL, Cư dân | Nhập mật khẩu cũ để xác thực, nhập mật khẩu mới (≥8 ký tự), xác nhận lại       | `users`                        |
| UC04 | Xem thông báo cá nhân | Admin, BQL, Cư dân | Xem danh sách notifications chưa đọc, đánh dấu đã đọc                          | `notifications`                |

---

### 4.2 Use Cases của ADMIN

#### 🏢 Nhóm Quản lý Tòa nhà

| UC   | Tên                     | Luồng chính                                                                                      | Điều kiện tiên quyết               | Kết quả                                                    |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------- |
| UC11 | Xem danh sách tòa nhà   | Admin vào trang Buildings → hệ thống trả danh sách có phân trang, tìm kiếm, lọc theo trạng thái  | Đã đăng nhập, có ROLE_ADMIN        | Hiển thị bảng tòa nhà kèm thống kê (số căn, tỷ lệ lấp đầy) |
| UC12 | Thêm tòa nhà mới        | Admin điền form (tên, địa chỉ, số tầng, Manager phụ trách) → submit → hệ thống validate → lưu DB | Đã đăng nhập, có ROLE_ADMIN        | Tòa nhà mới được tạo, `is_active = true`                   |
| UC13 | Sửa thông tin tòa nhà   | Admin chọn tòa nhà → chỉnh sửa thông tin → submit → cập nhật DB                                  | Tòa nhà tồn tại và đang active     | Thông tin được cập nhật                                    |
| UC14 | Vô hiệu hóa tòa nhà     | Admin chọn tòa nhà → xác nhận → hệ thống kiểm tra không còn cư dân → set `is_active = false`     | Không còn cư dân đang ở            | Tòa nhà bị ẩn khỏi hệ thống (soft delete)                  |
| UC15 | Gán Manager cho tòa nhà | Admin chọn tòa nhà → chọn user có ROLE_MANAGER → xác nhận → cập nhật `manager_id`                | User được gán phải có ROLE_MANAGER | `buildings.manager_id` được cập nhật                       |

#### 🏠 Nhóm Quản lý Căn hộ

| UC   | Tên                   | Luồng chính                                                                              | Điều kiện tiên quyết                                 | Kết quả                                  |
| ---- | --------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| UC16 | Xem danh sách căn hộ  | Admin lọc theo tòa nhà, trạng thái, tầng → xem danh sách                                 | Đã đăng nhập, có ROLE_ADMIN                          | Danh sách căn hộ với trạng thái hiện tại |
| UC17 | Thêm căn hộ mới       | Admin chọn tòa nhà → điền form (số căn, diện tích, tầng, số phòng) → lưu                 | Tòa nhà tồn tại và active                            | Căn hộ mới với `status = AVAILABLE`      |
| UC18 | Sửa thông tin căn hộ  | Admin chọn căn hộ → sửa thông tin → submit                                               | Căn hộ tồn tại                                       | Thông tin căn hộ được cập nhật           |
| UC19 | Đổi trạng thái căn hộ | Admin chọn căn hộ → chọn trạng thái mới (MAINTENANCE/RESERVED/AVAILABLE) → ghi chú lý do | Căn hộ không đang OCCUPIED (trừ trường hợp đặc biệt) | `apartments.status` được cập nhật        |

#### 👥 Nhóm Quản lý Người dùng

| UC   | Tên                 | Luồng chính                                                                                                  | Điều kiện tiên quyết              | Kết quả                                                   |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------- | --------------------------------------------------------- |
| UC20 | Xem danh sách users | Admin lọc theo role, trạng thái, tìm kiếm theo tên/email/SĐT/CCCD                                            | Đã đăng nhập, có ROLE_ADMIN       | Danh sách users phân trang                                |
| UC21 | Tạo tài khoản       | Admin điền thông tin (tên, email, SĐT, CCCD, role) → hệ thống sinh password ngẫu nhiên → gửi email chào mừng | Email chưa tồn tại trong hệ thống | Tài khoản mới được tạo, email thông tin login được gửi đi |
| UC22 | Sửa thông tin user  | Admin chọn user → chỉnh sửa (tên, SĐT, ngày sinh, avatar) → lưu                                              | User tồn tại                      | Thông tin user được cập nhật                              |
| UC23 | Khoá / mở tài khoản | Admin chọn user → bật/tắt `is_active` → xác nhận                                                             | Không thể tự khoá chính mình      | User bị khoá không thể đăng nhập, hoặc được mở lại        |
| UC24 | Reset mật khẩu      | Admin chọn user → xác nhận reset → hệ thống sinh password mới → gửi email                                    | User tồn tại và có email hợp lệ   | Mật khẩu mới được gửi qua email user                      |
| UC25 | Gán / thu hồi role  | Admin chọn user → thêm hoặc xóa role → xác nhận                                                              | User phải giữ ít nhất 1 role      | `user_roles` được cập nhật                                |

#### 💰 Nhóm Cấu hình Phí

| UC   | Tên                      | Luồng chính                                                                                          | Điều kiện tiên quyết                        | Kết quả                                                                 |
| ---- | ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| UC26 | Xem bảng giá hiện tại    | Admin chọn tòa nhà → hệ thống lấy tất cả `fee_configs` có `effective_to IS NULL` → hiển thị bảng giá | Đã đăng nhập, có ROLE_ADMIN                 | Bảng giá hiện hành theo từng loại phí                                   |
| UC27 | Tạo cấu hình phí mới     | Admin chọn tòa nhà, loại phí, đơn giá, ngày áp dụng → submit → hệ thống tự đóng bản ghi cũ           | `effective_from` không được là ngày quá khứ | Cấu hình phí mới được tạo, bản ghi cũ cùng loại được set `effective_to` |
| UC28 | Xem lịch sử thay đổi giá | Admin chọn tòa nhà và loại phí → xem tất cả bản ghi `fee_configs` theo thời gian                     | Đã đăng nhập, có ROLE_ADMIN                 | Lịch sử thay đổi giá theo dòng thời gian                                |

#### 🛎️ Nhóm Quản lý Dịch vụ Tiện ích

| UC   | Tên                   | Luồng chính                                             | Điều kiện tiên quyết        | Kết quả                                     |
| ---- | --------------------- | ------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| UC29 | Xem danh sách dịch vụ | Admin xem `service_types` với số lượng đăng ký hiện tại | Đã đăng nhập, có ROLE_ADMIN | Danh sách dịch vụ và thống kê               |
| UC30 | Thêm loại dịch vụ mới | Admin điền tên, mô tả, phí hàng tháng, icon → lưu       | Tên dịch vụ chưa tồn tại    | Dịch vụ mới với `is_active = true`          |
| UC31 | Sửa thông tin dịch vụ | Admin chỉnh sửa thông tin dịch vụ → lưu                 | Dịch vụ tồn tại             | Thông tin dịch vụ được cập nhật             |
| UC32 | Bật / tắt dịch vụ     | Admin toggle `is_active` của dịch vụ                    | Dịch vụ tồn tại             | Dịch vụ bị ẩn khỏi danh sách cư dân khi tắt |

#### 📊 Nhóm Báo cáo & Thống kê

| UC   | Tên                   | Luồng chính                                                                                                         | Kết quả                              |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| UC33 | Xem Dashboard KPI     | Hệ thống tổng hợp: tổng tòa nhà, tổng căn hộ, tổng cư dân, tỷ lệ lấp đầy, doanh thu tháng, công nợ, biểu đồ 6 tháng | Dashboard với số liệu thời gian thực |
| UC34 | Báo cáo doanh thu     | Admin chọn tòa nhà, khoảng thời gian, nhóm theo tháng/quý/năm → xem biểu đồ và bảng chi tiết                        | Báo cáo doanh thu theo từng loại phí |
| UC35 | Báo cáo tỷ lệ lấp đầy | Admin chọn tháng → xem tỷ lệ `OCCUPIED / total` theo từng tòa nhà                                                   | Báo cáo occupancy rate               |
| UC36 | Báo cáo công nợ       | Hệ thống lấy tất cả bills có `status IN (PENDING, OVERDUE)` → danh sách con nợ với số tiền và số ngày trễ hạn       | Danh sách công nợ có thể xuất file   |
| UC37 | Lịch sử thanh toán    | Admin lọc theo tòa nhà, thời gian, phương thức, trạng thái → xem chi tiết giao dịch                                 | Lịch sử thanh toán phân trang        |

---

### 4.3 Use Cases của BAN QUẢN LÝ (Manager)

#### 🏠 Nhóm Căn hộ & Cư dân

| UC   | Tên                       | Luồng chính                                                                                                     | Điều kiện tiên quyết                                    | Kết quả                                                                  |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| UC38 | Xem danh sách căn hộ      | BQL xem căn hộ thuộc tòa nhà mình phụ trách, lọc theo tầng/trạng thái                                           | Đã đăng nhập, có ROLE_MANAGER                           | Danh sách căn hộ của tòa nhà mình                                        |
| UC39 | Xem chi tiết căn hộ       | BQL chọn căn hộ → xem thông tin chi tiết, cư dân hiện tại, xe đăng ký                                           | Căn hộ thuộc tòa nhà BQL phụ trách                      | Chi tiết căn hộ + lịch sử cư trú                                         |
| UC40 | Gán cư dân vào căn hộ     | BQL chọn căn hộ trống → tìm kiếm user có ROLE_RESIDENT → nhập ngày vào, đánh dấu chủ hộ → lưu                   | Căn hộ `status = AVAILABLE`, user chưa có căn hộ active | Record `apartment_residents` mới, `apartments.status → OCCUPIED`         |
| UC41 | Ghi nhận cư dân chuyển đi | BQL chọn cư dân → ghi nhận ngày chuyển đi → set `move_out_date` → nếu không còn ai ở → set `status = AVAILABLE` | Cư dân đang sinh sống (`move_out_date IS NULL`)         | `apartment_residents.move_out_date` được set, trạng thái căn hộ cập nhật |
| UC42 | Xem danh sách cư dân      | BQL xem tất cả cư dân đang sinh sống trong tòa nhà mình                                                         | Đã đăng nhập, có ROLE_MANAGER                           | Danh sách cư dân với thông tin căn hộ                                    |
| UC43 | Xem chi tiết cư dân       | BQL chọn cư dân → xem hồ sơ, lịch sử thanh toán, xe, yêu cầu                                                    | Cư dân thuộc tòa nhà BQL phụ trách                      | Hồ sơ đầy đủ của cư dân                                                  |

#### 🧾 Nhóm Hóa đơn

| UC   | Tên                   | Luồng chính                                                                                                                                            | Điều kiện tiên quyết                             | Kết quả                                                         |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------- |
| UC44 | Xem danh sách hóa đơn | BQL lọc theo căn hộ, tháng, trạng thái (PENDING/PAID/OVERDUE) → xem danh sách                                                                          | Đã đăng nhập, có ROLE_MANAGER                    | Danh sách hóa đơn phân trang                                    |
| UC45 | Xem chi tiết hóa đơn  | BQL chọn hóa đơn → xem từng dòng `bill_items` (điện, nước, phí quản lý...) và lịch sử thanh toán                                                       | Hóa đơn thuộc tòa nhà BQL phụ trách              | Chi tiết hóa đơn và lịch sử payment                             |
| UC46 | Tạo hóa đơn tháng     | BQL chọn tháng và danh sách căn hộ → nhập chỉ số điện/nước → hệ thống tính toán theo `fee_configs` → tạo `bills` + `bill_items` → gửi thông báo cư dân | Chưa có hóa đơn tháng đó cho căn hộ này          | Hóa đơn mới với `status = PENDING`, notification gửi đến cư dân |
| UC47 | Huỷ hóa đơn           | BQL chọn hóa đơn → xác nhận → set `status = CANCELLED` kèm ghi chú lý do                                                                               | Hóa đơn chưa được thanh toán (`paid_amount = 0`) | Hóa đơn bị huỷ, notification gửi đến cư dân                     |

#### 🔧 Nhóm Xử lý Yêu cầu

| UC   | Tên                    | Luồng chính                                                                              | Điều kiện tiên quyết                | Kết quả                                                       |
| ---- | ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| UC48 | Xem danh sách yêu cầu  | BQL lọc theo loại (MAINTENANCE/COMPLAINT/INQUIRY), trạng thái, độ ưu tiên                | Đã đăng nhập, có ROLE_MANAGER       | Danh sách yêu cầu phân trang                                  |
| UC49 | Xem chi tiết yêu cầu   | BQL chọn yêu cầu → xem mô tả, ảnh đính kèm, lịch sử xử lý                                | Yêu cầu thuộc tòa nhà BQL phụ trách | Chi tiết yêu cầu đầy đủ                                       |
| UC50 | Tiếp nhận & phân công  | BQL gán người xử lý (`assigned_to`) → set `status = ASSIGNED` → cư dân nhận notification | Yêu cầu ở trạng thái `PENDING`      | `service_requests.status → ASSIGNED`, notification gửi cư dân |
| UC51 | Cập nhật trạng thái    | BQL cập nhật trạng thái xử lý (IN_PROGRESS → RESOLVED) kèm ghi chú `resolution_notes`    | Yêu cầu đang trong quá trình xử lý  | Trạng thái cập nhật, cư dân nhận notification                 |
| UC52 | Đóng / từ chối yêu cầu | BQL từ chối yêu cầu không hợp lệ hoặc đóng yêu cầu đã hoàn thành kèm ghi chú             | Yêu cầu tồn tại và đang active      | `status → CLOSED` hoặc `REJECTED`, cư dân nhận notification   |

#### 🚗 Nhóm Duyệt Đăng ký

| UC   | Tên                        | Luồng chính                                                                                   | Điều kiện tiên quyết                    | Kết quả                                                           |
| ---- | -------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| UC53 | Xem danh sách xe chờ duyệt | BQL xem tất cả xe có `status = PENDING_APPROVAL` trong tòa nhà                                | Đã đăng nhập, có ROLE_MANAGER           | Danh sách xe đang chờ xét duyệt                                   |
| UC54 | Duyệt / từ chối đăng ký xe | BQL xem thông tin xe → duyệt (`status → ACTIVE`) hoặc từ chối (`status → REJECTED`) kèm lý do | Xe ở trạng thái `PENDING_APPROVAL`      | Cư dân nhận notification kết quả                                  |
| UC55 | Duyệt đăng ký dịch vụ      | BQL xem danh sách đăng ký dịch vụ `PENDING` → duyệt (`ACTIVE`) hoặc từ chối                   | Đăng ký dịch vụ tồn tại và đang PENDING | `service_registrations.status` cập nhật, cư dân nhận notification |

#### 📢 Nhóm Thông báo

| UC   | Tên               | Luồng chính                                                                                     | Điều kiện tiên quyết          | Kết quả                                                   |
| ---- | ----------------- | ----------------------------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------- |
| UC56 | Tạo thông báo mới | BQL điền tiêu đề, nội dung, chọn mức độ ưu tiên, tùy chọn ngày hết hạn → publish                | Đã đăng nhập, có ROLE_MANAGER | Announcement được tạo, hiển thị đến tất cả cư dân tòa nhà |
| UC57 | Quản lý thông báo | BQL xem danh sách thông báo đã gửi, sửa nội dung, hoặc ẩn thông báo cũ (`is_published = false`) | Thông báo do BQL đó tạo       | Thông báo được cập nhật                                   |

---

### 4.4 Use Cases của CƯ DÂN (Resident)

#### 🏠 Thông tin cá nhân

| UC   | Tên                  | Luồng chính                                                                                                 | Điều kiện tiên quyết                 | Kết quả                                 |
| ---- | -------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------- |
| UC58 | Xem thông tin căn hộ | Cư dân vào trang Dashboard → xem thông tin căn hộ đang ở (số căn, tầng, diện tích, danh sách thành viên hộ) | Đang có `apartment_residents` active | Thông tin căn hộ hiện tại               |
| UC59 | Xem hồ sơ cá nhân    | Cư dân xem thông tin tài khoản: tên, email, SĐT, CCCD, avatar                                               | Đã đăng nhập                         | Hồ sơ cá nhân                           |
| UC60 | Cập nhật hồ sơ       | Cư dân chỉnh sửa: tên hiển thị, SĐT, avatar, ngày sinh → lưu                                                | Đã đăng nhập                         | Thông tin được cập nhật (`users` table) |

#### 🧾 Hóa đơn & Thanh toán

| UC   | Tên                    | Luồng chính                                                                                                                        | Điều kiện tiên quyết                          | Kết quả                                                                  |
| ---- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| UC61 | Xem danh sách hóa đơn  | Cư dân vào trang Bills → xem tất cả hóa đơn của căn hộ mình, lọc theo tháng/trạng thái                                             | Đang ở căn hộ có hóa đơn                      | Danh sách hóa đơn phân trang                                             |
| UC62 | Xem chi tiết hóa đơn   | Cư dân chọn hóa đơn → xem từng dòng chi tiết (điện: X kWh × Y đ, nước: ...)                                                        | Hóa đơn thuộc căn hộ cư dân đang ở            | Chi tiết `bill_items` của hóa đơn                                        |
| UC63 | Thanh toán hóa đơn     | Cư dân chọn hóa đơn → chọn phương thức (VNPay/MoMo/Chuyển khoản) → xác nhận → tạo `payments` record → cập nhật `bills.paid_amount` | Hóa đơn có `status != PAID` và `!= CANCELLED` | Payment được ghi nhận, bill cập nhật trạng thái, email xác nhận được gửi |
| UC64 | Xem lịch sử thanh toán | Cư dân xem tất cả `payments` của mình, lọc theo thời gian, phương thức                                                             | Đã đăng nhập                                  | Lịch sử giao dịch đầy đủ                                                 |

#### 🚗 Đăng ký xe

| UC   | Tên              | Luồng chính                                                                      | Điều kiện tiên quyết                | Kết quả                                                       |
| ---- | ---------------- | -------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| UC65 | Xem danh sách xe | Cư dân xem tất cả xe đã đăng ký và trạng thái xét duyệt                          | Đã đăng nhập                        | Danh sách xe của cư dân                                       |
| UC66 | Đăng ký xe mới   | Cư dân điền form (loại xe, biển số, hãng, màu) → submit → BQL nhận yêu cầu duyệt | Biển số chưa tồn tại trong hệ thống | Xe mới với `status = PENDING_APPROVAL`, BQL nhận notification |
| UC67 | Huỷ đăng ký xe   | Cư dân chọn xe → huỷ đăng ký → set `status = INACTIVE`                           | Xe thuộc cư dân đó và đang `ACTIVE` | Xe bị vô hiệu hóa                                             |

#### 🛎️ Dịch vụ tiện ích

| UC   | Tên                   | Luồng chính                                                                        | Điều kiện tiên quyết                          | Kết quả                                            |
| ---- | --------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| UC68 | Xem danh sách dịch vụ | Cư dân xem tất cả dịch vụ `is_active = true` kèm phí và tình trạng đã đăng ký chưa | Đã đăng nhập                                  | Danh sách dịch vụ có thể đăng ký                   |
| UC69 | Đăng ký dịch vụ       | Cư dân chọn dịch vụ → xác nhận phí hàng tháng → submit → BQL nhận yêu cầu duyệt    | Chưa đăng ký dịch vụ này, dịch vụ đang active | `service_registrations` mới với `status = PENDING` |
| UC70 | Huỷ đăng ký dịch vụ   | Cư dân chọn dịch vụ đang dùng → huỷ → set `status = CANCELLED`                     | Đăng ký đang `ACTIVE`                         | Đăng ký bị huỷ                                     |

#### 📝 Yêu cầu & Phản ánh

| UC   | Tên                    | Luồng chính                                                                                                           | Điều kiện tiên quyết                 | Kết quả                                                              |
| ---- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| UC71 | Gửi yêu cầu / phản ánh | Cư dân chọn loại (MAINTENANCE/COMPLAINT/INQUIRY), điền tiêu đề, mô tả chi tiết, upload ảnh, chọn mức ưu tiên → submit | Đang sinh sống trong tòa nhà         | `service_requests` mới với `status = PENDING`, BQL nhận notification |
| UC72 | Theo dõi trạng thái    | Cư dân xem danh sách tất cả yêu cầu đã gửi, lọc theo trạng thái, xem lịch sử cập nhật và ghi chú xử lý của BQL        | Đã gửi yêu cầu trước đó              | Trạng thái và lịch sử xử lý chi tiết                                 |
| UC73 | Đánh giá kết quả xử lý | Cư dân chọn yêu cầu đã `RESOLVED` → đánh giá 1–5 sao → submit                                                         | Yêu cầu đang ở trạng thái `RESOLVED` | `service_requests.rating` được lưu                                   |

#### 🔔 Thông báo

| UC   | Tên             | Luồng chính                                                                                  | Điều kiện tiên quyết | Kết quả                        |
| ---- | --------------- | -------------------------------------------------------------------------------------------- | -------------------- | ------------------------------ |
| UC74 | Xem thông báo   | Cư dân xem danh sách `notifications` và `announcements` của tòa nhà mình, phân loại theo tab | Đã đăng nhập         | Danh sách thông báo mới nhất   |
| UC75 | Đánh dấu đã đọc | Cư dân bấm vào thông báo → set `is_read = true`, `read_at = NOW()`                           | Thông báo chưa đọc   | `notifications.is_read → true` |

---

## 5. Tổng hợp

| Actor           | Số Use Case    | Nhóm chức năng                                              |
| --------------- | -------------- | ----------------------------------------------------------- |
| **Admin**       | 27 (UC11–UC37) | Tòa nhà, Căn hộ, Users, Phí, Dịch vụ, Báo cáo               |
| **Ban Quản Lý** | 20 (UC38–UC57) | Căn hộ/Cư dân, Hóa đơn, Yêu cầu, Duyệt xe/DV, Thông báo     |
| **Cư Dân**      | 18 (UC58–UC75) | Hồ sơ, Hóa đơn/Thanh toán, Xe, Dịch vụ, Phản ánh, Thông báo |
| **Dùng chung**  | 4 (UC01–UC04)  | Đăng nhập, Đăng xuất, Đổi MK, Thông báo cá nhân             |
| **Tổng**        | **42**         |                                                             |

### Ma trận Actor – Use Case

| Nhóm chức năng               |    Admin     |          BQL          |       Cư dân        |
| ---------------------------- | :----------: | :-------------------: | :-----------------: |
| Xác thực (đăng nhập, đổi MK) |      ✅      |          ✅           |         ✅          |
| Quản lý tòa nhà              |      ✅      |          Xem          |          ✗          |
| Quản lý căn hộ               |  ✅ (full)   | ✅ (xem + gán cư dân) | Xem căn hộ của mình |
| Quản lý users                |      ✅      |           ✗           | Xem hồ sơ của mình  |
| Cấu hình phí                 |      ✅      |           ✗           |          ✗          |
| Quản lý dịch vụ tiện ích     |  ✅ (CRUD)   |     Duyệt đăng ký     |    Xem + Đăng ký    |
| Hóa đơn                      | ✅ (báo cáo) |    ✅ (tạo + huỷ)     |  Xem + Thanh toán   |
| Yêu cầu / phản ánh           |      ✗       |      ✅ (xử lý)       | ✅ (gửi + theo dõi) |
| Đăng ký xe                   |      ✗       |         Duyệt         | ✅ (đăng ký + huỷ)  |
| Thông báo broadcast          |      ✗       |  ✅ (tạo + quản lý)   |         Xem         |
| Thông báo cá nhân            |      ✅      |          ✅           |         ✅          |
| Báo cáo & Dashboard          |      ✅      |           ✗           |          ✗          |

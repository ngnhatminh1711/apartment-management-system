# 🗄️ Database Design – Hệ Thống Quản Lý Chung Cư

> **Stack:** PostgreSQL · Spring Boot JPA/Hibernate  
> **Tổng số bảng:** 16  
> **Nguyên tắc thiết kế:** Chuẩn hóa 3NF, soft delete, audit trail (created_at / updated_at), UUID hoặc BIGSERIAL cho PK

---

## 📐 Tổng quan sơ đồ quan hệ (ERD Summary)

```
buildings ──< apartments ──< apartment_residents >── users
    │               │                                   │
    │         bill_items ──< bills ──< payments         │
    │                                                   │
fee_configs (building_id)               user_roles >── roles
                                                        │
vehicles (user_id, apartment_id)                   (ADMIN / MANAGER / RESIDENT)
service_types ──< service_registrations (user_id, apartment_id)
service_requests (user_id, apartment_id, assigned_to)
announcements (building_id, sender_id) ──< announcement_buildings
notifications (user_id, reference)
```

---

## 📋 Danh sách 16 bảng

| #   | Tên bảng                | Mô tả                                                   | Module chính |
| --- | ----------------------- | ------------------------------------------------------- | ------------ |
| 1   | `users`                 | Tất cả người dùng hệ thống                              | Auth         |
| 2   | `roles`                 | Phân loại quyền hệ thống                                | Auth         |
| 3   | `user_roles`            | Gán role cho user                                       | Auth         |
| 4   | `buildings`             | Thông tin tòa nhà                                       | Admin        |
| 5   | `apartments`            | Căn hộ trong tòa nhà                                    | Admin / BQL  |
| 6   | `apartment_residents`   | Lịch sử cư trú (ai ở căn hộ nào, từ khi nào)            | BQL          |
| 7   | `fee_configs`           | Cấu hình bảng giá phí (điện, nước, dịch vụ…)            | Admin        |
| 8   | `bills`                 | Hóa đơn hàng tháng của từng căn hộ                      | BQL          |
| 9   | `bill_items`            | Chi tiết từng dòng trong hóa đơn                        | BQL          |
| 10  | `payments`              | Lịch sử giao dịch thanh toán                            | Cư dân       |
| 11  | `vehicles`              | Đăng ký xe của cư dân                                   | Cư dân       |
| 12  | `service_types`         | Danh mục dịch vụ tiện ích (gym, hồ bơi…)                | Admin        |
| 13  | `service_registrations` | Cư dân đăng ký dịch vụ                                  | Cư dân       |
| 14  | `service_requests`      | Yêu cầu sửa chữa / phản ánh / khiếu nại                 | Cư dân / BQL |
| 15  | `announcements`         | Thông báo từ BQL/Admin gửi đến cư dân                   | BQL / Admin  |
| 16  | `notifications`         | Thông báo cá nhân cho từng user (bill, request update…) | Hệ thống     |

---

## 🔐 Nhóm 1: Authentication & Authorization

### 1. `users`

> Lưu tất cả người dùng: Admin, Manager (BQL), Resident (Cư dân). Dùng chung 1 bảng, phân biệt qua `user_roles`.

```sql
CREATE TABLE users (
    id            BIGSERIAL       PRIMARY KEY,
    full_name     VARCHAR(100)    NOT NULL,
    email         VARCHAR(150)    NOT NULL UNIQUE,
    phone         VARCHAR(15)     UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    avatar_url    VARCHAR(500),
    date_of_birth DATE,
    id_card       VARCHAR(20)     UNIQUE,              -- CMND/CCCD
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

| Cột             | Kiểu           | Mô tả                           |
| --------------- | -------------- | ------------------------------- |
| `id`            | BIGSERIAL      | PK tự tăng                      |
| `email`         | VARCHAR UNIQUE | Dùng để đăng nhập               |
| `phone`         | VARCHAR UNIQUE | SĐT (nullable, dùng thay email) |
| `password_hash` | VARCHAR        | BCrypt hash                     |
| `id_card`       | VARCHAR UNIQUE | CMND/CCCD để xác minh cư dân    |
| `is_active`     | BOOLEAN        | Soft disable tài khoản          |

---

### 2. `roles`

> Cố định 3 roles: `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_RESIDENT`.

```sql
CREATE TABLE roles (
    id          SERIAL       PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,  -- ROLE_ADMIN | ROLE_MANAGER | ROLE_RESIDENT
    description VARCHAR(200)
);

INSERT INTO roles (name, description) VALUES
    ('ROLE_ADMIN',    'Quản trị hệ thống toàn bộ'),
    ('ROLE_MANAGER',  'Ban quản lý tòa nhà'),
    ('ROLE_RESIDENT', 'Cư dân đang sinh sống');
```

---

### 3. `user_roles`

> Junction table: 1 user có thể có nhiều role (ví dụ: Admin kiêm Manager).

```sql
CREATE TABLE user_roles (
    user_id  BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id  INT     NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
```

---

## 🏢 Nhóm 2: Tòa nhà & Căn hộ

### 4. `buildings`

> Một hệ thống có thể quản lý nhiều tòa nhà. Admin quản lý, có thể chỉ định Manager cho từng tòa.

```sql
CREATE TABLE buildings (
    id            BIGSERIAL     PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    address       TEXT          NOT NULL,
    num_floors    INT           NOT NULL DEFAULT 1,
    num_apartments INT          NOT NULL DEFAULT 0,
    description   TEXT,
    manager_id    BIGINT        REFERENCES users(id) ON DELETE SET NULL,  -- BQL phụ trách
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);
```

---

### 5. `apartments`

> Căn hộ thuộc một tòa nhà. Trạng thái giúp BQL biết căn hộ nào đang trống.

```sql
CREATE TABLE apartments (
    id              BIGSERIAL     PRIMARY KEY,
    building_id     BIGINT        NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    apartment_number VARCHAR(10)  NOT NULL,               -- "A101", "B203"
    floor           INT           NOT NULL,
    area_m2         DECIMAL(6,2)  NOT NULL,               -- Diện tích m²
    num_bedrooms    INT           NOT NULL DEFAULT 1,
    num_bathrooms   INT           NOT NULL DEFAULT 1,
    direction       VARCHAR(20),                          -- Hướng: Đông, Tây...
    status          VARCHAR(20)   NOT NULL DEFAULT 'AVAILABLE',
                                  -- AVAILABLE | OCCUPIED | MAINTENANCE | RESERVED
    notes           TEXT,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    UNIQUE (building_id, apartment_number)
);
```

---

### 6. `apartment_residents`

> **Bảng quan trọng:** Lưu lịch sử ai sống ở căn hộ nào và trong khoảng thời gian nào. Giúp truy vết kể cả sau khi cư dân chuyển đi.

```sql
CREATE TABLE apartment_residents (
    id            BIGSERIAL  PRIMARY KEY,
    apartment_id  BIGINT     NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    user_id       BIGINT     NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
    is_primary    BOOLEAN    NOT NULL DEFAULT FALSE,  -- TRUE = chủ hộ/người đại diện
    move_in_date  DATE       NOT NULL,
    move_out_date DATE,                               -- NULL = đang sinh sống
    notes         TEXT,
    created_by    BIGINT     REFERENCES users(id),
    created_at    TIMESTAMP  NOT NULL DEFAULT NOW()
);
```

> 💡 **Lý do tách bảng:** Một căn hộ có thể có nhiều cư dân (gia đình). Cư dân có thể chuyển đi rồi vào lại. Không xóa history.

---

## 💰 Nhóm 3: Phí & Hóa đơn

### 7. `fee_configs`

> Admin cấu hình bảng giá theo từng tòa nhà và từng loại phí. Lưu lịch sử thay đổi giá theo thời gian (effective_from / effective_to).

```sql
CREATE TABLE fee_configs (
    id              BIGSERIAL       PRIMARY KEY,
    building_id     BIGINT          NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    fee_type        VARCHAR(30)     NOT NULL,
                    -- ELECTRICITY | WATER | MANAGEMENT | PARKING_MOTORBIKE
                    -- PARKING_CAR | ELEVATOR | INTERNET | GARBAGE
    unit_price      DECIMAL(12,2)   NOT NULL,   -- Đơn giá
    unit            VARCHAR(20)     NOT NULL,   -- kWh | m3 | tháng | xe/tháng
    effective_from  DATE            NOT NULL,
    effective_to    DATE,                       -- NULL = đang áp dụng
    description     VARCHAR(200),
    created_by      BIGINT          REFERENCES users(id),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
```

> 💡 **Lý do thiết kế:** Giá điện/nước thay đổi theo thời gian. Cần lưu lịch sử để tính đúng hóa đơn các tháng trước.

---

### 8. `bills`

> Hóa đơn tổng hợp cho 1 căn hộ trong 1 tháng. BQL tạo, cư dân thanh toán.

```sql
CREATE TABLE bills (
    id              BIGSERIAL       PRIMARY KEY,
    apartment_id    BIGINT          NOT NULL REFERENCES apartments(id),
    billing_month   DATE            NOT NULL,           -- Lưu ngày 1 của tháng: 2025-01-01
    total_amount    DECIMAL(14,2)   NOT NULL DEFAULT 0,
    paid_amount     DECIMAL(14,2)   NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',
                    -- PENDING | PARTIALLY_PAID | PAID | OVERDUE | CANCELLED
    due_date        DATE            NOT NULL,
    notes           TEXT,
    created_by      BIGINT          REFERENCES users(id),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    UNIQUE (apartment_id, billing_month)               -- 1 tháng chỉ 1 hóa đơn/căn hộ
);
```

---

### 9. `bill_items`

> Chi tiết từng dòng trong hóa đơn (tiền điện bao nhiêu, nước bao nhiêu, phí quản lý bao nhiêu…).

```sql
CREATE TABLE bill_items (
    id            BIGSERIAL      PRIMARY KEY,
    bill_id       BIGINT         NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    fee_type      VARCHAR(30)    NOT NULL,        -- Loại phí (giống fee_configs.fee_type)
    description   VARCHAR(200),                  -- "Điện tháng 1: 150 kWh × 3.500đ"
    quantity      DECIMAL(10,3)  NOT NULL,        -- Số lượng (kWh, m3, hoặc 1 nếu cố định)
    unit_price    DECIMAL(12,2)  NOT NULL,        -- Đơn giá tại thời điểm lập hóa đơn
    amount        DECIMAL(14,2)  NOT NULL,        -- = quantity × unit_price
    reading_start DECIMAL(10,3),                 -- Chỉ số đầu kỳ (điện/nước)
    reading_end   DECIMAL(10,3)                  -- Chỉ số cuối kỳ
);
```

> 💡 **Lý do tách bill_items:** 1 hóa đơn gồm nhiều loại phí. Lưu `unit_price` snapshot tại thời điểm lập hóa đơn, tránh ảnh hưởng khi Admin thay đổi giá sau này.

---

### 10. `payments`

> Mỗi lần cư dân thanh toán (có thể thanh toán nhiều lần nếu trả một phần).

```sql
CREATE TABLE payments (
    id                BIGSERIAL      PRIMARY KEY,
    bill_id           BIGINT         NOT NULL REFERENCES bills(id),
    user_id           BIGINT         NOT NULL REFERENCES users(id),    -- Người thanh toán
    amount            DECIMAL(14,2)  NOT NULL,
    payment_method    VARCHAR(20)    NOT NULL,
                      -- CASH | VNPAY | MOMO | BANK_TRANSFER
    transaction_ref   VARCHAR(100)   UNIQUE,    -- Mã giao dịch từ cổng thanh toán
    status            VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
                      -- PENDING | SUCCESS | FAILED | REFUNDED
    payment_note      TEXT,
    paid_at           TIMESTAMP,                -- NULL nếu chưa hoàn tất
    created_at        TIMESTAMP      NOT NULL DEFAULT NOW()
);
```

---

## 🚗 Nhóm 4: Xe cộ & Dịch vụ

### 11. `vehicles`

> Cư dân đăng ký xe để lấy thẻ xe/vé tháng. BQL duyệt trước khi cấp.

```sql
CREATE TABLE vehicles (
    id              BIGSERIAL     PRIMARY KEY,
    user_id         BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apartment_id    BIGINT        NOT NULL REFERENCES apartments(id),
    vehicle_type    VARCHAR(20)   NOT NULL,         -- MOTORBIKE | CAR | BICYCLE | TRUCK
    license_plate   VARCHAR(20)   NOT NULL UNIQUE,
    brand           VARCHAR(50),                    -- Honda, Toyota...
    model           VARCHAR(50),                    -- Wave, Vios...
    color           VARCHAR(30),
    status          VARCHAR(20)   NOT NULL DEFAULT 'PENDING_APPROVAL',
                    -- PENDING_APPROVAL | ACTIVE | INACTIVE | REJECTED
    registered_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    approved_by     BIGINT        REFERENCES users(id),
    approved_at     TIMESTAMP,
    rejection_reason TEXT,
    expired_at      DATE,                           -- Ngày hết hạn thẻ xe (nếu có)
    notes           TEXT
);
```

---

### 12. `service_types`

> Admin định nghĩa danh mục dịch vụ tiện ích: Gym, Hồ bơi, Sân tennis, Internet cáp quang…

```sql
CREATE TABLE service_types (
    id            SERIAL        PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL UNIQUE,    -- "Thẻ Gym", "Hồ Bơi Tháng"
    description   TEXT,
    monthly_fee   DECIMAL(12,2) NOT NULL DEFAULT 0, -- 0 = miễn phí
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    icon_url      VARCHAR(500),
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);
```

---

### 13. `service_registrations`

> Cư dân đăng ký sử dụng dịch vụ tiện ích.

```sql
CREATE TABLE service_registrations (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    apartment_id      BIGINT       NOT NULL REFERENCES apartments(id),
    service_type_id   INT          NOT NULL REFERENCES service_types(id),
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
                      -- PENDING | ACTIVE | EXPIRED | CANCELLED
    registered_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    start_date        DATE,
    end_date          DATE,         -- NULL = gia hạn hàng tháng
    approved_by       BIGINT       REFERENCES users(id),
    notes             TEXT
);
```

---

## 🔧 Nhóm 5: Yêu cầu & Phản ánh

### 14. `service_requests`

> Cư dân gửi yêu cầu sửa chữa, phản ánh, hoặc khiếu nại. BQL tiếp nhận và xử lý, theo dõi trạng thái.

```sql
CREATE TABLE service_requests (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users(id),
    apartment_id      BIGINT       NOT NULL REFERENCES apartments(id),
    request_type      VARCHAR(30)  NOT NULL,
                      -- MAINTENANCE | COMPLAINT | INQUIRY | AMENITY | OTHER
    title             VARCHAR(200) NOT NULL,
    description       TEXT         NOT NULL,
    attachment_urls   TEXT[],                    -- Mảng URL ảnh đính kèm (PostgreSQL Array)
    priority          VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
                      -- LOW | MEDIUM | HIGH | URGENT
    status            VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
                      -- PENDING | ASSIGNED | IN_PROGRESS | RESOLVED | CLOSED | REJECTED
    assigned_to       BIGINT       REFERENCES users(id),    -- BQL/kỹ thuật viên nhận xử lý
    assigned_at       TIMESTAMP,
    resolved_at       TIMESTAMP,
    resolution_notes  TEXT,                      -- Ghi chú xử lý của BQL
    rating            INT CHECK (rating BETWEEN 1 AND 5),  -- Cư dân đánh giá sau khi giải quyết
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

---

## 🔔 Nhóm 6: Thông báo

### 15. `announcements`

> BQL/Admin gửi thông báo chung đến cư dân (toàn bộ, hoặc theo tòa nhà).

```sql
CREATE TABLE announcements (
    id            BIGSERIAL    PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    content       TEXT         NOT NULL,
    building_id   BIGINT       REFERENCES buildings(id) ON DELETE CASCADE,
                               -- NULL = gửi tất cả tòa nhà (toàn hệ thống)
    priority      VARCHAR(10)  NOT NULL DEFAULT 'NORMAL',
                  -- NORMAL | IMPORTANT | URGENT
    sender_id     BIGINT       NOT NULL REFERENCES users(id),
    attachment_urls TEXT[],
    is_published  BOOLEAN      NOT NULL DEFAULT TRUE,
    published_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    expires_at    TIMESTAMP,                     -- NULL = không hết hạn
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

---

### 16. `notifications`

> Thông báo cá nhân đến từng user: hóa đơn mới, trạng thái yêu cầu thay đổi, duyệt xe...

```sql
CREATE TABLE notifications (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title             VARCHAR(200) NOT NULL,
    content           TEXT,
    type              VARCHAR(30)  NOT NULL,
                      -- BILL_CREATED | BILL_OVERDUE | PAYMENT_SUCCESS
                      -- REQUEST_UPDATE | VEHICLE_APPROVED | ANNOUNCEMENT | SYSTEM
    reference_type    VARCHAR(30),               -- 'bills' | 'service_requests' | 'vehicles'
    reference_id      BIGINT,                    -- ID của record liên quan (để deep link)
    is_read           BOOLEAN      NOT NULL DEFAULT FALSE,
    read_at           TIMESTAMP,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

> 💡 **Lý do tách `announcements` và `notifications`:**
>
> - `announcements`: Broadcast (1 bản ghi → nhiều người nhận), BQL chủ động gửi.
> - `notifications`: Unicast (1 bản ghi = 1 người nhận), hệ thống tự sinh khi có sự kiện (hóa đơn mới, yêu cầu được xử lý…).

---

## 🔗 Tóm tắt quan hệ giữa các bảng

```
users (1) ──────────────────────── (*) user_roles (*) ── (1) roles
users (1) ──────────────────────── (*) apartment_residents (*) ── (1) apartments
users (1) ──────────────────────── (*) vehicles
users (1) ──────────────────────── (*) service_registrations
users (1) ──────────────────────── (*) service_requests
users (1) ──────────────────────── (*) notifications
users (1) ──────────────────────── (*) payments

buildings (1) ────────────────────── (*) apartments
buildings (1) ────────────────────── (*) fee_configs
buildings (1) ────────────────────── (*) announcements
buildings (1) ─────────────── (1) users [manager_id]

apartments (1) ──────────────────── (*) apartment_residents
apartments (1) ──────────────────── (*) bills
apartments (1) ──────────────────── (*) service_requests
apartments (1) ──────────────────── (*) vehicles

bills (1) ────────────────────────── (*) bill_items
bills (1) ────────────────────────── (*) payments

service_types (1) ───────────────── (*) service_registrations
```

---

## ⚡ Indexes quan trọng

```sql
-- Tìm kiếm user nhanh
CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_phone   ON users(phone);

-- Tìm căn hộ theo tòa nhà
CREATE INDEX idx_apartments_building ON apartments(building_id);
CREATE INDEX idx_apartments_status   ON apartments(status);

-- Lịch sử cư trú: ai đang ở căn hộ nào
CREATE INDEX idx_apt_residents_apartment ON apartment_residents(apartment_id);
CREATE INDEX idx_apt_residents_user      ON apartment_residents(user_id);
CREATE INDEX idx_apt_residents_active    ON apartment_residents(apartment_id) WHERE move_out_date IS NULL;

-- Hóa đơn: lọc theo tháng và trạng thái (query thường xuyên nhất)
CREATE INDEX idx_bills_apartment_month ON bills(apartment_id, billing_month);
CREATE INDEX idx_bills_status          ON bills(status);
CREATE INDEX idx_bills_due_date        ON bills(due_date) WHERE status IN ('PENDING','OVERDUE');

-- Thanh toán
CREATE INDEX idx_payments_bill   ON payments(bill_id);
CREATE INDEX idx_payments_user   ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Yêu cầu dịch vụ
CREATE INDEX idx_service_req_user      ON service_requests(user_id);
CREATE INDEX idx_service_req_apartment ON service_requests(apartment_id);
CREATE INDEX idx_service_req_status    ON service_requests(status);
CREATE INDEX idx_service_req_assigned  ON service_requests(assigned_to) WHERE status IN ('ASSIGNED','IN_PROGRESS');

-- Thông báo cá nhân chưa đọc (query nhiều nhất trên trang chủ)
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = FALSE;

-- Xe: lọc theo trạng thái
CREATE INDEX idx_vehicles_user   ON vehicles(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Cấu hình phí hiện tại
CREATE INDEX idx_fee_configs_building_active ON fee_configs(building_id) WHERE effective_to IS NULL;
```

---

## 📊 Số lượng bảng theo nhóm

| Nhóm                 | Số bảng | Bảng                                                 |
| -------------------- | ------- | ---------------------------------------------------- |
| Auth & Authorization | 3       | `users`, `roles`, `user_roles`                       |
| Tòa nhà & Căn hộ     | 3       | `buildings`, `apartments`, `apartment_residents`     |
| Phí & Hóa đơn        | 3       | `fee_configs`, `bills`, `bill_items`                 |
| Thanh toán           | 1       | `payments`                                           |
| Xe cộ & Dịch vụ      | 3       | `vehicles`, `service_types`, `service_registrations` |
| Yêu cầu & Phản ánh   | 1       | `service_requests`                                   |
| Thông báo            | 2       | `announcements`, `notifications`                     |
| **Tổng**             | **16**  |                                                      |

---

## 💡 Các quyết định thiết kế cần giải thích

### Tại sao 16 bảng thay vì 8–10?

| Bảng thêm                          | Lý do                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `user_roles`                       | Tách ra để 1 user có thể có nhiều role (Admin kiêm Manager)                                    |
| `apartment_residents`              | Lưu lịch sử cư trú (nhiều người/căn hộ theo thời gian), không chỉ `apartment_id` trong `users` |
| `bill_items`                       | 1 hóa đơn = nhiều dòng phí khác nhau. Nếu gộp vào `bills` sẽ vi phạm 1NF                       |
| `fee_configs`                      | Giá thay đổi theo thời gian, cần snapshot. Không hardcode vào code                             |
| `service_types`                    | Admin cần thêm/bớt dịch vụ động, không hardcode enum                                           |
| `announcements` vs `notifications` | Broadcast vs unicast – thiết kế khác nhau hoàn toàn                                            |

### Soft delete

Không xóa thật dữ liệu nhạy cảm. Dùng:

- `is_active = FALSE` cho `users`, `buildings`, `service_types`
- `move_out_date` cho `apartment_residents`
- `status = 'CANCELLED'` cho `bills`, `payments`, `service_registrations`

### Snapshot giá trong `bill_items`

Cột `unit_price` trong `bill_items` lưu giá **tại thời điểm lập hóa đơn**, không tham chiếu lại `fee_configs`. Điều này đảm bảo hóa đơn cũ không thay đổi khi Admin cập nhật bảng giá mới.

### `attachment_urls TEXT[]`

Dùng PostgreSQL Array type để lưu danh sách URL ảnh. Đơn giản hơn tạo thêm bảng `attachments` cho scope của project này.

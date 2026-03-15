# 🔐 PHẦN I - MODULE ADMIN

> **Base URL:** `/api/v1/admin`  
> **Auth:** Bearer JWT Token (tất cả endpoints đều yêu cầu `ROLE_ADMIN`)  
> **Response format chuẩn:**
>
> ```json
> {
>   "success": true,
>   "message": "Success",
>   "data": { ... },
>   "timestamp": "2025-01-15T10:30:00Z"
> }
> ```
>
> **Error format:**
>
> ```json
> {
>   "success": false,
>   "message": "Apartment not found",
>   "errorCode": "APARTMENT_NOT_FOUND",
>   "timestamp": "2025-01-15T10:30:00Z"
> }
> ```

---

## 📋 Danh sách tổng quan

| #                           | Method | Endpoint                            | Mô tả                                                     |
| --------------------------- | ------ | ----------------------------------- | --------------------------------------------------------- |
| **🏢 BUILDINGS**            |        |                                     |                                                           |
| 1                           | GET    | `/buildings`                        | Lấy danh sách tất cả tòa nhà                              |
| 2                           | GET    | `/buildings/{id}`                   | Lấy chi tiết 1 tòa nhà                                    |
| 3                           | POST   | `/buildings`                        | Tạo tòa nhà mới                                           |
| 4                           | PUT    | `/buildings/{id}`                   | Cập nhật thông tin tòa nhà                                |
| 5                           | DELETE | `/buildings/{id}`                   | Vô hiệu hóa tòa nhà (soft delete)                         |
| 6                           | PUT    | `/buildings/{id}/assign-manager`    | Gán/đổi Manager phụ trách tòa nhà                         |
| **🏠 APARTMENTS**           |        |                                     |                                                           |
| 7                           | GET    | `/apartments`                       | Lấy danh sách căn hộ (filter theo tòa, trạng thái)        |
| 8                           | GET    | `/apartments/{id}`                  | Lấy chi tiết 1 căn hộ                                     |
| 9                           | POST   | `/apartments`                       | Tạo căn hộ mới                                            |
| 10                          | PUT    | `/apartments/{id}`                  | Cập nhật thông tin căn hộ                                 |
| 11                          | DELETE | `/apartments/{id}`                  | Xóa căn hộ (soft delete)                                  |
| 12                          | PATCH  | `/apartments/{id}/status`           | Thay đổi trạng thái căn hộ                                |
| **💰 FEE CONFIGS**          |        |                                     |                                                           |
| 13                          | GET    | `/fee-configs`                      | Lấy cấu hình phí (filter theo tòa nhà, loại phí)          |
| 14                          | GET    | `/fee-configs/{id}`                 | Lấy chi tiết 1 cấu hình phí                               |
| 15                          | POST   | `/fee-configs`                      | Tạo cấu hình phí mới                                      |
| 16                          | PUT    | `/fee-configs/{id}`                 | Cập nhật cấu hình phí                                     |
| 17                          | DELETE | `/fee-configs/{id}`                 | Xóa cấu hình phí                                          |
| 18                          | GET    | `/fee-configs/current`              | Lấy bảng giá đang áp dụng theo tòa nhà                    |
| **👥 USER MANAGEMENT**      |        |                                     |                                                           |
| 19                          | GET    | `/users`                            | Lấy danh sách tất cả users (filter theo role, trạng thái) |
| 20                          | GET    | `/users/{id}`                       | Lấy chi tiết 1 user                                       |
| 21                          | POST   | `/users`                            | Tạo user mới (Admin tạo tài khoản Manager/Resident)       |
| 22                          | PUT    | `/users/{id}`                       | Cập nhật thông tin user                                   |
| 23                          | PATCH  | `/users/{id}/toggle-active`         | Kích hoạt / Vô hiệu hóa tài khoản                         |
| 24                          | PATCH  | `/users/{id}/reset-password`        | Reset mật khẩu user                                       |
| 25                          | POST   | `/users/{id}/roles`                 | Gán role cho user                                         |
| 26                          | DELETE | `/users/{id}/roles/{roleId}`        | Thu hồi role của user                                     |
| **🛎️ SERVICE TYPES**        |        |                                     |                                                           |
| 27                          | GET    | `/service-types`                    | Lấy danh sách loại dịch vụ                                |
| 28                          | GET    | `/service-types/{id}`               | Lấy chi tiết 1 loại dịch vụ                               |
| 29                          | POST   | `/service-types`                    | Tạo loại dịch vụ mới                                      |
| 30                          | PUT    | `/service-types/{id}`               | Cập nhật loại dịch vụ                                     |
| 31                          | PATCH  | `/service-types/{id}/toggle-active` | Bật/tắt dịch vụ                                           |
| **📊 REPORTS & STATISTICS** |        |                                     |                                                           |
| 32                          | GET    | `/reports/revenue`                  | Báo cáo doanh thu theo tháng/quý/năm                      |
| 33                          | GET    | `/reports/occupancy`                | Báo cáo tỷ lệ lấp đầy căn hộ                              |
| 34                          | GET    | `/reports/debt`                     | Báo cáo công nợ (hóa đơn chưa thanh toán)                 |
| 35                          | GET    | `/reports/payments`                 | Báo cáo chi tiết lịch sử thanh toán                       |
| 36                          | GET    | `/dashboard/stats`                  | Tổng quan KPI cho Admin Dashboard                         |

---

## 🏢 1. Buildings API

### 1.1 `GET /buildings` – Danh sách tòa nhà

**Query params:**

| Param      | Type    | Default          | Mô tả                     |
| ---------- | ------- | ---------------- | ------------------------- |
| `page`     | int     | 0                | Số trang (0-indexed)      |
| `size`     | int     | 10               | Số item/trang             |
| `search`   | string  | -                | Tìm theo tên hoặc địa chỉ |
| `isActive` | boolean | -                | Lọc theo trạng thái       |
| `sort`     | string  | `createdAt,desc` | Sắp xếp                   |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Sunrise Tower",
        "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
        "numFloors": 20,
        "numApartments": 200,
        "isActive": true,
        "manager": {
          "id": 5,
          "fullName": "Nguyễn Văn Manager",
          "email": "manager@example.com"
        },
        "stats": {
          "totalApartments": 200,
          "occupiedApartments": 178,
          "availableApartments": 22
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalElements": 3,
    "totalPages": 1,
    "currentPage": 0
  }
}
```

---

### 1.2 `GET /buildings/{id}` – Chi tiết tòa nhà

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sunrise Tower",
    "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
    "numFloors": 20,
    "numApartments": 200,
    "description": "Tòa nhà cao cấp trung tâm thành phố",
    "isActive": true,
    "manager": { "id": 5, "fullName": "Nguyễn Văn Manager", "email": "manager@example.com" },
    "stats": {
      "totalApartments": 200,
      "occupiedApartments": 178,
      "availableApartments": 22,
      "maintenanceApartments": 0
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-06-01T08:00:00Z"
  }
}
```

**Error `404`:** `BUILDING_NOT_FOUND`

---

### 1.3 `POST /buildings` – Tạo tòa nhà mới

**Request body:**

```json
{
  "name": "Sunrise Tower B",
  "address": "456 Lê Lợi, Q.1, TP.HCM",
  "numFloors": 25,
  "numApartments": 300,
  "description": "Tòa nhà mới khai trương Q3/2025",
  "managerId": 5
}
```

**Validation:**

| Field           | Rule                                     |
| --------------- | ---------------------------------------- |
| `name`          | NotBlank, max 100 ký tự                  |
| `address`       | NotBlank                                 |
| `numFloors`     | Min 1, Max 200                           |
| `numApartments` | Min 1                                    |
| `managerId`     | Optional, phải là user có `ROLE_MANAGER` |

**Response `201 Created`:** Trả về object building vừa tạo.

**Errors:**

- `400` – Validation failed
- `404` – `MANAGER_NOT_FOUND` nếu managerId không tồn tại
- `409` – `BUILDING_NAME_EXISTED` nếu tên đã tồn tại

---

### 1.4 `PUT /buildings/{id}` – Cập nhật tòa nhà

**Request body:** Tương tự POST, tất cả fields đều optional (partial update).

**Response `200 OK`:** Trả về object building đã cập nhật.

---

### 1.5 `DELETE /buildings/{id}` – Vô hiệu hóa tòa nhà

> Soft delete: set `is_active = false`. Không xóa thật.

**Response `200 OK`:**

```json
{ "success": true, "message": "Building deactivated successfully" }
```

**Error `409`:** `BUILDING_HAS_ACTIVE_RESIDENTS` – Không thể vô hiệu hóa khi còn cư dân đang ở.

---

### 1.6 `PUT /buildings/{id}/assign-manager` – Gán Manager

**Request body:**

```json
{ "managerId": 7 }
```

**Validation:** `managerId` phải có role `ROLE_MANAGER`.

**Response `200 OK`:** Trả về building đã cập nhật manager mới.

---

## 🏠 2. Apartments API

### 2.1 `GET /apartments` – Danh sách căn hộ

**Query params:**

| Param                  | Type   | Mô tả                                                 |
| ---------------------- | ------ | ----------------------------------------------------- |
| `buildingId`           | long   | Lọc theo tòa nhà                                      |
| `status`               | string | `AVAILABLE` / `OCCUPIED` / `MAINTENANCE` / `RESERVED` |
| `floor`                | int    | Lọc theo tầng                                         |
| `minArea`              | double | Diện tích tối thiểu (m²)                              |
| `maxArea`              | double | Diện tích tối đa (m²)                                 |
| `search`               | string | Tìm theo số căn hộ                                    |
| `page`, `size`, `sort` |        | Phân trang                                            |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 10,
        "buildingId": 1,
        "buildingName": "Sunrise Tower",
        "apartmentNumber": "A1001",
        "floor": 10,
        "areaM2": 75.5,
        "numBedrooms": 2,
        "numBathrooms": 2,
        "direction": "Đông Nam",
        "status": "OCCUPIED",
        "currentResident": {
          "id": 12,
          "fullName": "Trần Thị Bình",
          "phone": "0909123456"
        }
      }
    ],
    "totalElements": 200,
    "totalPages": 20,
    "currentPage": 0
  }
}
```

---

### 2.2 `GET /apartments/{id}` – Chi tiết căn hộ

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "buildingId": 1,
    "buildingName": "Sunrise Tower",
    "apartmentNumber": "A1001",
    "floor": 10,
    "areaM2": 75.5,
    "numBedrooms": 2,
    "numBathrooms": 2,
    "direction": "Đông Nam",
    "status": "OCCUPIED",
    "notes": "",
    "currentResidents": [
      {
        "id": 12,
        "fullName": "Trần Thị Bình",
        "phone": "0909123456",
        "isPrimary": true,
        "moveInDate": "2024-03-01"
      }
    ],
    "vehicles": [{ "id": 3, "licensePlate": "51A-123.45", "vehicleType": "MOTORBIKE", "status": "ACTIVE" }],
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 2.3 `POST /apartments` – Tạo căn hộ mới

**Request body:**

```json
{
  "buildingId": 1,
  "apartmentNumber": "A1501",
  "floor": 15,
  "areaM2": 90.0,
  "numBedrooms": 3,
  "numBathrooms": 2,
  "direction": "Tây",
  "notes": "View sông"
}
```

**Validation:**

| Field             | Rule                                      |
| ----------------- | ----------------------------------------- |
| `buildingId`      | Required, building phải tồn tại và active |
| `apartmentNumber` | NotBlank, unique trong cùng building      |
| `floor`           | Min 1                                     |
| `areaM2`          | Min 10.0                                  |
| `numBedrooms`     | Min 0, Max 10                             |

**Errors:**

- `409` – `APARTMENT_NUMBER_EXISTED` – Số căn hộ đã tồn tại trong tòa này

---

### 2.4 `PUT /apartments/{id}` – Cập nhật căn hộ

**Request body:** Tương tự POST (không có `buildingId` – không cho chuyển tòa).

---

### 2.5 `DELETE /apartments/{id}` – Xóa căn hộ

**Error `409`:** `APARTMENT_HAS_RESIDENTS` – Còn cư dân đang ở.

---

### 2.6 `PATCH /apartments/{id}/status` – Đổi trạng thái

**Request body:**

```json
{
  "status": "MAINTENANCE",
  "notes": "Sửa chữa hệ thống điện, dự kiến hoàn thành 15/08/2025"
}
```

**Validation:** `status` phải là một trong `AVAILABLE` / `OCCUPIED` / `MAINTENANCE` / `RESERVED`.

**Error `409`:** Không thể set `AVAILABLE` khi còn cư dân đang ở (`APARTMENT_STILL_OCCUPIED`).

---

## 💰 3. Fee Configs API

### 3.1 `GET /fee-configs` – Danh sách cấu hình phí

**Query params:**

| Param        | Type    | Mô tả                                                      |
| ------------ | ------- | ---------------------------------------------------------- |
| `buildingId` | long    | **Required** – lọc theo tòa nhà                            |
| `feeType`    | string  | Lọc theo loại phí                                          |
| `activeOnly` | boolean | `true` = chỉ lấy giá đang áp dụng (`effective_to IS NULL`) |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "buildingId": 1,
      "feeType": "ELECTRICITY",
      "unitPrice": 3500.0,
      "unit": "kWh",
      "effectiveFrom": "2025-01-01",
      "effectiveTo": null,
      "description": "Giá điện áp dụng từ T1/2025",
      "createdBy": { "id": 1, "fullName": "Admin" },
      "createdAt": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "buildingId": 1,
      "feeType": "WATER",
      "unitPrice": 15000.0,
      "unit": "m3",
      "effectiveFrom": "2025-01-01",
      "effectiveTo": null,
      "description": "Giá nước áp dụng từ T1/2025"
    }
  ]
}
```

---

### 3.2 `GET /fee-configs/current` – Bảng giá hiện tại

> Trả về tất cả loại phí đang áp dụng (`effective_to IS NULL`) của 1 tòa nhà, nhóm theo `feeType`.

**Query params:** `buildingId` (required)

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "buildingId": 1,
    "buildingName": "Sunrise Tower",
    "effectiveDate": "2025-01-01",
    "fees": {
      "ELECTRICITY": { "unitPrice": 3500, "unit": "kWh" },
      "WATER": { "unitPrice": 15000, "unit": "m3" },
      "MANAGEMENT": { "unitPrice": 500000, "unit": "tháng" },
      "PARKING_MOTORBIKE": { "unitPrice": 150000, "unit": "xe/tháng" },
      "PARKING_CAR": { "unitPrice": 600000, "unit": "xe/tháng" },
      "GARBAGE": { "unitPrice": 50000, "unit": "tháng" }
    }
  }
}
```

---

### 3.3 `POST /fee-configs` – Tạo/cập nhật bảng giá mới

> Khi tạo giá mới cho 1 loại phí đã có, tự động set `effective_to` của bản ghi cũ = ngày trước `effectiveFrom` của bản ghi mới.

**Request body:**

```json
{
  "buildingId": 1,
  "feeType": "ELECTRICITY",
  "unitPrice": 3800.0,
  "unit": "kWh",
  "effectiveFrom": "2025-07-01",
  "description": "Điều chỉnh giá điện theo EVN T7/2025"
}
```

**Validation:**

| Field           | Rule                              |
| --------------- | --------------------------------- |
| `feeType`       | Phải là một trong các enum hợp lệ |
| `unitPrice`     | Min 0                             |
| `effectiveFrom` | Không được là ngày trong quá khứ  |
| `buildingId`    | Building phải tồn tại             |

**Errors:**

- `400` – `EFFECTIVE_DATE_IN_PAST`
- `409` – `FEE_CONFIG_OVERLAP` – Khoảng thời gian bị trùng với config khác

---

### 3.4 `PUT /fee-configs/{id}` – Cập nhật cấu hình phí

> Chỉ cho sửa `description` và `effectiveTo`. Không cho sửa `unitPrice` sau khi đã tạo (phải tạo bản ghi mới).

**Request body:**

```json
{
  "effectiveTo": "2025-06-30",
  "description": "Giá điện cũ, áp dụng đến T6/2025"
}
```

---

### 3.5 `DELETE /fee-configs/{id}` – Xóa cấu hình phí

**Error `409`:** `FEE_CONFIG_IN_USE` – Không xóa được nếu đã có hóa đơn dùng giá này.

---

## 👥 4. User Management API

### 4.1 `GET /users` – Danh sách users

**Query params:**

| Param                  | Type    | Mô tả                                           |
| ---------------------- | ------- | ----------------------------------------------- |
| `role`                 | string  | `ROLE_ADMIN` / `ROLE_MANAGER` / `ROLE_RESIDENT` |
| `isActive`             | boolean | Lọc theo trạng thái                             |
| `buildingId`           | long    | Lọc cư dân đang ở tòa này                       |
| `search`               | string  | Tìm theo tên, email, SĐT, CCCD                  |
| `page`, `size`, `sort` |         | Phân trang                                      |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 12,
        "fullName": "Trần Thị Bình",
        "email": "binh@example.com",
        "phone": "0909123456",
        "idCard": "079123456789",
        "isActive": true,
        "roles": ["ROLE_RESIDENT"],
        "currentApartment": {
          "id": 10,
          "apartmentNumber": "A1001",
          "buildingName": "Sunrise Tower"
        },
        "createdAt": "2024-03-01T00:00:00Z"
      }
    ],
    "totalElements": 350,
    "totalPages": 35,
    "currentPage": 0
  }
}
```

---

### 4.2 `GET /users/{id}` – Chi tiết user

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 12,
    "fullName": "Trần Thị Bình",
    "email": "binh@example.com",
    "phone": "0909123456",
    "idCard": "079123456789",
    "dateOfBirth": "1990-05-15",
    "avatarUrl": "https://...",
    "isActive": true,
    "roles": ["ROLE_RESIDENT"],
    "residenceHistory": [
      {
        "apartmentId": 10,
        "apartmentNumber": "A1001",
        "buildingName": "Sunrise Tower",
        "isPrimary": true,
        "moveInDate": "2024-03-01",
        "moveOutDate": null
      }
    ],
    "vehicles": [{ "id": 3, "licensePlate": "51A-123.45", "vehicleType": "MOTORBIKE", "status": "ACTIVE" }],
    "createdAt": "2024-03-01T00:00:00Z"
  }
}
```

---

### 4.3 `POST /users` – Tạo user mới

> Admin tạo tài khoản cho Manager hoặc Resident. Password mặc định sẽ gửi qua email.

**Request body:**

```json
{
  "fullName": "Lê Văn Cường",
  "email": "cuong@example.com",
  "phone": "0912345678",
  "idCard": "079987654321",
  "dateOfBirth": "1985-08-20",
  "roles": ["ROLE_RESIDENT"]
}
```

**Validation:**

| Field      | Rule                           |
| ---------- | ------------------------------ |
| `fullName` | NotBlank, max 100              |
| `email`    | Valid email format, unique     |
| `phone`    | Unique nếu có                  |
| `idCard`   | Unique nếu có                  |
| `roles`    | NotEmpty, phải là roles hợp lệ |

**Business logic:** Hệ thống tự sinh password ngẫu nhiên và gửi email chào mừng kèm thông tin đăng nhập.

**Errors:**

- `409` – `EMAIL_ALREADY_EXISTS`
- `409` – `PHONE_ALREADY_EXISTS`
- `409` – `ID_CARD_ALREADY_EXISTS`

---

### 4.4 `PUT /users/{id}` – Cập nhật thông tin user

**Request body:**

```json
{
  "fullName": "Lê Văn Cường",
  "phone": "0912345678",
  "dateOfBirth": "1985-08-20",
  "avatarUrl": "https://..."
}
```

> Không cho Admin sửa `email` và `idCard` qua API này (dùng endpoint riêng nếu cần).

---

### 4.5 `PATCH /users/{id}/toggle-active` – Kích hoạt / Vô hiệu hóa tài khoản

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 12,
    "isActive": false,
    "message": "User account has been deactivated"
  }
}
```

**Error `400`:** `CANNOT_DEACTIVATE_SELF` – Admin không thể tự vô hiệu hóa chính mình.

---

### 4.6 `PATCH /users/{id}/reset-password` – Reset mật khẩu

> Sinh password mới ngẫu nhiên, gửi qua email đã đăng ký của user.

**Response `200 OK`:**

```json
{
  "success": true,
  "message": "New password has been sent to user's email"
}
```

---

### 4.7 `POST /users/{id}/roles` – Gán role

**Request body:**

```json
{ "roleId": 2 }
```

**Error `409`:** `ROLE_ALREADY_ASSIGNED`

---

### 4.8 `DELETE /users/{id}/roles/{roleId}` – Thu hồi role

**Error `400`:** `CANNOT_REMOVE_LAST_ROLE` – User phải có ít nhất 1 role.

---

## 🛎️ 5. Service Types API

### 5.1 `GET /service-types` – Danh sách dịch vụ

**Query params:** `isActive` (boolean), `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thẻ Gym Tháng",
      "description": "Sử dụng phòng gym tầng 3 không giới hạn",
      "monthlyFee": 300000.0,
      "isActive": true,
      "iconUrl": "https://...",
      "totalRegistrations": 45
    },
    {
      "id": 2,
      "name": "Hồ Bơi Tháng",
      "description": "Vé tháng hồ bơi tầng 5",
      "monthlyFee": 200000.0,
      "isActive": true,
      "iconUrl": "https://...",
      "totalRegistrations": 32
    }
  ]
}
```

---

### 5.2 `POST /service-types` – Tạo dịch vụ mới

**Request body:**

```json
{
  "name": "Sân Tennis Theo Giờ",
  "description": "Đặt sân tennis tầng 18, tính theo giờ",
  "monthlyFee": 100000.0,
  "iconUrl": "https://..."
}
```

**Validation:** `name` unique, `monthlyFee` min 0.

---

### 5.3 `PUT /service-types/{id}` – Cập nhật dịch vụ

**Request body:** Tương tự POST.

---

### 5.4 `PATCH /service-types/{id}/toggle-active` – Bật/tắt dịch vụ

**Response `200 OK`:**

```json
{
  "success": true,
  "data": { "id": 1, "isActive": false }
}
```

---

## 📊 6. Reports & Statistics API

### 6.1 `GET /reports/revenue` – Báo cáo doanh thu

**Query params:**

| Param        | Type   | Mô tả                                           |
| ------------ | ------ | ----------------------------------------------- |
| `buildingId` | long   | Lọc theo tòa (bỏ trống = tất cả)                |
| `from`       | string | Từ tháng (format: `YYYY-MM`)                    |
| `to`         | string | Đến tháng (format: `YYYY-MM`)                   |
| `groupBy`    | string | `month` / `quarter` / `year` (default: `month`) |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBilled": 2850000000,
      "totalCollected": 2650000000,
      "totalOutstanding": 200000000,
      "collectionRate": 92.98
    },
    "breakdown": [
      {
        "period": "2025-01",
        "totalBilled": 950000000,
        "totalCollected": 920000000,
        "outstanding": 30000000,
        "collectionRate": 96.84,
        "byFeeType": {
          "ELECTRICITY": 320000000,
          "WATER": 85000000,
          "MANAGEMENT": 450000000,
          "PARKING": 65000000,
          "GARBAGE": 30000000
        }
      },
      {
        "period": "2025-02",
        "totalBilled": 940000000,
        "totalCollected": 880000000,
        "outstanding": 60000000,
        "collectionRate": 93.62
      }
    ]
  }
}
```

---

### 6.2 `GET /reports/occupancy` – Báo cáo tỷ lệ lấp đầy

**Query params:** `buildingId` (optional), `month` (`YYYY-MM`)

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "reportMonth": "2025-06",
    "buildings": [
      {
        "buildingId": 1,
        "buildingName": "Sunrise Tower",
        "totalApartments": 200,
        "occupied": 178,
        "available": 18,
        "maintenance": 4,
        "reserved": 0,
        "occupancyRate": 89.0
      }
    ],
    "overall": {
      "totalApartments": 200,
      "occupancyRate": 89.0
    }
  }
}
```

---

### 6.3 `GET /reports/debt` – Báo cáo công nợ

**Query params:** `buildingId` (optional), `asOfDate` (`YYYY-MM-DD`, default today)

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "asOfDate": "2025-06-15",
    "summary": {
      "totalDebtors": 23,
      "totalDebtAmount": 120500000,
      "overdueCount": 8
    },
    "debtors": [
      {
        "apartmentId": 15,
        "apartmentNumber": "B502",
        "buildingName": "Sunrise Tower",
        "residentName": "Phạm Văn An",
        "residentPhone": "0901234567",
        "outstandingBills": [
          {
            "billId": 234,
            "billingMonth": "2025-04",
            "totalAmount": 2800000,
            "paidAmount": 0,
            "dueDate": "2025-05-15",
            "daysOverdue": 31
          }
        ],
        "totalDebt": 5600000
      }
    ]
  }
}
```

---

### 6.4 `GET /reports/payments` – Lịch sử thanh toán

**Query params:**

| Param           | Type   | Mô tả                                       |
| --------------- | ------ | ------------------------------------------- |
| `buildingId`    | long   | Lọc theo tòa                                |
| `from`          | string | Từ ngày (`YYYY-MM-DD`)                      |
| `to`            | string | Đến ngày (`YYYY-MM-DD`)                     |
| `paymentMethod` | string | `CASH` / `VNPAY` / `MOMO` / `BANK_TRANSFER` |
| `status`        | string | `SUCCESS` / `FAILED` / `PENDING`            |
| `page`, `size`  |        | Phân trang                                  |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 156,
      "totalAmount": 850000000,
      "byMethod": {
        "VNPAY": 520000000,
        "MOMO": 210000000,
        "CASH": 120000000
      }
    },
    "content": [
      {
        "id": 501,
        "billId": 234,
        "billingMonth": "2025-06",
        "apartmentNumber": "A1001",
        "residentName": "Trần Thị Bình",
        "amount": 2500000,
        "paymentMethod": "VNPAY",
        "transactionRef": "VNP20250615123456",
        "status": "SUCCESS",
        "paidAt": "2025-06-15T09:23:00Z"
      }
    ],
    "totalElements": 156,
    "totalPages": 16
  }
}
```

---

### 6.5 `GET /dashboard/stats` – KPI Tổng quan Admin Dashboard

**Query params:** `buildingId` (optional), `year` (default: năm hiện tại)

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBuildings": 3,
      "totalApartments": 500,
      "totalResidents": 892,
      "occupancyRate": 87.4
    },
    "financials": {
      "currentMonthBilled": 950000000,
      "currentMonthCollected": 880000000,
      "currentMonthCollectionRate": 92.6,
      "outstandingDebt": 200000000,
      "totalDebtors": 23
    },
    "operations": {
      "pendingServiceRequests": 12,
      "inProgressServiceRequests": 5,
      "pendingVehicleApprovals": 7,
      "pendingServiceRegistrations": 3
    },
    "revenueChart": [
      { "month": "2025-01", "billed": 950000000, "collected": 920000000 },
      { "month": "2025-02", "billed": 940000000, "collected": 880000000 },
      { "month": "2025-03", "billed": 960000000, "collected": 945000000 },
      { "month": "2025-04", "billed": 935000000, "collected": 910000000 },
      { "month": "2025-05", "billed": 950000000, "collected": 895000000 },
      { "month": "2025-06", "billed": 950000000, "collected": 880000000 }
    ],
    "occupancyByBuilding": [
      { "buildingId": 1, "buildingName": "Sunrise Tower", "occupancyRate": 89.0 },
      { "buildingId": 2, "buildingName": "Green Park", "occupancyRate": 85.5 }
    ]
  }
}
```

---

# 🏢 PHẦN II - MODULE BAN QUẢN LÝ (Manager)

> **Base URL:** `/api/v1/manager`  
> **Yêu cầu role:** `ROLE_MANAGER`  
> **Phạm vi dữ liệu:** Manager chỉ thấy dữ liệu thuộc tòa nhà mình được gán (`buildings.manager_id = currentUser.id`). Mọi request ra ngoài phạm vi này đều trả `403 Forbidden`.

## 📋 Danh sách tổng quan – Manager

| #                             | Method | Endpoint                                           | Mô tả                                   | UC   |
| ----------------------------- | ------ | -------------------------------------------------- | --------------------------------------- | ---- |
| **🏠 APARTMENTS & RESIDENTS** |        |                                                    |                                         |      |
| 1                             | GET    | `/apartments`                                      | Danh sách căn hộ trong tòa nhà mình     | UC38 |
| 2                             | GET    | `/apartments/{id}`                                 | Chi tiết 1 căn hộ                       | UC39 |
| 3                             | POST   | `/apartments/{id}/residents`                       | Gán cư dân vào căn hộ                   | UC40 |
| 4                             | PATCH  | `/apartments/{id}/residents/{residentId}/move-out` | Ghi nhận cư dân chuyển đi               | UC41 |
| 5                             | GET    | `/residents`                                       | Danh sách cư dân trong tòa nhà          | UC42 |
| 6                             | GET    | `/residents/{id}`                                  | Chi tiết 1 cư dân                       | UC43 |
| **🧾 BILLS**                  |        |                                                    |                                         |      |
| 7                             | GET    | `/bills`                                           | Danh sách hóa đơn (filter đa dạng)      | UC44 |
| 8                             | GET    | `/bills/{id}`                                      | Chi tiết hóa đơn + từng dòng bill_items | UC45 |
| 9                             | POST   | `/bills`                                           | Tạo hóa đơn tháng cho 1 căn hộ          | UC46 |
| 10                            | POST   | `/bills/bulk`                                      | Tạo hóa đơn hàng loạt cho nhiều căn hộ  | UC46 |
| 11                            | PATCH  | `/bills/{id}/cancel`                               | Huỷ hóa đơn                             | UC47 |
| **🔧 SERVICE REQUESTS**       |        |                                                    |                                         |      |
| 12                            | GET    | `/service-requests`                                | Danh sách yêu cầu / phản ánh            | UC48 |
| 13                            | GET    | `/service-requests/{id}`                           | Chi tiết yêu cầu                        | UC49 |
| 14                            | PATCH  | `/service-requests/{id}/assign`                    | Tiếp nhận & phân công xử lý             | UC50 |
| 15                            | PATCH  | `/service-requests/{id}/status`                    | Cập nhật trạng thái xử lý               | UC51 |
| 16                            | PATCH  | `/service-requests/{id}/close`                     | Đóng / từ chối yêu cầu                  | UC52 |
| **🚗 VEHICLES**               |        |                                                    |                                         |      |
| 17                            | GET    | `/vehicles`                                        | Danh sách xe (filter theo trạng thái)   | UC53 |
| 18                            | PATCH  | `/vehicles/{id}/approve`                           | Duyệt đăng ký xe                        | UC54 |
| 19                            | PATCH  | `/vehicles/{id}/reject`                            | Từ chối đăng ký xe                      | UC54 |
| **🛎️ SERVICE REGISTRATIONS**  |        |                                                    |                                         |      |
| 20                            | GET    | `/service-registrations`                           | Danh sách đăng ký dịch vụ               | UC55 |
| 21                            | PATCH  | `/service-registrations/{id}/approve`              | Duyệt đăng ký dịch vụ                   | UC55 |
| 22                            | PATCH  | `/service-registrations/{id}/reject`               | Từ chối đăng ký dịch vụ                 | UC55 |
| **📢 ANNOUNCEMENTS**          |        |                                                    |                                         |      |
| 23                            | GET    | `/announcements`                                   | Danh sách thông báo đã tạo              | UC57 |
| 24                            | GET    | `/announcements/{id}`                              | Chi tiết thông báo                      | UC57 |
| 25                            | POST   | `/announcements`                                   | Tạo thông báo mới                       | UC56 |
| 26                            | PUT    | `/announcements/{id}`                              | Cập nhật thông báo                      | UC57 |
| 27                            | PATCH  | `/announcements/{id}/toggle-publish`               | Ẩn / hiện thông báo                     | UC57 |
| **📊 DASHBOARD**              |        |                                                    |                                         |      |
| 28                            | GET    | `/dashboard`                                       | Tổng quan KPI tòa nhà mình              | –    |

---

## 🏠 1. Apartments & Residents API

### 1.1 `GET /apartments` – Danh sách căn hộ

> Trả về căn hộ thuộc tòa nhà Manager đang phụ trách.

**Query params:**

| Param                  | Type   | Mô tả                                                 |
| ---------------------- | ------ | ----------------------------------------------------- |
| `status`               | string | `AVAILABLE` / `OCCUPIED` / `MAINTENANCE` / `RESERVED` |
| `floor`                | int    | Lọc theo tầng                                         |
| `search`               | string | Tìm theo số căn hộ                                    |
| `page`, `size`, `sort` |        | Phân trang                                            |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 10,
        "apartmentNumber": "A1001",
        "floor": 10,
        "areaM2": 75.5,
        "numBedrooms": 2,
        "numBathrooms": 2,
        "status": "OCCUPIED",
        "currentResidents": [
          {
            "id": 12,
            "fullName": "Trần Thị Bình",
            "phone": "0909123456",
            "isPrimary": true,
            "moveInDate": "2024-03-01"
          }
        ],
        "pendingBillCount": 1,
        "pendingRequestCount": 0
      }
    ],
    "totalElements": 120,
    "totalPages": 12,
    "currentPage": 0
  }
}
```

---

### 1.2 `GET /apartments/{id}` – Chi tiết căn hộ

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "apartmentNumber": "A1001",
    "floor": 10,
    "areaM2": 75.5,
    "numBedrooms": 2,
    "numBathrooms": 2,
    "direction": "Đông Nam",
    "status": "OCCUPIED",
    "notes": "",
    "currentResidents": [
      {
        "id": 12,
        "fullName": "Trần Thị Bình",
        "email": "binh@example.com",
        "phone": "0909123456",
        "idCard": "079123456789",
        "isPrimary": true,
        "moveInDate": "2024-03-01"
      }
    ],
    "residenceHistory": [
      {
        "userId": 8,
        "fullName": "Nguyễn Văn Cũ",
        "moveInDate": "2022-01-01",
        "moveOutDate": "2023-12-31"
      }
    ],
    "vehicles": [
      {
        "id": 3,
        "licensePlate": "51A-123.45",
        "vehicleType": "MOTORBIKE",
        "brand": "Honda",
        "status": "ACTIVE"
      }
    ],
    "recentBills": [
      {
        "id": 101,
        "billingMonth": "2025-06",
        "totalAmount": 2800000,
        "status": "PENDING",
        "dueDate": "2025-07-15"
      }
    ]
  }
}
```

**Errors:** `404` – `APARTMENT_NOT_FOUND` | `403` – `ACCESS_DENIED` (căn hộ không thuộc tòa nhà mình)

---

### 1.3 `POST /apartments/{id}/residents` – Gán cư dân vào căn hộ

**Request body:**

```json
{
  "userId": 25,
  "isPrimary": true,
  "moveInDate": "2025-07-01",
  "notes": "Chủ hộ, hợp đồng 1 năm"
}
```

**Validation:**

| Field        | Rule                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| `userId`     | Required, user phải có `ROLE_RESIDENT`, user phải đang không có căn hộ active |
| `isPrimary`  | Nếu `true`, các residents khác của căn hộ sẽ tự động set `isPrimary = false`  |
| `moveInDate` | Required, không được là ngày tương lai quá 30 ngày                            |

**Business logic:**

- Tạo record `apartment_residents` mới.
- Nếu căn hộ đang `AVAILABLE` → tự động chuyển `status → OCCUPIED`.
- Gửi `notification` đến cư dân: "Bạn đã được gán vào căn hộ A1001".

**Response `201 Created`:**

```json
{
  "success": true,
  "message": "Resident assigned successfully",
  "data": {
    "id": 45,
    "apartmentId": 10,
    "apartmentNumber": "A1001",
    "userId": 25,
    "fullName": "Lê Văn Mới",
    "isPrimary": true,
    "moveInDate": "2025-07-01"
  }
}
```

**Errors:**

- `404` – `USER_NOT_FOUND`
- `409` – `USER_ALREADY_HAS_APARTMENT` – User đang ở căn hộ khác
- `409` – `APARTMENT_NOT_AVAILABLE` – Căn hộ đang MAINTENANCE hoặc RESERVED

---

### 1.4 `PATCH /apartments/{id}/residents/{residentId}/move-out` – Ghi nhận chuyển đi

**Request body:**

```json
{
  "moveOutDate": "2025-07-31",
  "notes": "Hết hợp đồng, không gia hạn"
}
```

**Business logic:**

- Set `apartment_residents.move_out_date`.
- Nếu không còn ai ở căn hộ → `apartments.status → AVAILABLE`.
- Các xe đang `ACTIVE` của cư dân tại căn hộ này → `status → INACTIVE`.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "residentId": 12,
    "fullName": "Trần Thị Bình",
    "moveOutDate": "2025-07-31",
    "apartmentStatus": "AVAILABLE"
  }
}
```

**Errors:**

- `404` – `RESIDENT_NOT_IN_APARTMENT`
- `400` – `MOVE_OUT_DATE_BEFORE_MOVE_IN`
- `409` – `HAS_UNPAID_BILLS` – Còn hóa đơn chưa thanh toán

---

### 1.5 `GET /residents` – Danh sách cư dân

**Query params:**

| Param                  | Type   | Mô tả                          |
| ---------------------- | ------ | ------------------------------ |
| `search`               | string | Tìm theo tên, email, SĐT, CCCD |
| `apartmentId`          | long   | Lọc theo căn hộ                |
| `floor`                | int    | Lọc theo tầng                  |
| `page`, `size`, `sort` |        | Phân trang                     |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 12,
        "fullName": "Trần Thị Bình",
        "email": "binh@example.com",
        "phone": "0909123456",
        "idCard": "079123456789",
        "avatarUrl": "https://...",
        "apartment": {
          "id": 10,
          "apartmentNumber": "A1001",
          "floor": 10
        },
        "isPrimary": true,
        "moveInDate": "2024-03-01",
        "outstandingDebt": 2800000,
        "vehicleCount": 1
      }
    ],
    "totalElements": 178,
    "totalPages": 18,
    "currentPage": 0
  }
}
```

---

### 1.6 `GET /residents/{id}` – Chi tiết cư dân

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 12,
    "fullName": "Trần Thị Bình",
    "email": "binh@example.com",
    "phone": "0909123456",
    "idCard": "079123456789",
    "dateOfBirth": "1990-05-15",
    "avatarUrl": "https://...",
    "apartment": {
      "id": 10,
      "apartmentNumber": "A1001",
      "floor": 10,
      "isPrimary": true,
      "moveInDate": "2024-03-01"
    },
    "vehicles": [{ "id": 3, "licensePlate": "51A-123.45", "vehicleType": "MOTORBIKE", "status": "ACTIVE" }],
    "serviceRegistrations": [
      { "id": 5, "serviceName": "Thẻ Gym Tháng", "status": "ACTIVE", "startDate": "2025-01-01" }
    ],
    "billSummary": {
      "totalBills": 6,
      "paidBills": 5,
      "pendingBills": 1,
      "outstandingAmount": 2800000
    },
    "recentRequests": [
      {
        "id": 8,
        "title": "Sửa vòi nước",
        "status": "RESOLVED",
        "createdAt": "2025-06-10T08:00:00Z"
      }
    ]
  }
}
```

**Errors:** `404` – `RESIDENT_NOT_FOUND` | `403` – Cư dân không thuộc tòa nhà mình

---

## 🧾 2. Bills API

### 2.1 `GET /bills` – Danh sách hóa đơn

**Query params:**

| Param                  | Type    | Mô tả                                                           |
| ---------------------- | ------- | --------------------------------------------------------------- |
| `apartmentId`          | long    | Lọc theo căn hộ                                                 |
| `billingMonth`         | string  | Lọc theo tháng (`YYYY-MM`)                                      |
| `status`               | string  | `PENDING` / `PARTIALLY_PAID` / `PAID` / `OVERDUE` / `CANCELLED` |
| `overdueOnly`          | boolean | Chỉ lấy hóa đơn quá hạn                                         |
| `search`               | string  | Tìm theo số căn hộ hoặc tên cư dân                              |
| `page`, `size`, `sort` |         | Phân trang                                                      |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBills": 120,
      "paidCount": 95,
      "pendingCount": 18,
      "overdueCount": 7,
      "totalAmount": 336000000,
      "collectedAmount": 266000000
    },
    "content": [
      {
        "id": 101,
        "apartmentNumber": "A1001",
        "residentName": "Trần Thị Bình",
        "billingMonth": "2025-06",
        "totalAmount": 2800000,
        "paidAmount": 0,
        "status": "PENDING",
        "dueDate": "2025-07-15",
        "createdAt": "2025-06-01T08:00:00Z"
      }
    ],
    "totalElements": 120,
    "totalPages": 12,
    "currentPage": 0
  }
}
```

---

### 2.2 `GET /bills/{id}` – Chi tiết hóa đơn

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 101,
    "apartmentId": 10,
    "apartmentNumber": "A1001",
    "residentName": "Trần Thị Bình",
    "billingMonth": "2025-06",
    "totalAmount": 2800000,
    "paidAmount": 0,
    "status": "PENDING",
    "dueDate": "2025-07-15",
    "notes": "",
    "items": [
      {
        "id": 201,
        "feeType": "ELECTRICITY",
        "description": "Điện tháng 6: 150 kWh × 3.500đ",
        "readingStart": 1200.0,
        "readingEnd": 1350.0,
        "quantity": 150.0,
        "unitPrice": 3500.0,
        "amount": 525000.0
      },
      {
        "id": 202,
        "feeType": "WATER",
        "description": "Nước tháng 6: 12 m³ × 15.000đ",
        "readingStart": 85.0,
        "readingEnd": 97.0,
        "quantity": 12.0,
        "unitPrice": 15000.0,
        "amount": 180000.0
      },
      {
        "id": 203,
        "feeType": "MANAGEMENT",
        "description": "Phí quản lý tháng 6",
        "quantity": 1.0,
        "unitPrice": 500000.0,
        "amount": 500000.0
      },
      {
        "id": 204,
        "feeType": "PARKING_MOTORBIKE",
        "description": "Phí xe máy tháng 6 (1 xe)",
        "quantity": 1.0,
        "unitPrice": 150000.0,
        "amount": 150000.0
      },
      {
        "id": 205,
        "feeType": "GARBAGE",
        "description": "Phí rác tháng 6",
        "quantity": 1.0,
        "unitPrice": 50000.0,
        "amount": 50000.0
      }
    ],
    "payments": [
      {
        "id": 301,
        "amount": 1000000,
        "paymentMethod": "VNPAY",
        "status": "SUCCESS",
        "paidAt": "2025-06-20T10:15:00Z"
      }
    ],
    "createdBy": "Nguyễn Văn Manager",
    "createdAt": "2025-06-01T08:00:00Z"
  }
}
```

---

### 2.3 `POST /bills` – Tạo hóa đơn tháng (1 căn hộ)

**Request body:**

```json
{
  "apartmentId": 10,
  "billingMonth": "2025-07",
  "dueDate": "2025-08-15",
  "notes": "Hóa đơn tháng 7/2025",
  "items": [
    {
      "feeType": "ELECTRICITY",
      "readingStart": 1350.0,
      "readingEnd": 1510.0
    },
    {
      "feeType": "WATER",
      "readingStart": 97.0,
      "readingEnd": 110.0
    },
    {
      "feeType": "MANAGEMENT"
    },
    {
      "feeType": "PARKING_MOTORBIKE"
    },
    {
      "feeType": "GARBAGE"
    }
  ]
}
```

**Business logic:**

- Với mỗi `feeType`, hệ thống tự tra `fee_configs` (`effective_to IS NULL`) để lấy `unit_price` → snapshot vào `bill_items`.
- Với ELECTRICITY/WATER: `amount = (readingEnd - readingStart) × unit_price`.
- Với phí cố định (MANAGEMENT, GARBAGE…): `quantity = 1`, `amount = unit_price`.
- Với PARKING: `quantity = số xe ACTIVE của căn hộ`.
- Sau khi tạo → gửi `notification` đến cư dân chủ hộ.

**Validation:**

| Field                | Rule                                                       |
| -------------------- | ---------------------------------------------------------- |
| `apartmentId`        | Căn hộ phải đang `OCCUPIED` và thuộc tòa nhà mình          |
| `billingMonth`       | Chưa có hóa đơn tháng này cho căn hộ (`UNIQUE` constraint) |
| `dueDate`            | Phải sau ngày hiện tại                                     |
| `items[].readingEnd` | Phải ≥ `readingStart` với ELECTRICITY/WATER                |

**Response `201 Created`:** Trả về object bill vừa tạo (như `GET /bills/{id}`).

**Errors:**

- `409` – `BILL_ALREADY_EXISTS` – Hóa đơn tháng này đã tồn tại
- `404` – `FEE_CONFIG_NOT_FOUND` – Chưa cấu hình giá cho loại phí này
- `409` – `APARTMENT_NOT_OCCUPIED` – Căn hộ không có cư dân

---

### 2.4 `POST /bills/bulk` – Tạo hóa đơn hàng loạt

> Tạo hóa đơn cho nhiều căn hộ cùng lúc. Dùng khi lập hóa đơn đầu tháng toàn tòa nhà.

**Request body:**

```json
{
  "billingMonth": "2025-07",
  "dueDate": "2025-08-15",
  "apartmentBills": [
    {
      "apartmentId": 10,
      "items": [
        { "feeType": "ELECTRICITY", "readingStart": 1350.0, "readingEnd": 1510.0 },
        { "feeType": "WATER", "readingStart": 97.0, "readingEnd": 110.0 },
        { "feeType": "MANAGEMENT" },
        { "feeType": "PARKING_MOTORBIKE" },
        { "feeType": "GARBAGE" }
      ]
    },
    {
      "apartmentId": 11,
      "items": [
        { "feeType": "ELECTRICITY", "readingStart": 800.0, "readingEnd": 920.0 },
        { "feeType": "WATER", "readingStart": 40.0, "readingEnd": 51.0 },
        { "feeType": "MANAGEMENT" },
        { "feeType": "GARBAGE" }
      ]
    }
  ]
}
```

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "totalRequested": 120,
    "created": 115,
    "skipped": 5,
    "skippedReasons": [
      { "apartmentId": 15, "apartmentNumber": "A1502", "reason": "BILL_ALREADY_EXISTS" },
      { "apartmentId": 30, "apartmentNumber": "B301", "reason": "APARTMENT_NOT_OCCUPIED" }
    ]
  }
}
```

---

### 2.5 `PATCH /bills/{id}/cancel` – Huỷ hóa đơn

**Request body:**

```json
{
  "reason": "Nhập sai chỉ số điện, sẽ tạo lại hóa đơn đúng"
}
```

**Business logic:** Set `bills.status → CANCELLED`. Gửi notification đến cư dân.

**Errors:**

- `409` – `BILL_ALREADY_PAID` – Hóa đơn đã thanh toán một phần hoặc toàn bộ
- `409` – `BILL_ALREADY_CANCELLED`

---

## 🔧 3. Service Requests API

### 3.1 `GET /service-requests` – Danh sách yêu cầu

**Query params:**

| Param                  | Type    | Mô tả                                                                       |
| ---------------------- | ------- | --------------------------------------------------------------------------- |
| `status`               | string  | `PENDING` / `ASSIGNED` / `IN_PROGRESS` / `RESOLVED` / `CLOSED` / `REJECTED` |
| `requestType`          | string  | `MAINTENANCE` / `COMPLAINT` / `INQUIRY` / `OTHER`                           |
| `priority`             | string  | `LOW` / `MEDIUM` / `HIGH` / `URGENT`                                        |
| `assignedToMe`         | boolean | Chỉ lấy yêu cầu được phân công cho mình                                     |
| `apartmentId`          | long    | Lọc theo căn hộ                                                             |
| `search`               | string  | Tìm theo tiêu đề                                                            |
| `page`, `size`, `sort` |         | Phân trang                                                                  |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "pendingCount": 12,
      "inProgressCount": 5,
      "resolvedTodayCount": 3
    },
    "content": [
      {
        "id": 8,
        "apartmentNumber": "A1001",
        "residentName": "Trần Thị Bình",
        "requestType": "MAINTENANCE",
        "title": "Sửa vòi nước bị rò rỉ",
        "priority": "HIGH",
        "status": "PENDING",
        "attachmentCount": 2,
        "createdAt": "2025-06-15T09:00:00Z"
      }
    ],
    "totalElements": 45,
    "totalPages": 5
  }
}
```

---

### 3.2 `GET /service-requests/{id}` – Chi tiết yêu cầu

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 8,
    "apartmentId": 10,
    "apartmentNumber": "A1001",
    "resident": {
      "id": 12,
      "fullName": "Trần Thị Bình",
      "phone": "0909123456"
    },
    "requestType": "MAINTENANCE",
    "title": "Sửa vòi nước bị rò rỉ",
    "description": "Vòi nước trong phòng tắm bị rò rỉ liên tục từ hôm qua, nước chảy ra sàn.",
    "attachmentUrls": ["https://storage/req8_photo1.jpg", "https://storage/req8_photo2.jpg"],
    "priority": "HIGH",
    "status": "ASSIGNED",
    "assignedTo": {
      "id": 5,
      "fullName": "Nguyễn Văn Manager"
    },
    "assignedAt": "2025-06-15T10:30:00Z",
    "resolvedAt": null,
    "resolutionNotes": null,
    "rating": null,
    "createdAt": "2025-06-15T09:00:00Z",
    "updatedAt": "2025-06-15T10:30:00Z"
  }
}
```

---

### 3.3 `PATCH /service-requests/{id}/assign` – Tiếp nhận & phân công

**Request body:**

```json
{
  "assignedToId": 5,
  "notes": "Giao cho tổ kỹ thuật xử lý trong ngày hôm nay"
}
```

**Business logic:** Set `status → ASSIGNED`, ghi `assigned_to`, `assigned_at`. Gửi notification đến cư dân: "Yêu cầu của bạn đã được tiếp nhận".

**Validation:** `assignedToId` phải là user thuộc hệ thống (Manager hoặc nhân viên kỹ thuật). Yêu cầu phải đang `PENDING`.

**Errors:** `409` – `REQUEST_NOT_PENDING`

---

### 3.4 `PATCH /service-requests/{id}/status` – Cập nhật trạng thái xử lý

**Request body:**

```json
{
  "status": "RESOLVED",
  "resolutionNotes": "Đã thay mới vòi nước, kiểm tra không còn rò rỉ. Hoàn thành lúc 15:30 ngày 16/6."
}
```

**Validation:** Chỉ cho phép chuyển trạng thái theo luồng hợp lệ:

- `ASSIGNED` → `IN_PROGRESS`
- `IN_PROGRESS` → `RESOLVED`

**Business logic:** Khi `status → RESOLVED` → gửi notification đến cư dân: "Yêu cầu của bạn đã được giải quyết. Vui lòng đánh giá."

**Errors:** `409` – `INVALID_STATUS_TRANSITION`

---

### 3.5 `PATCH /service-requests/{id}/close` – Đóng / từ chối yêu cầu

**Request body:**

```json
{
  "action": "REJECT",
  "reason": "Yêu cầu không thuộc phạm vi bảo trì của tòa nhà. Vui lòng liên hệ dịch vụ sửa chữa ngoài."
}
```

**Validation:** `action` phải là `CLOSE` hoặc `REJECT`. Chỉ đóng được yêu cầu ở trạng thái `RESOLVED`. Chỉ từ chối được yêu cầu ở trạng thái `PENDING`.

---

## 🚗 4. Vehicles API

### 4.1 `GET /vehicles` – Danh sách xe

**Query params:**

| Param          | Type   | Mô tả                                                   |
| -------------- | ------ | ------------------------------------------------------- |
| `status`       | string | `PENDING_APPROVAL` / `ACTIVE` / `INACTIVE` / `REJECTED` |
| `vehicleType`  | string | `MOTORBIKE` / `CAR` / `BICYCLE`                         |
| `apartmentId`  | long   | Lọc theo căn hộ                                         |
| `search`       | string | Tìm theo biển số, tên chủ xe                            |
| `page`, `size` |        | Phân trang                                              |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "pendingCount": 7,
    "content": [
      {
        "id": 3,
        "owner": {
          "id": 12,
          "fullName": "Trần Thị Bình",
          "phone": "0909123456"
        },
        "apartmentNumber": "A1001",
        "vehicleType": "MOTORBIKE",
        "licensePlate": "51A-123.45",
        "brand": "Honda",
        "model": "Wave Alpha",
        "color": "Đỏ",
        "status": "PENDING_APPROVAL",
        "registeredAt": "2025-06-20T14:00:00Z"
      }
    ],
    "totalElements": 25,
    "totalPages": 3
  }
}
```

---

### 4.2 `PATCH /vehicles/{id}/approve` – Duyệt đăng ký xe

**Request body:**

```json
{
  "notes": "Đã kiểm tra, xe hợp lệ. Cấp thẻ từ ngày 01/07/2025.",
  "expiredAt": "2026-06-30"
}
```

**Business logic:** Set `status → ACTIVE`, ghi `approved_by`, `approved_at`. Gửi notification đến cư dân: "Đăng ký xe biển số 51A-123.45 đã được duyệt."

**Errors:** `409` – `VEHICLE_NOT_PENDING`

---

### 4.3 `PATCH /vehicles/{id}/reject` – Từ chối đăng ký xe

**Request body:**

```json
{
  "rejectionReason": "Biển số xe không khớp với giấy tờ. Vui lòng đăng ký lại với thông tin chính xác."
}
```

**Validation:** `rejectionReason` bắt buộc khi từ chối.

---

## 🛎️ 5. Service Registrations API

### 5.1 `GET /service-registrations` – Danh sách đăng ký dịch vụ

**Query params:** `status`, `serviceTypeId`, `apartmentId`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "pendingCount": 3,
    "content": [
      {
        "id": 5,
        "resident": {
          "id": 12,
          "fullName": "Trần Thị Bình",
          "phone": "0909123456"
        },
        "apartmentNumber": "A1001",
        "serviceType": {
          "id": 1,
          "name": "Thẻ Gym Tháng",
          "monthlyFee": 300000
        },
        "status": "PENDING",
        "registeredAt": "2025-06-22T10:00:00Z"
      }
    ],
    "totalElements": 18,
    "totalPages": 2
  }
}
```

---

### 5.2 `PATCH /service-registrations/{id}/approve` – Duyệt đăng ký dịch vụ

**Request body:**

```json
{
  "startDate": "2025-07-01",
  "endDate": "2025-07-31",
  "notes": "Thẻ gym cấp từ 01/07 - 31/07"
}
```

**Business logic:** Set `status → ACTIVE`. Gửi notification đến cư dân.

---

### 5.3 `PATCH /service-registrations/{id}/reject` – Từ chối đăng ký dịch vụ

**Request body:**

```json
{
  "reason": "Phòng gym đang bảo trì đến hết tháng 7. Vui lòng đăng ký lại vào tháng 8."
}
```

---

## 📢 6. Announcements API

### 6.1 `GET /announcements` – Danh sách thông báo đã tạo

**Query params:** `isPublished` (boolean), `priority`, `search`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 10,
        "title": "Lịch cắt nước định kỳ tháng 7",
        "priority": "IMPORTANT",
        "isPublished": true,
        "publishedAt": "2025-06-25T09:00:00Z",
        "expiresAt": "2025-07-10T23:59:59Z",
        "viewCount": 85
      }
    ],
    "totalElements": 12,
    "totalPages": 2
  }
}
```

---

### 6.2 `POST /announcements` – Tạo thông báo mới

**Request body:**

```json
{
  "title": "Lịch cắt nước định kỳ tháng 7",
  "content": "Thông báo đến toàn thể cư dân: Tòa nhà sẽ cắt nước để bảo trì hệ thống cấp nước vào ngày 05/07/2025 từ 08:00 đến 17:00. Đề nghị cư dân chủ động dự trữ nước sử dụng.",
  "priority": "IMPORTANT",
  "attachmentUrls": [],
  "expiresAt": "2025-07-06T00:00:00Z"
}
```

**Validation:**

| Field       | Rule                                    |
| ----------- | --------------------------------------- |
| `title`     | NotBlank, max 200 ký tự                 |
| `content`   | NotBlank                                |
| `priority`  | `NORMAL` / `IMPORTANT` / `URGENT`       |
| `expiresAt` | Optional, nếu có phải là ngày tương lai |

**Business logic:** `building_id` tự động lấy từ tòa nhà Manager đang phụ trách. `sender_id` = ID của Manager đang đăng nhập.

**Response `201 Created`:** Trả về object announcement vừa tạo.

---

### 6.3 `PUT /announcements/{id}` – Cập nhật thông báo

**Request body:** Tương tự POST.

**Errors:** `403` – Chỉ được sửa thông báo do mình tạo.

---

### 6.4 `PATCH /announcements/{id}/toggle-publish` – Ẩn / hiện thông báo

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "isPublished": false,
    "message": "Announcement hidden successfully"
  }
}
```

---

## 📊 7. Dashboard API

### 7.1 `GET /dashboard` – Tổng quan tòa nhà

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "building": {
      "id": 1,
      "name": "Sunrise Tower"
    },
    "apartments": {
      "total": 120,
      "occupied": 105,
      "available": 12,
      "maintenance": 3,
      "occupancyRate": 87.5
    },
    "billing": {
      "currentMonth": "2025-06",
      "totalBilled": 294000000,
      "totalCollected": 252000000,
      "collectionRate": 85.7,
      "pendingCount": 18,
      "overdueCount": 7,
      "overdueAmount": 19600000
    },
    "requests": {
      "pendingCount": 12,
      "inProgressCount": 5,
      "resolvedThisWeek": 8
    },
    "pendingApprovals": {
      "vehicleCount": 7,
      "serviceRegistrationCount": 3
    },
    "recentActivity": [
      {
        "type": "NEW_REQUEST",
        "message": "Cư dân A1001 gửi yêu cầu sửa chữa mới",
        "time": "2025-06-25T14:30:00Z"
      },
      {
        "type": "PAYMENT",
        "message": "Cư dân B205 thanh toán hóa đơn tháng 6",
        "time": "2025-06-25T11:00:00Z"
      }
    ]
  }
}
```

---

# 🏠 PHẦN III – MODULE CƯ DÂN (Resident)

> **Base URL:** `/api/v1/resident`  
> **Yêu cầu role:** `ROLE_RESIDENT`  
> **Phạm vi dữ liệu:** Cư dân chỉ thấy dữ liệu của chính mình (hóa đơn căn hộ mình đang ở, xe của mình, yêu cầu mình tạo…). Mọi truy cập dữ liệu người khác đều trả `403 Forbidden`.

## 📋 Danh sách tổng quan – Resident

| #                            | Method | Endpoint                      | Mô tả                               | UC   |
| ---------------------------- | ------ | ----------------------------- | ----------------------------------- | ---- |
| **👤 PROFILE & APARTMENT**   |        |                               |                                     |      |
| 1                            | GET    | `/me`                         | Xem thông tin hồ sơ cá nhân         | UC59 |
| 2                            | PUT    | `/me`                         | Cập nhật hồ sơ cá nhân              | UC60 |
| 3                            | PATCH  | `/me/change-password`         | Đổi mật khẩu                        | UC03 |
| 4                            | GET    | `/me/apartment`               | Xem thông tin căn hộ đang ở         | UC58 |
| **🧾 BILLS**                 |        |                               |                                     |      |
| 5                            | GET    | `/bills`                      | Danh sách hóa đơn của căn hộ mình   | UC61 |
| 6                            | GET    | `/bills/{id}`                 | Chi tiết hóa đơn                    | UC62 |
| **💳 PAYMENTS**              |        |                               |                                     |      |
| 7                            | POST   | `/payments`                   | Thanh toán hóa đơn                  | UC63 |
| 8                            | GET    | `/payments`                   | Lịch sử thanh toán của mình         | UC64 |
| 9                            | GET    | `/payments/{id}`              | Chi tiết 1 giao dịch thanh toán     | UC64 |
| **🚗 VEHICLES**              |        |                               |                                     |      |
| 10                           | GET    | `/vehicles`                   | Danh sách xe của mình               | UC65 |
| 11                           | POST   | `/vehicles`                   | Đăng ký xe mới                      | UC66 |
| 12                           | DELETE | `/vehicles/{id}`              | Huỷ đăng ký xe                      | UC67 |
| **🛎️ SERVICE REGISTRATIONS** |        |                               |                                     |      |
| 13                           | GET    | `/service-types`              | Danh sách dịch vụ có thể đăng ký    | UC68 |
| 14                           | GET    | `/service-registrations`      | Danh sách dịch vụ đang / đã đăng ký | UC68 |
| 15                           | POST   | `/service-registrations`      | Đăng ký dịch vụ mới                 | UC69 |
| 16                           | DELETE | `/service-registrations/{id}` | Huỷ đăng ký dịch vụ                 | UC70 |
| **📝 SERVICE REQUESTS**      |        |                               |                                     |      |
| 17                           | GET    | `/service-requests`           | Danh sách yêu cầu / phản ánh đã gửi | UC72 |
| 18                           | GET    | `/service-requests/{id}`      | Chi tiết yêu cầu                    | UC72 |
| 19                           | POST   | `/service-requests`           | Gửi yêu cầu / phản ánh mới          | UC71 |
| 20                           | PATCH  | `/service-requests/{id}/rate` | Đánh giá kết quả xử lý              | UC73 |
| **🔔 NOTIFICATIONS**         |        |                               |                                     |      |
| 21                           | GET    | `/notifications`              | Danh sách thông báo cá nhân         | UC74 |
| 22                           | PATCH  | `/notifications/{id}/read`    | Đánh dấu 1 thông báo đã đọc         | UC75 |
| 23                           | PATCH  | `/notifications/read-all`     | Đánh dấu tất cả đã đọc              | UC75 |
| 24                           | GET    | `/announcements`              | Xem thông báo chung từ BQL          | UC74 |

---

## 👤 1. Profile & Apartment API

### 1.1 `GET /me` – Hồ sơ cá nhân

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 12,
    "fullName": "Trần Thị Bình",
    "email": "binh@example.com",
    "phone": "0909123456",
    "idCard": "079123456789",
    "dateOfBirth": "1990-05-15",
    "avatarUrl": "https://...",
    "roles": ["ROLE_RESIDENT"],
    "currentApartment": {
      "id": 10,
      "apartmentNumber": "A1001",
      "floor": 10,
      "buildingName": "Sunrise Tower",
      "isPrimary": true,
      "moveInDate": "2024-03-01"
    },
    "unreadNotificationCount": 3,
    "createdAt": "2024-03-01T00:00:00Z"
  }
}
```

---

### 1.2 `PUT /me` – Cập nhật hồ sơ

**Request body:**

```json
{
  "fullName": "Trần Thị Bình",
  "phone": "0909999888",
  "dateOfBirth": "1990-05-15",
  "avatarUrl": "https://storage/avatars/user12.jpg"
}
```

**Validation:**

| Field         | Rule                                 |
| ------------- | ------------------------------------ |
| `fullName`    | NotBlank, max 100 ký tự              |
| `phone`       | Unique trong hệ thống (nếu thay đổi) |
| `dateOfBirth` | Không được là ngày tương lai         |

> Email và CCCD không cho tự sửa – liên hệ Admin.

**Errors:** `409` – `PHONE_ALREADY_EXISTS`

---

### 1.3 `PATCH /me/change-password` – Đổi mật khẩu

**Request body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePass456",
  "confirmPassword": "newSecurePass456"
}
```

**Validation:** `newPassword` ≥ 8 ký tự, khác `currentPassword`. `confirmPassword` phải khớp `newPassword`.

**Errors:**

- `400` – `WRONG_CURRENT_PASSWORD`
- `400` – `PASSWORDS_DO_NOT_MATCH`
- `400` – `NEW_PASSWORD_SAME_AS_OLD`

---

### 1.4 `GET /me/apartment` – Thông tin căn hộ đang ở

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "apartmentNumber": "A1001",
    "floor": 10,
    "areaM2": 75.5,
    "numBedrooms": 2,
    "numBathrooms": 2,
    "direction": "Đông Nam",
    "building": {
      "id": 1,
      "name": "Sunrise Tower",
      "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
      "managerName": "Nguyễn Văn Manager",
      "managerPhone": "0901234567"
    },
    "householdMembers": [
      {
        "id": 12,
        "fullName": "Trần Thị Bình",
        "isPrimary": true,
        "moveInDate": "2024-03-01"
      },
      {
        "id": 13,
        "fullName": "Trần Văn Chồng",
        "isPrimary": false,
        "moveInDate": "2024-03-01"
      }
    ],
    "moveInDate": "2024-03-01"
  }
}
```

**Errors:** `404` – `NO_ACTIVE_APARTMENT` – Cư dân chưa được gán vào căn hộ nào

---

## 🧾 2. Bills API

### 2.1 `GET /bills` – Danh sách hóa đơn

**Query params:**

| Param          | Type   | Mô tả                                                           |
| -------------- | ------ | --------------------------------------------------------------- |
| `status`       | string | `PENDING` / `PARTIALLY_PAID` / `PAID` / `OVERDUE` / `CANCELLED` |
| `year`         | int    | Lọc theo năm                                                    |
| `page`, `size` |        | Phân trang                                                      |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalOutstanding": 5600000,
      "overdueCount": 1
    },
    "content": [
      {
        "id": 101,
        "billingMonth": "2025-06",
        "totalAmount": 2800000,
        "paidAmount": 0,
        "remainingAmount": 2800000,
        "status": "PENDING",
        "dueDate": "2025-07-15",
        "isOverdue": false
      },
      {
        "id": 89,
        "billingMonth": "2025-05",
        "totalAmount": 2750000,
        "paidAmount": 2750000,
        "remainingAmount": 0,
        "status": "PAID",
        "dueDate": "2025-06-15",
        "isOverdue": false
      }
    ],
    "totalElements": 6,
    "totalPages": 1
  }
}
```

---

### 2.2 `GET /bills/{id}` – Chi tiết hóa đơn

**Response `200 OK`:** _(Tương tự Manager nhưng không có `payments` history của người khác – chỉ hiện payments của chính cư dân này)_

```json
{
  "success": true,
  "data": {
    "id": 101,
    "billingMonth": "2025-06",
    "totalAmount": 2800000,
    "paidAmount": 0,
    "remainingAmount": 2800000,
    "status": "PENDING",
    "dueDate": "2025-07-15",
    "items": [
      {
        "feeType": "ELECTRICITY",
        "description": "Điện tháng 6: 150 kWh × 3.500đ",
        "readingStart": 1200.0,
        "readingEnd": 1350.0,
        "quantity": 150.0,
        "unitPrice": 3500.0,
        "amount": 525000.0
      },
      {
        "feeType": "WATER",
        "description": "Nước tháng 6: 12 m³ × 15.000đ",
        "quantity": 12.0,
        "unitPrice": 15000.0,
        "amount": 180000.0
      },
      {
        "feeType": "MANAGEMENT",
        "description": "Phí quản lý tháng 6",
        "quantity": 1.0,
        "unitPrice": 500000.0,
        "amount": 500000.0
      }
    ],
    "myPayments": [
      {
        "id": 301,
        "amount": 1000000,
        "paymentMethod": "VNPAY",
        "status": "SUCCESS",
        "paidAt": "2025-06-20T10:15:00Z"
      }
    ]
  }
}
```

**Errors:** `403` – Hóa đơn không thuộc căn hộ mình | `404` – `BILL_NOT_FOUND`

---

## 💳 3. Payments API

### 3.1 `POST /payments` – Thanh toán hóa đơn

**Request body:**

```json
{
  "billId": 101,
  "amount": 2800000,
  "paymentMethod": "VNPAY",
  "paymentNote": "Thanh toán toàn bộ hóa đơn tháng 6"
}
```

**Validation:**

| Field           | Rule                                                                      |
| --------------- | ------------------------------------------------------------------------- |
| `billId`        | Hóa đơn phải thuộc căn hộ mình, status không phải `PAID` hoặc `CANCELLED` |
| `amount`        | Phải > 0 và ≤ `remainingAmount` của hóa đơn                               |
| `paymentMethod` | `CASH` / `VNPAY` / `MOMO` / `BANK_TRANSFER`                               |

**Business logic:**

- Tạo record `payments` với `status = PENDING`.
- Với VNPAY/MoMo: trả về `paymentUrl` để redirect sang cổng thanh toán.
- Với CASH/BANK_TRANSFER: tạo payment `status = SUCCESS` ngay (mock).
- Sau khi `SUCCESS`: cộng vào `bills.paid_amount`. Nếu `paid_amount >= total_amount` → `bills.status = PAID`. Nếu `paid_amount > 0` và `< total_amount` → `PARTIALLY_PAID`.
- Gửi email xác nhận + notification đến cư dân.

**Response `201 Created`:**

```json
{
  "success": true,
  "data": {
    "paymentId": 310,
    "billId": 101,
    "amount": 2800000,
    "paymentMethod": "VNPAY",
    "status": "PENDING",
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/Transaction/Pay?vnp_TxnRef=310&...",
    "expiredAt": "2025-06-25T15:45:00Z"
  }
}
```

**Errors:**

- `404` – `BILL_NOT_FOUND`
- `403` – `BILL_NOT_YOURS`
- `409` – `BILL_ALREADY_PAID`
- `400` – `AMOUNT_EXCEEDS_REMAINING`

---

### 3.2 `GET /payments` – Lịch sử thanh toán

**Query params:** `billId` (optional), `status`, `paymentMethod`, `from` (`YYYY-MM-DD`), `to`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 301,
        "bill": {
          "id": 89,
          "billingMonth": "2025-05",
          "totalAmount": 2750000
        },
        "amount": 2750000,
        "paymentMethod": "VNPAY",
        "transactionRef": "VNP20250520091234",
        "status": "SUCCESS",
        "paidAt": "2025-05-20T09:12:34Z"
      }
    ],
    "totalElements": 8,
    "totalPages": 1
  }
}
```

---

### 3.3 `GET /payments/{id}` – Chi tiết giao dịch

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 301,
    "bill": {
      "id": 89,
      "billingMonth": "2025-05",
      "apartmentNumber": "A1001"
    },
    "amount": 2750000,
    "paymentMethod": "VNPAY",
    "transactionRef": "VNP20250520091234",
    "status": "SUCCESS",
    "paymentNote": "",
    "paidAt": "2025-05-20T09:12:34Z",
    "createdAt": "2025-05-20T09:10:00Z"
  }
}
```

---

## 🚗 4. Vehicles API

### 4.1 `GET /vehicles` – Danh sách xe của mình

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "vehicleType": "MOTORBIKE",
      "licensePlate": "51A-123.45",
      "brand": "Honda",
      "model": "Wave Alpha",
      "color": "Đỏ",
      "status": "ACTIVE",
      "registeredAt": "2024-03-05T10:00:00Z",
      "approvedAt": "2024-03-06T09:00:00Z",
      "expiredAt": "2025-03-31"
    }
  ]
}
```

---

### 4.2 `POST /vehicles` – Đăng ký xe mới

**Request body:**

```json
{
  "vehicleType": "CAR",
  "licensePlate": "51F-999.88",
  "brand": "Toyota",
  "model": "Vios 2023",
  "color": "Trắng"
}
```

**Validation:**

| Field                     | Rule                                 |
| ------------------------- | ------------------------------------ |
| `vehicleType`             | `MOTORBIKE` / `CAR` / `BICYCLE`      |
| `licensePlate`            | NotBlank, unique trong toàn hệ thống |
| `brand`, `model`, `color` | Optional, max 50 ký tự               |

**Business logic:**

- `apartment_id` tự lấy từ căn hộ cư dân đang ở.
- Tạo vehicle với `status = PENDING_APPROVAL`.
- Gửi notification đến BQL: "Cư dân A1001 đăng ký xe mới chờ duyệt."

**Errors:**

- `409` – `LICENSE_PLATE_EXISTS`
- `404` – `NO_ACTIVE_APARTMENT` – Cư dân chưa có căn hộ

---

### 4.3 `DELETE /vehicles/{id}` – Huỷ đăng ký xe

**Business logic:** Set `status → INACTIVE`. Không xóa thật.

**Errors:**

- `403` – Xe không phải của mình
- `409` – `VEHICLE_NOT_ACTIVE` – Chỉ huỷ được xe đang `ACTIVE`

---

## 🛎️ 5. Service Registrations API

### 5.1 `GET /service-types` – Danh sách dịch vụ có thể đăng ký

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thẻ Gym Tháng",
      "description": "Sử dụng phòng gym tầng 3 không giới hạn",
      "monthlyFee": 300000,
      "iconUrl": "https://...",
      "isRegistered": false,
      "myRegistration": null
    },
    {
      "id": 2,
      "name": "Hồ Bơi Tháng",
      "description": "Vé tháng hồ bơi tầng 5",
      "monthlyFee": 200000,
      "iconUrl": "https://...",
      "isRegistered": true,
      "myRegistration": {
        "id": 5,
        "status": "ACTIVE",
        "startDate": "2025-07-01",
        "endDate": "2025-07-31"
      }
    }
  ]
}
```

---

### 5.2 `GET /service-registrations` – Dịch vụ của mình

**Query params:** `status` (optional)

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "serviceType": {
        "id": 2,
        "name": "Hồ Bơi Tháng",
        "monthlyFee": 200000
      },
      "status": "ACTIVE",
      "registeredAt": "2025-06-25T10:00:00Z",
      "startDate": "2025-07-01",
      "endDate": "2025-07-31"
    }
  ]
}
```

---

### 5.3 `POST /service-registrations` – Đăng ký dịch vụ

**Request body:**

```json
{
  "serviceTypeId": 1,
  "notes": "Đăng ký sử dụng từ đầu tháng 7"
}
```

**Validation:** Chưa có đăng ký `ACTIVE` hoặc `PENDING` cho dịch vụ này. Dịch vụ phải đang `is_active = true`.

**Business logic:** Tạo `service_registrations` với `status = PENDING`. Gửi notification đến BQL.

**Errors:**

- `409` – `SERVICE_ALREADY_REGISTERED`
- `404` – `SERVICE_TYPE_NOT_FOUND` hoặc `SERVICE_TYPE_INACTIVE`

---

### 5.4 `DELETE /service-registrations/{id}` – Huỷ đăng ký dịch vụ

**Business logic:** Set `status → CANCELLED`. Gửi notification đến BQL.

**Errors:** `409` – `REGISTRATION_NOT_ACTIVE` – Chỉ huỷ được đăng ký đang `ACTIVE`

---

## 📝 6. Service Requests API

### 6.1 `GET /service-requests` – Danh sách yêu cầu đã gửi

**Query params:** `status`, `requestType`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 8,
        "requestType": "MAINTENANCE",
        "title": "Sửa vòi nước bị rò rỉ",
        "priority": "HIGH",
        "status": "RESOLVED",
        "rating": 5,
        "createdAt": "2025-06-15T09:00:00Z",
        "resolvedAt": "2025-06-16T15:30:00Z"
      },
      {
        "id": 12,
        "requestType": "COMPLAINT",
        "title": "Tiếng ồn từ căn hộ tầng trên",
        "priority": "MEDIUM",
        "status": "IN_PROGRESS",
        "rating": null,
        "createdAt": "2025-06-22T20:00:00Z",
        "resolvedAt": null
      }
    ],
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

### 6.2 `GET /service-requests/{id}` – Chi tiết yêu cầu

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 8,
    "requestType": "MAINTENANCE",
    "title": "Sửa vòi nước bị rò rỉ",
    "description": "Vòi nước trong phòng tắm bị rò rỉ liên tục từ hôm qua, nước chảy ra sàn.",
    "attachmentUrls": ["https://storage/req8_photo1.jpg"],
    "priority": "HIGH",
    "status": "RESOLVED",
    "assignedTo": {
      "fullName": "Nguyễn Văn Manager",
      "phone": "0901234567"
    },
    "resolutionNotes": "Đã thay mới vòi nước, kiểm tra không còn rò rỉ. Hoàn thành lúc 15:30 ngày 16/6.",
    "rating": 5,
    "createdAt": "2025-06-15T09:00:00Z",
    "assignedAt": "2025-06-15T10:30:00Z",
    "resolvedAt": "2025-06-16T15:30:00Z"
  }
}
```

---

### 6.3 `POST /service-requests` – Gửi yêu cầu mới

**Request body:**

```json
{
  "requestType": "MAINTENANCE",
  "title": "Điều hoà phòng ngủ không hoạt động",
  "description": "Điều hoà phòng ngủ lớn bật lên nhưng không ra gió lạnh, chỉ có gió thường. Đã thử tắt bật lại nhiều lần.",
  "priority": "MEDIUM",
  "attachmentUrls": ["https://storage/uploads/ac_photo1.jpg"]
}
```

**Validation:**

| Field            | Rule                                                     |
| ---------------- | -------------------------------------------------------- |
| `requestType`    | `MAINTENANCE` / `COMPLAINT` / `INQUIRY` / `OTHER`        |
| `title`          | NotBlank, max 200 ký tự                                  |
| `description`    | NotBlank                                                 |
| `priority`       | `LOW` / `MEDIUM` / `HIGH` / `URGENT` (default: `MEDIUM`) |
| `attachmentUrls` | Optional, tối đa 5 ảnh                                   |

**Business logic:**

- `user_id` và `apartment_id` tự lấy từ cư dân đang đăng nhập.
- Tạo request với `status = PENDING`.
- Gửi notification đến BQL tòa nhà.

**Response `201 Created`:** Trả về object service request vừa tạo.

**Errors:** `404` – `NO_ACTIVE_APARTMENT`

---

### 6.4 `PATCH /service-requests/{id}/rate` – Đánh giá kết quả xử lý

**Request body:**

```json
{
  "rating": 5,
  "comment": "Xử lý nhanh và chuyên nghiệp, cảm ơn anh kỹ thuật!"
}
```

**Validation:**

- `rating`: 1–5, bắt buộc.
- Yêu cầu phải ở trạng thái `RESOLVED`.
- Chưa đánh giá lần nào (`rating IS NULL`).

**Business logic:** Cập nhật `service_requests.rating`. Đây là đánh giá cuối cùng, không thể chỉnh sửa sau.

**Errors:**

- `409` – `REQUEST_NOT_RESOLVED`
- `409` – `ALREADY_RATED`
- `403` – Yêu cầu không phải của mình

---

## 🔔 7. Notifications API

### 7.1 `GET /notifications` – Danh sách thông báo cá nhân

**Query params:** `isRead` (boolean), `type`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "unreadCount": 3,
    "content": [
      {
        "id": 50,
        "title": "Hóa đơn tháng 6 đã được tạo",
        "content": "Hóa đơn tháng 6/2025 của căn hộ A1001 là 2.800.000đ. Hạn thanh toán: 15/07/2025.",
        "type": "BILL_CREATED",
        "referenceType": "bills",
        "referenceId": 101,
        "isRead": false,
        "createdAt": "2025-06-01T08:05:00Z"
      },
      {
        "id": 49,
        "title": "Thanh toán thành công",
        "content": "Bạn đã thanh toán 2.750.000đ cho hóa đơn tháng 5/2025.",
        "type": "PAYMENT_SUCCESS",
        "referenceType": "payments",
        "referenceId": 301,
        "isRead": true,
        "readAt": "2025-05-20T10:00:00Z",
        "createdAt": "2025-05-20T09:12:40Z"
      }
    ],
    "totalElements": 12,
    "totalPages": 2
  }
}
```

---

### 7.2 `PATCH /notifications/{id}/read` – Đánh dấu đã đọc

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": 50,
    "isRead": true,
    "readAt": "2025-06-25T15:00:00Z"
  }
}
```

**Errors:** `403` – Notification không phải của mình

---

### 7.3 `PATCH /notifications/read-all` – Đánh dấu tất cả đã đọc

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "message": "All notifications marked as read"
  }
}
```

---

### 7.4 `GET /announcements` – Thông báo chung từ BQL

**Query params:** `priority`, `page`, `size`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 10,
        "title": "Lịch cắt nước định kỳ tháng 7",
        "content": "Tòa nhà sẽ cắt nước để bảo trì hệ thống cấp nước vào ngày 05/07/2025 từ 08:00 đến 17:00...",
        "priority": "IMPORTANT",
        "senderName": "Ban Quản Lý Sunrise Tower",
        "publishedAt": "2025-06-25T09:00:00Z",
        "expiresAt": "2025-07-06T00:00:00Z",
        "attachmentUrls": []
      }
    ],
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

## ⚠️ HTTP Status Codes

| Code                        | Ý nghĩa                                          |
| --------------------------- | ------------------------------------------------ |
| `200 OK`                    | Thành công                                       |
| `201 Created`               | Tạo mới thành công                               |
| `400 Bad Request`           | Dữ liệu đầu vào không hợp lệ                     |
| `401 Unauthorized`          | Chưa đăng nhập hoặc token hết hạn                |
| `403 Forbidden`             | Không đủ quyền (đã login nhưng không phải Admin) |
| `404 Not Found`             | Resource không tồn tại                           |
| `409 Conflict`              | Vi phạm business rule (trùng dữ liệu, ràng buộc) |
| `500 Internal Server Error` | Lỗi server                                       |

---

## 📊 Tổng kết số lượng API

### Module Admin

| Nhóm                | Số API |
| ------------------- | ------ |
| Buildings           | 6      |
| Apartments          | 6      |
| Fee Configs         | 5      |
| User Management     | 8      |
| Service Types       | 4      |
| Reports & Dashboard | 5      |
| **Tổng**            | **34** |

### Module Ban Quản Lý

| Nhóm                   | Số API |
| ---------------------- | ------ |
| Apartments & Residents | 6      |
| Bills                  | 5      |
| Service Requests       | 5      |
| Vehicles               | 3      |
| Service Registrations  | 3      |
| Announcements          | 5      |
| Dashboard              | 1      |
| **Tổng**               | **28** |

### Module Cư Dân

| Nhóm                  | Số API |
| --------------------- | ------ |
| Profile & Apartment   | 4      |
| Bills                 | 2      |
| Payments              | 3      |
| Vehicles              | 3      |
| Service Registrations | 4      |
| Service Requests      | 4      |
| Notifications         | 4      |
| **Tổng**              | **24** |

### Toàn hệ thống

| Module            | Số API |
| ----------------- | ------ |
| Admin             | 34     |
| Ban Quản Lý       | 28     |
| Cư Dân            | 24     |
| Auth (dùng chung) | 4      |
| **Tổng**          | **90** |

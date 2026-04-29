# Apartment Management System - PTHTWeb

Hệ thống quản lý chung cư gồm backend Spring Boot và frontend React/Vite, hỗ trợ các nghiệp vụ quản trị tòa nhà, căn hộ, cư dân, hóa đơn, thanh toán, phương tiện, dịch vụ tiện ích, yêu cầu/phản ánh và thông báo.

## Mục lục

- [Tổng quan](#tổng-quan)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt và chạy project](#cài-đặt-và-chạy-project)
- [Chạy bằng Docker Compose](#chạy-bằng-docker-compose)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Tài khoản mặc định](#tài-khoản-mặc-định)
- [API và phân quyền](#api-và-phân-quyền)
- [Database](#database)
- [Kiểm thử, build và lint](#kiểm-thử-build-và-lint)
- [Tài liệu liên quan](#tài-liệu-liên-quan)
- [Ghi chú phát triển](#ghi-chú-phát-triển)

## Tổng quan

Project được chia thành 2 phần chính:

- `backend`: REST API dùng Spring Boot, Spring Security, JWT, JPA/Hibernate và PostgreSQL.
- `frontend`: giao diện quản trị và cư dân dùng React, TypeScript, Vite, Tailwind CSS và Axios.

Hệ thống có 3 nhóm người dùng chính:

| Vai trò | Mô tả |
| --- | --- |
| `ROLE_ADMIN` | Quản trị toàn hệ thống: tòa nhà, căn hộ, người dùng, cấu hình phí, dashboard. |
| `ROLE_MANAGER` | Ban quản lý tòa nhà: quản lý căn hộ/cư dân thuộc tòa phụ trách, thông báo, dashboard. |
| `ROLE_RESIDENT` | Cư dân: xem căn hộ, hóa đơn, thanh toán, đăng ký xe/dịch vụ, gửi yêu cầu, nhận thông báo. |

## Công nghệ sử dụng

### Backend

- Java 25
- Spring Boot 4.0.3
- Spring Web MVC
- Spring Data JPA / Hibernate
- Spring Security
- OAuth2 Client dependency
- JWT với `jjwt`
- PostgreSQL
- Lombok
- Springdoc OpenAPI UI
- Maven Wrapper

### Frontend

- React 19
- TypeScript 5.9
- Vite 8
- React Router DOM 7
- Axios
- React Hook Form
- Tailwind CSS 4
- ESLint

### Database

- PostgreSQL
- Hibernate `ddl-auto: update` để tự cập nhật schema trong môi trường phát triển.

## Tính năng chính

### Dùng chung

- Đăng nhập bằng email và mật khẩu.
- Xác thực JWT access token và refresh token.
- Lấy thông tin người dùng hiện tại.
- Đổi mật khẩu.
- Điều hướng giao diện theo vai trò.
- Route guard cho trang riêng của Admin, Manager và Resident.

### Admin

- Dashboard quản trị.
- Quản lý tòa nhà:
  - Xem danh sách và chi tiết tòa nhà.
  - Tạo, cập nhật, vô hiệu hóa tòa nhà.
  - Gán manager phụ trách tòa nhà.
- Quản lý căn hộ:
  - Xem danh sách, lọc, tìm kiếm căn hộ.
  - Tạo, cập nhật, xem chi tiết căn hộ.
  - Cập nhật trạng thái căn hộ.
- Quản lý người dùng:
  - Xem danh sách, chi tiết người dùng.
  - Tạo tài khoản Admin, Manager, Resident.
  - Cập nhật thông tin người dùng.
  - Khóa/mở tài khoản.
  - Reset mật khẩu.
  - Gán hoặc thu hồi vai trò.
- Cấu hình phí:
  - Quản lý đơn giá điện, nước, quản lý, gửi xe, internet, thang máy, rác.
  - Lưu lịch sử hiệu lực giá theo thời gian.
  - Xem bảng giá hiện tại theo tòa nhà.

### Manager

- Dashboard ban quản lý.
- Xem danh sách căn hộ thuộc tòa nhà được phân công.
- Xem chi tiết căn hộ, cư dân, lịch sử cư trú.
- Gán cư dân vào căn hộ.
- Ghi nhận cư dân chuyển đi.
- Xem danh sách và chi tiết cư dân.
- Quản lý thông báo:
  - Tạo thông báo.
  - Cập nhật thông báo.
  - Bật/tắt trạng thái phát hành.

Theo tài liệu nghiệp vụ, module Manager còn định hướng xử lý thêm các nghiệp vụ hóa đơn, yêu cầu/phản ánh, duyệt xe và duyệt đăng ký dịch vụ.

### Resident

- Dashboard cư dân.
- Xem hồ sơ cá nhân và cập nhật thông tin.
- Xem thông tin căn hộ đang ở và thành viên hộ gia đình.
- Xem danh sách và chi tiết hóa đơn.
- Xem lịch sử thanh toán.
- Đăng ký, xem và hủy đăng ký xe.
- Xem danh sách dịch vụ tiện ích.
- Đăng ký và hủy đăng ký dịch vụ.
- Gửi yêu cầu/phản ánh/sửa chữa.
- Theo dõi trạng thái yêu cầu.
- Đánh giá kết quả xử lý yêu cầu.
- Xem thông báo cá nhân và thông báo chung.
- Đánh dấu đã đọc từng thông báo hoặc tất cả thông báo.

## Cấu trúc thư mục

```text
PTHTWeb/
├── docker-compose.yml
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/apartmentmanagement/
│       │   │   ├── config/          # CORS, Security, audit, data seeder
│       │   │   ├── controller/      # REST controllers
│       │   │   ├── dto/             # Request/response DTOs
│       │   │   ├── entity/          # JPA entities
│       │   │   ├── enums/           # Enum nghiệp vụ
│       │   │   ├── exception/       # AppException, ErrorCode, handler
│       │   │   ├── repository/      # Spring Data repositories
│       │   │   ├── security/        # JWT filter, user details, security utils
│       │   │   └── service/         # Auth, admin, manager, resident services
│       │   └── resources/
│       │       └── application.yaml
│       └── test/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── src/
│       ├── components/              # Component dùng chung, layout, resident
│       ├── context/                 # AuthContext
│       ├── hooks/                   # Custom hooks
│       ├── pages/                   # Trang theo role
│       ├── routes/                  # Router và route guards
│       ├── services/                # Axios instance và API services
│       ├── types/                   # TypeScript types
│       └── utils/                   # Constants, formatters, storage, validators
├── docs/
│   ├── api-docs.md
│   ├── database-design.md
│   └── requirements.md
├── weekly-reports/
└── README.md
```

## Yêu cầu môi trường

Cần cài đặt trước:

- Java JDK 25 hoặc phiên bản tương thích với cấu hình `java.version` trong `backend/pom.xml`.
- Maven hoặc dùng Maven Wrapper có sẵn trong project.
- Node.js và npm.
- PostgreSQL.
- Git.

Nếu chạy bằng Docker Compose, chỉ cần cài:

- Docker Desktop hoặc Docker Engine.
- Docker Compose v2.

Khuyến nghị:

- Dùng IntelliJ IDEA hoặc VS Code.
- Mở workspace bằng file `ApartmentManagement.code-workspace` nếu dùng VS Code.

## Cài đặt và chạy project

Có 2 cách chạy project:

- Docker Compose: phù hợp khi muốn dựng nhanh cả PostgreSQL, backend và frontend.
- Chạy thủ công: phù hợp khi cần debug backend/frontend trực tiếp trên máy local.

## Chạy bằng Docker Compose

File Compose nằm ở root project:

```text
docker-compose.yml
```

Compose tạo 3 service:

| Service | Image | Port | Mô tả |
| --- | --- | --- | --- |
| `postgres` | `postgres:16-alpine` | `5432` | Database PostgreSQL, database mặc định `apartment_db`. |
| `backend` | `maven:3.9.11-eclipse-temurin-25` | `8080` | Spring Boot API, kết nối đến service `postgres`. |
| `frontend` | `node:24-alpine` | `3000` | React/Vite dev server. |

Chạy toàn bộ hệ thống:

```bash
docker compose up
```

Chạy nền:

```bash
docker compose up -d
```

Sau khi các container chạy xong:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
Database: localhost:5432
```

Xem log:

```bash
docker compose logs -f
```

Xem log riêng backend:

```bash
docker compose logs -f backend
```

Dừng container:

```bash
docker compose down
```

Dừng và xóa luôn volume database/cache:

```bash
docker compose down -v
```

Lưu ý:

- Lần chạy đầu có thể mất vài phút vì container backend tải Maven dependencies và container frontend chạy `npm install`.
- Dữ liệu PostgreSQL được lưu trong volume `postgres_data`.
- Maven dependencies được cache trong volume `maven_cache`.
- `node_modules` của frontend được lưu trong volume `frontend_node_modules`.
- Nếu máy đang có PostgreSQL chạy ở port `5432`, hãy dừng PostgreSQL local hoặc đổi port mapping trong `docker-compose.yml`.

## Chạy thủ công

### 1. Clone hoặc mở project

```bash
cd D:\aparment-management-system\PTHTWeb
```

Lưu ý: tên thư mục hiện tại là `aparment-management-system` theo đường dẫn project. Nếu đổi tên thư mục, hãy cập nhật lại đường dẫn tương ứng trong các lệnh.

### 2. Chuẩn bị database PostgreSQL

Đăng nhập PostgreSQL và tạo database:

```sql
CREATE DATABASE apartment_db;
```

Cấu hình mặc định trong backend:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/apartment_db
    username: postgres
    password: Abc111@
```

Nếu máy local dùng username/password khác, cập nhật file:

```text
backend/src/main/resources/application.yaml
```

### 3. Chạy backend

Trên Windows:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux:

```bash
cd backend
./mvnw spring-boot:run
```

Backend mặc định chạy tại:

```text
http://localhost:8080
```

Khi chạy lần đầu, Hibernate sẽ tạo/cập nhật schema trong database `apartment_db`. `DataSeeder` tự tạo các role mặc định và tài khoản admin ban đầu.

### 4. Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

Nếu muốn frontend gọi đúng backend, tạo file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Apartment Management
```

Sau đó khởi động lại Vite dev server.

## Cấu hình môi trường

### Backend

File cấu hình chính:

```text
backend/src/main/resources/application.yaml
```

Các cấu hình quan trọng:

| Key | Giá trị mặc định | Mô tả |
| --- | --- | --- |
| `server.port` | `8080` | Port backend. |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/apartment_db` | URL PostgreSQL. |
| `spring.datasource.username` | `postgres` | Username database. |
| `spring.datasource.password` | `Abc111@` | Password database. |
| `spring.jpa.hibernate.ddl-auto` | `update` | Tự cập nhật schema khi chạy app. |
| `jwt.secret` | cấu hình trong YAML | Secret ký JWT. |
| `jwt.access-token-expiration` | `86400000` | Thời hạn access token, đơn vị millisecond. |
| `jwt.refresh-token-expiration` | `604800000` | Thời hạn refresh token, đơn vị millisecond. |
| `cors.allowed-origins` | `http://localhost:3000,http://localhost:5173` | Origin frontend được phép gọi API. Port đang dùng trong `vite.config.ts` là `3000`. |

Khuyến nghị khi deploy:

- Không commit secret thật lên Git.
- Đưa database password và JWT secret sang biến môi trường.
- Không dùng `ddl-auto: update` cho production nếu cần kiểm soát migration chặt chẽ.

### Frontend

Frontend đọc biến môi trường qua Vite:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Apartment Management
```

Axios instance sẽ gọi API theo format:

```text
${VITE_API_BASE_URL}/api/v1
```

Ví dụ:

```text
http://localhost:8080/api/v1/auth/login
```

## Tài khoản mặc định

Khi backend chạy lần đầu, `DataSeeder` tạo tài khoản admin:

| Email | Mật khẩu | Vai trò |
| --- | --- | --- |
| `admin@apartment.com` | `Admin@123456` | `ROLE_ADMIN` |

Sau khi đăng nhập lần đầu, nên đổi mật khẩu admin ngay.

## API và phân quyền

### Auth API

Base URL:

```text
/api/v1/auth
```

Endpoint chính:

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| `POST` | `/login` | Đăng nhập, trả về access token và refresh token. |
| `POST` | `/refresh` | Làm mới access token. |
| `POST` | `/change-password` | Đổi mật khẩu. |
| `GET` | `/me` | Lấy thông tin user hiện tại. |

### Admin API

Base URL:

```text
/api/v1/admin
```

Nhóm endpoint chính:

| Nhóm | Base path | Mô tả |
| --- | --- | --- |
| Buildings | `/buildings` | CRUD tòa nhà, gán manager. |
| Apartments | `/apartments` | CRUD căn hộ, đổi trạng thái căn hộ. |
| Fee Configs | `/fee-configs` | Quản lý cấu hình phí. |
| Users | `/users` | Quản lý tài khoản và vai trò. |

### Manager API

Base URL:

```text
/api/v1/manager
```

Nhóm endpoint chính:

| Nhóm | Base path | Mô tả |
| --- | --- | --- |
| Dashboard | `/dashboard` | Thống kê tổng quan cho ban quản lý. |
| Apartments | `/apartments` | Xem căn hộ thuộc tòa được phụ trách. |
| Residents | `/residents` | Xem danh sách và chi tiết cư dân. |
| Announcements | `/announcements` | Quản lý thông báo. |

### Resident API

Base URL:

```text
/api/v1/resident
```

Nhóm endpoint chính:

| Nhóm | Base path | Mô tả |
| --- | --- | --- |
| Profile | `/me` | Xem/cập nhật hồ sơ cư dân. |
| Apartment | `/me/apartment` | Xem căn hộ đang ở. |
| Bills | `/bills` | Xem danh sách và chi tiết hóa đơn. |
| Payments | `/payments` | Xem lịch sử thanh toán. |
| Vehicles | `/vehicles` | Đăng ký, xem, hủy xe. |
| Service Types | `/service-types` | Xem dịch vụ có thể đăng ký. |
| Service Registrations | `/service-registrations` | Đăng ký/hủy dịch vụ. |
| Service Requests | `/service-requests` | Gửi và theo dõi yêu cầu/phản ánh. |
| Notifications | `/notifications` | Xem và đánh dấu thông báo. |
| Announcements | `/announcements` | Xem thông báo chung. |

### Response format

API dùng response wrapper dạng:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "timestamp": "2026-04-29T10:30:00"
}
```

Khi lỗi:

```json
{
  "success": false,
  "message": "Apartment not found",
  "errorCode": "APARTMENT_NOT_FOUND",
  "timestamp": "2026-04-29T10:30:00"
}
```

## Database

Database chính là PostgreSQL với các nhóm bảng:

| Nhóm | Bảng |
| --- | --- |
| Auth & Authorization | `users`, `roles`, `user_roles` |
| Tòa nhà & căn hộ | `buildings`, `apartments`, `apartment_residents` |
| Phí & hóa đơn | `fee_configs`, `bills`, `bill_items` |
| Thanh toán | `payments` |
| Xe & dịch vụ | `vehicles`, `service_types`, `service_registrations` |
| Yêu cầu/phản ánh | `service_requests` |
| Thông báo | `announcements`, `notifications` |

Quan hệ tổng quát:

```text
buildings 1-n apartments
apartments 1-n apartment_residents n-1 users
apartments 1-n bills 1-n bill_items
bills 1-n payments
users n-n roles
users 1-n vehicles
users 1-n service_requests
users 1-n notifications
service_types 1-n service_registrations
```

Chi tiết thiết kế database nằm tại:

```text
docs/database-design.md
```

## Kiểm thử, build và lint

### Backend test

```bash
cd backend
.\mvnw.cmd test
```

Trên macOS/Linux:

```bash
cd backend
./mvnw test
```

Nếu đã cài Maven local, có thể chạy trực tiếp:

```bash
cd backend
mvn test
```

Backend hiện có 34 test case: 1 test khởi động context Spring Boot và bộ unit test cho các service phía cư dân. Các unit test này dùng JUnit 5 + Mockito, mock repository/service phụ thuộc và kiểm tra mapping response, cập nhật trạng thái, lưu notification, phân quyền dữ liệu theo căn hộ/người dùng và các nhánh lỗi nghiệp vụ.

Các test class chính:

| Test class | Phạm vi kiểm thử |
| --- | --- |
| `ApartmentManagementApplicationTests` | Kiểm tra Spring context load được. |
| `ResidentInfoServiceTest` | Hồ sơ cư dân, cập nhật thông tin, ngày sinh hợp lệ, thông tin căn hộ và thành viên hộ gia đình. |
| `ResidentBillServiceTest` | Danh sách hóa đơn, tổng nợ, hóa đơn quá hạn, chi tiết hóa đơn, thanh toán của cư dân và lỗi truy cập hóa đơn không thuộc căn hộ. |
| `ResidentPaymentServiceTest` | Lịch sử thanh toán, chi tiết thanh toán và kiểm tra quyền xem thanh toán/hóa đơn. |
| `ResidentVehicleServiceTest` | Danh sách xe, đăng ký xe, kiểm tra trùng biển số, hủy xe và lỗi xe không thuộc cư dân. |
| `ResidentServiceRegistrationServiceTest` | Danh sách dịch vụ, đăng ký dịch vụ, chặn đăng ký trùng, hủy dịch vụ và lỗi hủy khi đăng ký không active. |
| `ResidentServiceRequestServiceTest` | Danh sách/chi tiết yêu cầu, tạo yêu cầu, gửi notification, đánh giá yêu cầu đã xử lý và validate rating. |
| `ResidentNotificationServiceTest` | Danh sách thông báo, đánh dấu đã đọc, đánh dấu tất cả đã đọc, lỗi không có thông báo và danh sách announcement theo tòa nhà. |

Chạy một test class cụ thể trên Windows:

```bash
cd backend
.\mvnw.cmd -Dtest=ResidentBillServiceTest test
```

Chạy một test class cụ thể trên macOS/Linux:

```bash
cd backend
./mvnw -Dtest=ResidentBillServiceTest test
```

Các unit test service nằm trong:

```text
backend/src/test/java/com/apartmentmanagement/service/resident/
```

### Backend package

```bash
cd backend
.\mvnw.cmd clean package
```

File build thường nằm trong:

```text
backend/target/
```

### Frontend lint

```bash
cd frontend
npm run lint
```

### Frontend build

```bash
cd frontend
npm run build
```

Output build nằm trong:

```text
frontend/dist/
```

### Frontend preview

```bash
cd frontend
npm run preview
```

## Luồng chạy đề xuất khi phát triển

1. Bật PostgreSQL.
2. Kiểm tra database `apartment_db` đã tồn tại.
3. Chạy backend tại `http://localhost:8080`.
4. Chạy frontend tại `http://localhost:3000`.
5. Đăng nhập bằng tài khoản admin mặc định.
6. Tạo manager/resident, tòa nhà, căn hộ và cấu hình phí để có dữ liệu sử dụng các module khác.

## Tài liệu liên quan

| File | Nội dung |
| --- | --- |
| `docs/requirements.md` | Use case và yêu cầu nghiệp vụ theo actor. |
| `docs/database-design.md` | Thiết kế database, bảng, quan hệ, index. |
| `docs/api-docs.md` | Tài liệu API chi tiết cho Admin, Manager, Resident. |
| `weekly-reports/` | Báo cáo tiến độ theo tuần. |

## Ghi chú phát triển

- Backend đang dùng `ddl-auto: update`, phù hợp cho giai đoạn phát triển nhanh.
- Các thao tác xóa quan trọng ưu tiên soft delete hoặc đổi trạng thái thay vì xóa dữ liệu thật.
- Frontend lưu token qua utility trong `frontend/src/utils/storage.ts`.
- Axios tự gắn Bearer token và thử refresh token khi gặp HTTP `401`.
- Route frontend được chia theo role trong `frontend/src/routes/AppRouter.tsx`.
- Constants label/trạng thái nằm tại `frontend/src/utils/constants.ts`.
- Khi thêm API mới, nên cập nhật đồng bộ:
  - Controller/service/repository ở backend.
  - TypeScript type trong `frontend/src/types`.
  - API service trong `frontend/src/services`.
  - Tài liệu trong `docs/api-docs.md`.

## Một số lỗi thường gặp

### Backend không kết nối được PostgreSQL

Kiểm tra:

- PostgreSQL đã chạy chưa.
- Database `apartment_db` đã được tạo chưa.
- Username/password trong `application.yaml` có đúng với máy local không.
- Port PostgreSQL có phải `5432` không.

### Frontend gọi API bị lỗi CORS

Kiểm tra:

- Backend có chạy ở `http://localhost:8080` không.
- `VITE_API_BASE_URL` trong `frontend/.env` đã đúng chưa.
- `cors.allowed-origins` trong `application.yaml` có chứa origin frontend không.

### Đăng nhập thành công nhưng bị đá về `/login`

Kiểm tra:

- Access token có được lưu ở frontend không.
- Backend trả đúng response `data.accessToken` không.
- Refresh token còn hạn không.
- User có đúng role để vào route `/admin`, `/manager` hoặc `/resident` không.

### Frontend build lỗi TypeScript

Chạy:

```bash
cd frontend
npm run build
```

Sau đó sửa lỗi type theo output của TypeScript. Các type dùng chung nằm trong:

```text
frontend/src/types/
```

## License

Project phục vụ mục đích học tập và phát triển hệ thống quản lý chung cư. Nếu dùng cho môi trường thực tế, cần bổ sung cấu hình bảo mật, migration database, quản lý secret và quy trình deploy phù hợp.

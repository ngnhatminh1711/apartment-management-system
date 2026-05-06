package com.apartmentmanagement.service.export;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.FeeConfig;
import com.apartmentmanagement.entity.Payment;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.BillStatus;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.repository.FeeConfigRepository;
import com.apartmentmanagement.repository.PaymentRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.repository.VehicleRepository;
import com.apartmentmanagement.util.ExportUtils;

import lombok.RequiredArgsConstructor;

/**
 * Export service cho Admin module.
 *
 * Hỗ trợ export:
 * - Danh sách người dùng
 * - Danh sách tòa nhà
 * - Danh sách căn hộ
 * - Danh sách hóa đơn (có filter)
 * - Danh sách thanh toán
 * - Danh sách phương tiện
 * - Báo cáo doanh thu
 * - Báo cáo công nợ
 */
@Service
@RequiredArgsConstructor
public class AdminExportService {

    private final UserRepository userRepo;
    private final BuildingRepository buildingRepo;
    private final ApartmentRepository apartmentRepo;
    private final ApartmentResidentRepository residentRepo;
    private final BillRepository billRepo;
    private final PaymentRepository paymentRepo;
    private final VehicleRepository vehicleRepo;
    private final FeeConfigRepository feeConfigRepo;

    // ── USERS ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportUsers(String format) throws IOException {
        List<User> users = userRepo.findAll();

        String[] headers = {
                "Họ và tên", "Email", "Số điện thoại", "CCCD/CMND",
                "Ngày sinh", "Vai trò", "Căn hộ hiện tại", "Tòa nhà",
                "Trạng thái", "Ngày tạo"
        };

        List<String[]> rows = users.stream().map(u -> {
            // Lấy thông tin căn hộ hiện tại
            String aptNumber = "";
            String buildingName = "";
            var activeResidence = u.getResidenceHistory().stream()
                    .filter(ar -> ar.getMoveOutDate() == null)
                    .findFirst();
            if (activeResidence.isPresent()) {
                aptNumber = activeResidence.get().getApartment().getApartmentNumber();
                buildingName = activeResidence.get().getApartment().getBuilding().getName();
            }

            String roles = u.getRoles().stream()
                    .map(r -> switch (r.getName()) {
                        case ROLE_ADMIN -> "Quản trị viên";
                        case ROLE_MANAGER -> "Ban quản lý";
                        case ROLE_RESIDENT -> "Cư dân";
                    })
                    .collect(java.util.stream.Collectors.joining(", "));

            return new String[] {
                    ExportUtils.safe(u.getFullName()),
                    ExportUtils.safe(u.getEmail()),
                    ExportUtils.safe(u.getPhone()),
                    ExportUtils.safe(u.getIdCard()),
                    u.getDateOfBirth() != null ? ExportUtils.fmtDate(u.getDateOfBirth()) : "",
                    roles,
                    aptNumber,
                    buildingName,
                    Boolean.TRUE.equals(u.getIsActive()) ? "Hoạt động" : "Vô hiệu",
                    ExportUtils.fmtDateTime(u.getCreatedAt()),
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("danh_sach_nguoi_dung", headers, rows);
        }
        return ExportUtils.buildExcelResponse("danh_sach_nguoi_dung", "Danh sách Người dùng", headers, rows);
    }

    // ── BUILDINGS ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportBuildings(String format) throws IOException {
        List<Building> buildings = buildingRepo.findAll();

        String[] headers = {
                "Tên tòa nhà", "Địa chỉ", "Số tầng", "Tổng căn hộ",
                "Đang có cư dân", "Còn trống", "Đang bảo trì",
                "Ban quản lý", "Email BQL", "Trạng thái", "Ngày tạo"
        };

        List<String[]> rows = buildings.stream().map(b -> {
            long occupied = apartmentRepo.countByBuildingIdAndStatus(b.getId(), ApartmentStatus.OCCUPIED);
            long available = apartmentRepo.countByBuildingIdAndStatus(b.getId(), ApartmentStatus.AVAILABLE);
            long maintenance = apartmentRepo.countByBuildingIdAndStatus(b.getId(), ApartmentStatus.MAINTENANCE);

            return new String[] {
                    ExportUtils.safe(b.getName()),
                    ExportUtils.safe(b.getAddress()),
                    String.valueOf(b.getNumFloors()),
                    String.valueOf(b.getNumApartments()),
                    String.valueOf(occupied),
                    String.valueOf(available),
                    String.valueOf(maintenance),
                    b.getManager() != null ? b.getManager().getFullName() : "",
                    b.getManager() != null ? b.getManager().getEmail() : "",
                    Boolean.TRUE.equals(b.getIsActive()) ? "Hoạt động" : "Vô hiệu",
                    ExportUtils.fmtDateTime(b.getCreatedAt()),
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("danh_sach_toa_nha", headers, rows);
        }
        return ExportUtils.buildExcelResponse("danh_sach_toa_nha", "Danh sách Tòa nhà", headers, rows);
    }

    // ── APARTMENTS ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportApartments(Long buildingId, ApartmentStatus status, String format)
            throws IOException {

        List<Apartment> apartments;
        if (buildingId != null) {
            apartments = apartmentRepo.findByBuildingId(buildingId);
            if (status != null) {
                apartments = apartments.stream()
                        .filter(a -> a.getStatus() == status)
                        .toList();
            }
        } else {
            apartments = apartmentRepo.findAll();
            if (status != null) {
                apartments = apartments.stream()
                        .filter(a -> a.getStatus() == status)
                        .toList();
            }
        }

        String[] headers = {
                "Tòa nhà", "Số căn hộ", "Tầng", "Diện tích (m²)",
                "Phòng ngủ", "Phòng tắm", "Hướng",
                "Cư dân chính", "SĐT cư dân", "Ngày vào",
                "Trạng thái", "Ghi chú"
        };

        List<String[]> rows = apartments.stream().map(a -> {
            // Lấy cư dân chính hiện tại
            var primaryResident = a.getResidentHistory().stream()
                    .filter(ar -> ar.getMoveOutDate() == null && Boolean.TRUE.equals(ar.getIsPrimary()))
                    .findFirst();

            String residentName = primaryResident.map(ar -> ar.getUser().getFullName()).orElse("");
            String residentPhone = primaryResident.map(ar -> ExportUtils.safe(ar.getUser().getPhone())).orElse("");
            String moveInDate = primaryResident.map(ar -> ExportUtils.fmtDate(ar.getMoveInDate())).orElse("");

            String statusLabel = switch (a.getStatus()) {
                case AVAILABLE -> "Trống";
                case OCCUPIED -> "Đang ở";
                case MAINTENANCE -> "Bảo trì";
                case RESERVED -> "Đã đặt";
            };

            return new String[] {
                    a.getBuilding().getName(),
                    a.getApartmentNumber(),
                    String.valueOf(a.getFloor()),
                    a.getAreaM2().toPlainString(),
                    String.valueOf(a.getNumBedrooms()),
                    String.valueOf(a.getNumBathrooms()),
                    ExportUtils.safe(a.getDirection()),
                    residentName,
                    residentPhone,
                    moveInDate,
                    statusLabel,
                    ExportUtils.safe(a.getNotes()),
            };
        }).toList();

        String titleSuffix = buildingId != null ? " – " + apartments.stream()
                .findFirst().map(a -> a.getBuilding().getName()).orElse("") : "";

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("danh_sach_can_ho", headers, rows);
        }
        return ExportUtils.buildExcelResponse(
                "danh_sach_can_ho",
                "Danh sách Căn hộ" + titleSuffix,
                headers, rows);
    }

    // ── BILLS ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportBills(
            Long buildingId, BillStatus status,
            LocalDate fromMonth, LocalDate toMonth,
            String format) throws IOException {

        List<Bill> bills = billRepo.findOutstandingBills(buildingId);
        // Dùng findForReport nếu có filter phức tạp hơn
        // Ở đây query toàn bộ và filter in-memory cho đơn giản
        List<Bill> allBills = billRepo.findAll();

        List<Bill> filtered = allBills.stream()
                .filter(b -> buildingId == null || b.getApartment().getBuilding().getId().equals(buildingId))
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> fromMonth == null || !b.getBillingMonth().isBefore(fromMonth))
                .filter(b -> toMonth == null || !b.getBillingMonth().isAfter(toMonth))
                .sorted(java.util.Comparator.comparing(Bill::getBillingMonth).reversed())
                .toList();

        String[] headers = {
                "Tòa nhà", "Số căn hộ", "Tháng hóa đơn", "Tổng tiền (VNĐ)",
                "Đã thanh toán (VNĐ)", "Còn lại (VNĐ)",
                "Hạn thanh toán", "Trạng thái",
                "Cư dân chính", "SĐT", "Ghi chú"
        };

        List<String[]> rows = filtered.stream().map(b -> {
            String statusLabel = switch (b.getStatus()) {
                case PENDING -> "Chờ thanh toán";
                case PARTIALLY_PAID -> "Thanh toán một phần";
                case PAID -> "Đã thanh toán";
                case OVERDUE -> "Quá hạn";
                case CANCELLED -> "Đã huỷ";
            };

            // Cư dân chính
            var primary = b.getApartment().getResidentHistory().stream()
                    .filter(ar -> ar.getMoveOutDate() == null && Boolean.TRUE.equals(ar.getIsPrimary()))
                    .findFirst();

            return new String[] {
                    b.getApartment().getBuilding().getName(),
                    b.getApartment().getApartmentNumber(),
                    ExportUtils.fmtBillingMonth(b.getBillingMonth()),
                    ExportUtils.fmtMoney(b.getTotalAmount()),
                    ExportUtils.fmtMoney(b.getPaidAmount()),
                    ExportUtils.fmtMoney(b.getRemainingAmount()),
                    ExportUtils.fmtDate(b.getDueDate()),
                    statusLabel,
                    primary.map(ar -> ar.getUser().getFullName()).orElse(""),
                    primary.map(ar -> ExportUtils.safe(ar.getUser().getPhone())).orElse(""),
                    ExportUtils.safe(b.getNotes()),
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("hoa_don", headers, rows);
        }
        return ExportUtils.buildExcelResponse("hoa_don", "Danh sách Hóa đơn", headers, rows);
    }

    // ── PAYMENTS ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportPayments(
            Long buildingId, String format) throws IOException {

        List<Payment> payments = paymentRepo.findAll().stream()
                .filter(p -> buildingId == null ||
                        p.getBill().getApartment().getBuilding().getId().equals(buildingId))
                .filter(p -> p.getStatus() == com.apartmentmanagement.enums.PaymentStatus.SUCCESS)
                .sorted(java.util.Comparator.comparing(
                        Payment::getPaidAt,
                        java.util.Comparator.nullsLast(java.util.Comparator.reverseOrder())))
                .toList();

        String[] headers = {
                "Tòa nhà", "Số căn hộ", "Tháng HĐ",
                "Số tiền (VNĐ)", "Phương thức", "Mã giao dịch",
                "Người thanh toán", "SĐT", "Thời gian thanh toán"
        };

        List<String[]> rows = payments.stream().map(p -> {
            String methodLabel = switch (p.getPaymentMethod()) {
                case CASH -> "Tiền mặt";
                case VNPAY -> "VNPay";
                case MOMO -> "MoMo";
                case BANK_TRANSFER -> "Chuyển khoản";
            };

            return new String[] {
                    p.getBill().getApartment().getBuilding().getName(),
                    p.getBill().getApartment().getApartmentNumber(),
                    ExportUtils.fmtBillingMonth(p.getBill().getBillingMonth()),
                    ExportUtils.fmtMoney(p.getAmount()),
                    methodLabel,
                    ExportUtils.safe(p.getTransactionRef()),
                    p.getUser().getFullName(),
                    ExportUtils.safe(p.getUser().getPhone()),
                    ExportUtils.fmtDateTime(p.getPaidAt()),
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("lich_su_thanh_toan", headers, rows);
        }
        return ExportUtils.buildExcelResponse("lich_su_thanh_toan", "Lịch sử Thanh toán", headers, rows);
    }

    // ── VEHICLES ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportVehicles(
            Long buildingId, VehicleStatus status, String format) throws IOException {

        List<Vehicle> vehicles = vehicleRepo.findAll().stream()
                .filter(v -> buildingId == null ||
                        v.getApartment().getBuilding().getId().equals(buildingId))
                .filter(v -> status == null || v.getStatus() == status)
                .sorted(java.util.Comparator.comparing(Vehicle::getCreatedAt).reversed())
                .toList();

        String[] headers = {
                "Tòa nhà", "Căn hộ", "Loại xe", "Biển số",
                "Hãng", "Dòng xe", "Màu",
                "Chủ xe", "SĐT", "CCCD",
                "Trạng thái", "Ngày đăng ký", "Ngày duyệt",
                "Người duyệt", "Lý do từ chối"
        };

        List<String[]> rows = vehicles.stream().map(v -> {
            String typeLabel = switch (v.getVehicleType()) {
                case MOTORBIKE -> "Xe máy";
                case CAR -> "Ô tô";
                case BICYCLE -> "Xe đạp";
                case TRUCK -> "Xe tải";
            };

            String statusLabel = switch (v.getStatus()) {
                case PENDING_APPROVAL -> "Chờ duyệt";
                case ACTIVE -> "Đang sử dụng";
                case INACTIVE -> "Ngừng sử dụng";
                case REJECTED -> "Từ chối";
            };

            return new String[] {
                    v.getApartment().getBuilding().getName(),
                    v.getApartment().getApartmentNumber(),
                    typeLabel,
                    v.getLicensePlate(),
                    ExportUtils.safe(v.getBrand()),
                    ExportUtils.safe(v.getModel()),
                    ExportUtils.safe(v.getColor()),
                    v.getUser().getFullName(),
                    ExportUtils.safe(v.getUser().getPhone()),
                    ExportUtils.safe(v.getUser().getIdCard()),
                    statusLabel,
                    ExportUtils.fmtDateTime(v.getRegisteredAt()),
                    ExportUtils.fmtDateTime(v.getApprovedAt()),
                    v.getApprovedBy() != null ? v.getApprovedBy().getFullName() : "",
                    ExportUtils.safe(v.getRejectionReason()),
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("phuong_tien", headers, rows);
        }
        return ExportUtils.buildExcelResponse("phuong_tien", "Danh sách Phương tiện", headers, rows);
    }

    // ── FEE CONFIGS ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> exportFeeConfigs(Long buildingId, String format) throws IOException {
        List<FeeConfig> configs;
        if (buildingId != null) {
            configs = feeConfigRepo.findHistory(buildingId, null);
        } else {
            configs = feeConfigRepo.findAll();
        }

        String[] headers = {
                "Tòa nhà", "Loại phí", "Đơn giá (VNĐ)", "Đơn vị",
                "Áp dụng từ", "Kết thúc", "Trạng thái", "Mô tả", "Người tạo"
        };

        List<String[]> rows = configs.stream().map(fc -> {
            String feeTypeLabel = switch (fc.getFeeType()) {
                case ELECTRICITY -> "Tiền điện";
                case WATER -> "Tiền nước";
                case MANAGEMENT -> "Phí quản lý";
                case PARKING_MOTORBIKE -> "Phí xe máy";
                case PARKING_CAR -> "Phí ô tô";
                case GARBAGE -> "Phí rác thải";
                case INTERNET -> "Phí Internet";
                case ELEVATOR -> "Phí thang máy";
            };

            return new String[] {
                    fc.getBuilding().getName(),
                    feeTypeLabel,
                    ExportUtils.fmtMoney(fc.getUnitPrice()),
                    fc.getUnit(),
                    ExportUtils.fmtDate(fc.getEffectiveFrom()),
                    fc.getEffectiveTo() != null ? ExportUtils.fmtDate(fc.getEffectiveTo()) : "Đang áp dụng",
                    fc.getEffectiveTo() == null ? "Đang áp dụng" : "Đã đóng",
                    ExportUtils.safe(fc.getDescription()),
                    fc.getCreatedBy() != null ? fc.getCreatedBy().getFullName() : "",
            };
        }).toList();

        if ("csv".equalsIgnoreCase(format)) {
            return ExportUtils.buildCsvResponse("cau_hinh_phi", headers, rows);
        }
        return ExportUtils.buildExcelResponse("cau_hinh_phi", "Lịch sử Cấu hình Giá", headers, rows);
    }
}
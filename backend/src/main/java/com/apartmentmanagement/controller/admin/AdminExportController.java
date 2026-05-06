package com.apartmentmanagement.controller.admin;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.BillStatus;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.service.export.AdminExportService;

import lombok.RequiredArgsConstructor;

/**
 * Controller export dữ liệu ra Excel/CSV cho Admin.
 *
 * Tất cả endpoints nhận query param ?format=excel (mặc định) hoặc ?format=csv
 *
 * Endpoints:
 * GET /api/v1/admin/export/users
 * GET /api/v1/admin/export/buildings
 * GET /api/v1/admin/export/apartments
 * GET /api/v1/admin/export/bills
 * GET /api/v1/admin/export/payments
 * GET /api/v1/admin/export/vehicles
 * GET /api/v1/admin/export/fee-configs
 */
@RestController
@RequestMapping("/api/v1/admin/export")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminExportController {

    private final AdminExportService exportService;

    /** Xuất danh sách người dùng */
    @GetMapping("/users")
    public ResponseEntity<byte[]> exportUsers(
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportUsers(format);
    }

    /** Xuất danh sách tòa nhà */
    @GetMapping("/buildings")
    public ResponseEntity<byte[]> exportBuildings(
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportBuildings(format);
    }

    /** Xuất danh sách căn hộ, có thể filter theo tòa nhà và trạng thái */
    @GetMapping("/apartments")
    public ResponseEntity<byte[]> exportApartments(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) ApartmentStatus status,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportApartments(buildingId, status, format);
    }

    /** Xuất danh sách hóa đơn, filter theo tòa nhà / trạng thái / khoảng tháng */
    @GetMapping("/bills")
    public ResponseEntity<byte[]> exportBills(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) BillStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromMonth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toMonth,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportBills(buildingId, status, fromMonth, toMonth, format);
    }

    /** Xuất lịch sử thanh toán */
    @GetMapping("/payments")
    public ResponseEntity<byte[]> exportPayments(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportPayments(buildingId, format);
    }

    /** Xuất danh sách phương tiện */
    @GetMapping("/vehicles")
    public ResponseEntity<byte[]> exportVehicles(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportVehicles(buildingId, status, format);
    }

    /** Xuất lịch sử cấu hình giá */
    @GetMapping("/fee-configs")
    public ResponseEntity<byte[]> exportFeeConfigs(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(defaultValue = "excel") String format) throws IOException {
        return exportService.exportFeeConfigs(buildingId, format);
    }
}
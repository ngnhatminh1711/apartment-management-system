package com.apartmentmanagement.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.admin.DashboardStatsResponse;
import com.apartmentmanagement.dto.response.admin.DebtReportResponse;
import com.apartmentmanagement.service.admin.AdminReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminReportController {

    private final AdminReportService reportService;

    /** GET /api/v1/admin/dashboard/stats */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard(
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) Integer year) {

        return ResponseEntity.ok(ApiResponse.success(
                reportService.getDashboard(buildingId, year)));
    }

    /** GET /api/v1/admin/reports/debt */
    @GetMapping("/reports/debt")
    public ResponseEntity<ApiResponse<DebtReportResponse>> getDebt(
            @RequestParam(required = false) Long buildingId) {

        return ResponseEntity.ok(ApiResponse.success(
                reportService.getDebtReport(buildingId)));
    }
}
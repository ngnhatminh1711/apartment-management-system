package com.apartmentmanagement.controller.resident;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.BillItemResponse;

import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentBillService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentBillController {
    private final ResidentBillService residentBillService;

    // -- Bill Info 2 --
    @GetMapping("/bills")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<BillItemResponse>>> getBills
    (@RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) Integer year) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentBillService.getMyBills(userId, status, year, page, size)));
    }

    @GetMapping("/bills/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BillItemResponse>> getBillDetails(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentBillService.getMyBillDetails(userId, id)));
    }

}

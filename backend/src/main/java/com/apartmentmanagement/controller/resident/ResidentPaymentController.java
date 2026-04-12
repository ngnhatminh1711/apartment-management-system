package com.apartmentmanagement.controller.resident;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.PaymentItemResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentPaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentPaymentController {
    private final ResidentPaymentService residentService;


    // --Payment Info 3--
    @GetMapping("/payments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<PaymentItemResponse>>> getPaymentsHistory(
        @RequestParam(required = false) Long billId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String paymentMethod,
        @RequestParam(required = false) LocalDate from,
        @RequestParam(required = false) LocalDate to,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentService.getMyPayments(userId, billId, status, paymentMethod, from, to, page, size)));
    }
    @GetMapping("/payments/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaymentItemResponse>> getPaymentDetails(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentService.getMyPaymentDetails(userId, id)));
    }
    

}

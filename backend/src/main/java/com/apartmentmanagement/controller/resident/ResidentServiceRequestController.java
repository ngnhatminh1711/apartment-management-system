package com.apartmentmanagement.controller.resident;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.resident.CreateServiceRequest;
import com.apartmentmanagement.dto.request.resident.ServiceRequestRating;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.entity.ServiceRequest;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentServiceRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentServiceRequestController {
    private final ResidentServiceRequestService residentServiceRequestService;

    // -- Service Request 4 Done--
    @GetMapping("/service-requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<ServiceRequest>>> getMyServiceRequests
        (@RequestParam(required = false) String status,
        @RequestParam(required = false) String requestType,
         @RequestParam(defaultValue = "0") int page,
         @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentServiceRequestService.getMyServiceRequests(userId, status, requestType, page, size)));
    }
    @GetMapping("/service-requests/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ServiceRequest>> getMyServiceRequestDetail(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentServiceRequestService.getMyServiceRequestDetail(userId, id)));
    }
    @PostMapping("/service-requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> createServiceRequest(@Valid @RequestBody CreateServiceRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        residentServiceRequestService.createServiceRequest(userId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Tạo yêu cầu dịch vụ thành công", null));
    }

    @PatchMapping("/service-requests/{id}/rate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ServiceRequest>> rateServiceRequest(
            @PathVariable Long id, @Valid @RequestBody ServiceRequestRating rating
            ) {
        Long userId = SecurityUtils.getCurrentUserId();
        residentServiceRequestService.rateServiceRequest(userId, id, rating);
        return ResponseEntity.ok(ApiResponse.success("Đánh giá yêu cầu dịch vụ thành công", null));
    }

}

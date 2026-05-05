package com.apartmentmanagement.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.admin.ServiceTypeRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.ServiceTypeResponse;
import com.apartmentmanagement.service.admin.AdminServiceTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/service-types")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminServiceTypeController {

    private final AdminServiceTypeService serviceTypeService;

    /** GET /api/v1/admin/service-types */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceTypeResponse>>> getAll(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(ApiResponse.success(
                serviceTypeService.getAll(isActive, page, size)));
    }

    /** GET /api/v1/admin/service-types/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceTypeResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(serviceTypeService.getById(id)));
    }

    /** POST /api/v1/admin/service-types */
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceTypeResponse>> create(
            @Valid @RequestBody ServiceTypeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo dịch vụ thành công",
                        serviceTypeService.create(req)));
    }

    /** PUT /api/v1/admin/service-types/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceTypeResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody ServiceTypeRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công",
                serviceTypeService.update(id, req)));
    }

    /** PATCH /api/v1/admin/service-types/{id}/toggle-active */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<ServiceTypeResponse>> toggleActive(@PathVariable Integer id) {
        var result = serviceTypeService.toggleActive(id);
        String msg = result.getIsActive() ? "Dịch vụ đã được bật" : "Dịch vụ đã được tắt";
        return ResponseEntity.ok(ApiResponse.success(msg, result));
    }
}
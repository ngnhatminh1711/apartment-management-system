package com.apartmentmanagement.controller.admin;

import com.apartmentmanagement.dto.request.admin.ApartmentRequest;
import com.apartmentmanagement.dto.request.admin.ApartmentStatusRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.ApartmentResponse;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.service.admin.AdminApartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/apartments")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminApartmentController {

    private final AdminApartmentService apartmentService;

    /** GET /api/v1/admin/apartments */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ApartmentResponse>>> getAll(
            @RequestParam(required = false)           Long            buildingId,
            @RequestParam(required = false)           ApartmentStatus status,
            @RequestParam(defaultValue = "")           String          search,
            @RequestParam(defaultValue = "0")         int             page,
            @RequestParam(defaultValue = "10")        int             size,
            @RequestParam(defaultValue = "createdAt,desc") String     sort) {

        return ResponseEntity.ok(ApiResponse.success(
                apartmentService.getAll(buildingId, status, search, page, size, sort)));
    }

    /** GET /api/v1/admin/apartments/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApartmentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(apartmentService.getById(id)));
    }

    /** POST /api/v1/admin/apartments */
    @PostMapping
    public ResponseEntity<ApiResponse<ApartmentResponse>> create(
            @Valid @RequestBody ApartmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo căn hộ thành công", apartmentService.create(req)));
    }

    /** PUT /api/v1/admin/apartments/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ApartmentResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ApartmentRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công",
                apartmentService.update(id, req)));
    }

    /** DELETE /api/v1/admin/apartments/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        apartmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa căn hộ", null));
    }

    /** PATCH /api/v1/admin/apartments/{id}/status */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApartmentResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApartmentStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công",
                apartmentService.updateStatus(id, req)));
    }
}
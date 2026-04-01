package com.apartmentmanagement.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.admin.AssignManagerRequest;
import com.apartmentmanagement.dto.request.admin.BuildingRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.BuildingResponse;
import com.apartmentmanagement.service.admin.AdminBuildingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/buildings")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminBuildingController {

    private final AdminBuildingService buildingService;

    /** GET /api/v1/admin/buildings */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BuildingResponse>>> getAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        var data = buildingService.getAll(search, isActive, page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /** GET /api/v1/admin/buildings/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(buildingService.getById(id)));
    }

    /** POST /api/v1/admin/buildings */
    @PostMapping
    public ResponseEntity<ApiResponse<BuildingResponse>> create(
            @Valid @RequestBody BuildingRequest req) {
        var created = buildingService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo tòa nhà thành công", created));
    }

    /** PUT /api/v1/admin/buildings/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BuildingResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody BuildingRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", buildingService.update(id, req)));
    }

    /** DELETE /api/v1/admin/buildings/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        buildingService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Đã vô hiệu hóa tòa nhà", null));
    }

    /** PUT /api/v1/admin/buildings/{id}/assign-manager */
    @PutMapping("/{id}/assign-manager")
    public ResponseEntity<ApiResponse<BuildingResponse>> assignManager(
            @PathVariable Long id,
            @Valid @RequestBody AssignManagerRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Gán Manager thành công",
                buildingService.assignManager(id, req)));
    }
}
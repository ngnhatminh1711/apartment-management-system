package com.apartmentmanagement.controller.admin;

import java.util.List;

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

import com.apartmentmanagement.dto.request.admin.FeeConfigRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.admin.CurrentFeeResponse;
import com.apartmentmanagement.dto.response.admin.FeeConfigResponse;
import com.apartmentmanagement.enums.FeeType;
import com.apartmentmanagement.service.admin.AdminFeeConfigService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/fee-configs")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminFeeConfigController {

    private final AdminFeeConfigService feeConfigService;

    /** GET /api/v1/admin/fee-configs */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FeeConfigResponse>>> getAll(
            @RequestParam Long buildingId,
            @RequestParam(required = false) FeeType feeType,
            @RequestParam(defaultValue = "false") boolean activeOnly) {

        return ResponseEntity.ok(ApiResponse.success(
                feeConfigService.getAll(buildingId, feeType, activeOnly)));
    }

    /** GET /api/v1/admin/fee-configs/current */
    @GetMapping("/current")
    public ResponseEntity<ApiResponse<CurrentFeeResponse>> getCurrent(
            @RequestParam Long buildingId) {
        return ResponseEntity.ok(ApiResponse.success(feeConfigService.getCurrentFees(buildingId)));
    }

    /** GET /api/v1/admin/fee-configs/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeeConfigResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feeConfigService.getById(id)));
    }

    /** POST /api/v1/admin/fee-configs */
    @PostMapping
    public ResponseEntity<ApiResponse<FeeConfigResponse>> create(
            @Valid @RequestBody FeeConfigRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo cấu hình phí thành công",
                        feeConfigService.create(req)));
    }

    /** PUT /api/v1/admin/fee-configs/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeeConfigResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody FeeConfigRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công",
                feeConfigService.update(id, req)));
    }

    /** DELETE /api/v1/admin/fee-configs/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        feeConfigService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa cấu hình phí", null));
    }
}
package com.apartmentmanagement.controller.manager;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.manager.VehicleApproveRequest;
import com.apartmentmanagement.dto.request.manager.VehicleRejectRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.manager.ManagerVehicleResponse;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;
import com.apartmentmanagement.service.manager.ManagerVehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/manager/vehicles")
@PreAuthorize("hasRole('MANAGER')")
@RequiredArgsConstructor
public class ManagerVehicleController {

    private final ManagerVehicleService vehicleService;

    /** GET /api/v1/manager/vehicles */
    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) VehicleType vehicleType,
            @RequestParam(required = false) Long apartmentId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success(
                vehicleService.getAll(status, vehicleType, apartmentId, search, page, size)));
    }

    /** PATCH /api/v1/manager/vehicles/{id}/approve */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ManagerVehicleResponse>> approve(
            @PathVariable Long id,
            @RequestBody(required = false) VehicleApproveRequest req) {
        if (req == null)
            req = new VehicleApproveRequest();
        return ResponseEntity.ok(ApiResponse.success("Duyệt xe thành công",
                vehicleService.approve(id, req)));
    }

    /** PATCH /api/v1/manager/vehicles/{id}/reject */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ManagerVehicleResponse>> reject(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRejectRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Từ chối đăng ký xe thành công",
                vehicleService.reject(id, req)));
    }
}
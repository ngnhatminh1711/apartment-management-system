package com.apartmentmanagement.controller.resident;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.resident.CreateVehicleRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.resident.VehicleResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentVehicleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentVehicleController {
    private final ResidentVehicleService residentVehicleService;

    // -- Vehicle Info 3 --

    @GetMapping("/vehicles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehicles() {
        Long userId=SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentVehicleService.getMyVehicles(userId)));
    }
    
    @PostMapping("/vehicles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        Long userId=SecurityUtils.getCurrentUserId();
        residentVehicleService.createVehicle(userId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Đăng ký xe mới chờ duyệt",null));
    }
    
    @DeleteMapping("/vehicles/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        Long userId=SecurityUtils.getCurrentUserId();
        residentVehicleService.deleteVehicle(id,userId);
        return ResponseEntity.ok(ApiResponse.success("Huỷ đăng ký phương tiện đang chờ duyệt",null));
    }

}

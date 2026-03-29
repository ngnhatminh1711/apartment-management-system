package com.apartmentmanagement.controller;

import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.CreateVehicleRequest;
import com.apartmentmanagement.dto.request.UpdateInfoRequest;
import com.apartmentmanagement.dto.request.auth.ChangePasswordRequest;
import com.apartmentmanagement.dto.response.ApartmentResponse;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.AuthResponse;
import com.apartmentmanagement.dto.response.ResidentResponse;
import com.apartmentmanagement.dto.response.ServiceRegistrationResponse;
import com.apartmentmanagement.dto.response.ServiceTypeResponse;
import com.apartmentmanagement.dto.response.VehicleResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.ResidentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;




@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentController {
    private final ResidentService residentService;
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ResidentResponse>> getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ResidentResponse residentResponse=residentService.getMe(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Lấy data info thành công",residentResponse));
    }
    
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> updateInfoUser(@Valid @RequestBody  UpdateInfoRequest request){
        Long currentUserId = SecurityUtils.getCurrentUserId();
        residentService.ChangeInfoUser(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thành công",null));
    }

    @GetMapping("/me/apartment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApartmentResponse>> getApartment(){
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ApartmentResponse apartmentResponse=residentService.getMyApartment(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Lấy data info thành công",apartmentResponse));
    }

    @GetMapping("/vehicles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehicles() {
        Long userId=SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentService.getMyVehicles(userId)));
    }
    
    @PostMapping("/vehicles")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        Long userId=SecurityUtils.getCurrentUserId();
        residentService.createVehicle(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký xe mới chờ duyệt",null));
    }
    
    @DeleteMapping("/vehicles/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long vehicleId) {
        Long userId=SecurityUtils.getCurrentUserId();
        residentService.deleteVehicle(vehicleId,userId);
        return ResponseEntity.ok(ApiResponse.success("Huỷ đăng ký phương tiện đang chờ duyệt",null));
    }
     
    @GetMapping("/service-types")
    public ResponseEntity<ApiResponse<List<ServiceTypeResponse>>> getServirceTypes() {
        Long userId=SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentService.getServiceTypes(userId)));
    }
    
    @GetMapping("/service-registrations")
    public ResponseEntity<ApiResponse<List<ServiceRegistrationResponse>>> getMyServices(@RequestParam(required = false) String status) {
        Long userId =SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(ApiResponse.success(residentService.getServiceRegistration(status, userId)));
    }
    
}

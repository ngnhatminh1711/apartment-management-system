package com.apartmentmanagement.controller.resident;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.resident.UpdateInfoRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.resident.ApartmentResponse;
import com.apartmentmanagement.dto.response.resident.ResidentResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentInfoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentInfoController {
    private final ResidentInfoService residentService;
    // -- Resident Aparment Info 4  --
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
        residentService.changeInfoUser(currentUserId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thành công",null));
    }

    @GetMapping("/me/apartment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApartmentResponse>> getApartment(){
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ApartmentResponse apartmentResponse=residentService.getMyApartment(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Lấy data info thành công",apartmentResponse));
    }


}

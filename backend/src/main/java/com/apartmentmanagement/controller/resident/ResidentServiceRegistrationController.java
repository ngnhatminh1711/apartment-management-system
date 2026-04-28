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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.resident.ServiceRegistrationRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.resident.ServiceRegistrationResponse;
import com.apartmentmanagement.dto.response.resident.ServiceTypeResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentServiceRegistrationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentServiceRegistrationController {
    private final ResidentServiceRegistrationService residentServiceRegistrationService;
    // -- Service Registration  4 Done--
    @GetMapping("/service-types")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ServiceTypeResponse>>> getServirceTypes() {
        Long userId=SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentServiceRegistrationService.getServiceTypes(userId)));
    }
    
    @GetMapping("/service-registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ServiceRegistrationResponse>>> getMyServices(@RequestParam(required = false) String status) {
        Long userId =SecurityUtils.getCurrentUserId();

        return ResponseEntity.ok(ApiResponse.success(residentServiceRegistrationService.getServiceRegistration(status, userId)));
    }
    
    @PostMapping("/service-registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> createServiceRegistration(@Valid @RequestBody ServiceRegistrationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        residentServiceRegistrationService.createServiceRegistration(userId, request);
        return ResponseEntity.status(201).body(ApiResponse.success("Đăng ký dịch vụ thành công", null));
    }

    @DeleteMapping("/service-registrations/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id){
        Long userId =SecurityUtils.getCurrentUserId();
        residentServiceRegistrationService.deleteServiceRegistration(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Huỷ đăng ký dịch vụ", null));
    }
}

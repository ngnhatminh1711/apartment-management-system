package com.apartmentmanagement.controller;

import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.AuthResponse;
import com.apartmentmanagement.dto.response.ResidentResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.ResidentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentController {
    private final ResidentService residentService;
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ResidentResponse>> getCurrentUser() {
        ResidentResponse residentResponse=residentService.getMe();
        return ResponseEntity.ok(ApiResponse.success("Lấy data info thành công",residentResponse));
    }
    

}

package com.apartmentmanagement.controller.manager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.manager.AssignResidentRequest;
import com.apartmentmanagement.dto.request.manager.MoveOutRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.manager.AssignResidentResponse;
import com.apartmentmanagement.dto.response.manager.ManagerApartmentDetailResponse;
import com.apartmentmanagement.dto.response.manager.ManagerApartmentResponse;
import com.apartmentmanagement.dto.response.manager.MoveOutResponse;
import com.apartmentmanagement.dto.response.manager.ResidentDetailResponse;
import com.apartmentmanagement.dto.response.manager.ResidentResponse;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.service.manager.ManagerApartmentService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/manager")
@PreAuthorize("hasRole('MANAGER')")
@RequiredArgsConstructor
public class ManagerApartmentController {

    private final ManagerApartmentService apartmentService;

    /** GET /api/v1/manager/apartments */
    @GetMapping("/apartments")
    public ResponseEntity<ApiResponse<PageResponse<ManagerApartmentResponse>>> getApartments(
            @RequestParam(required = false) ApartmentStatus status,
            @RequestParam(required = false) Integer floor,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "floor,asc") String sort) {

        return ResponseEntity.ok(ApiResponse.success(
                apartmentService.getApartments(status, floor, search, page, size, sort)));
    }

    /** GET /api/v1/manager/apartments/{id} */
    @GetMapping("/apartments/{id}")
    public ResponseEntity<ApiResponse<ManagerApartmentDetailResponse>> getApartmentDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(apartmentService.getApartmentDetail(id)));
    }

    /** POST /api/v1/manager/apartments/{id}/residents */
    @PostMapping("/apartments/{id}/residents")
    public ResponseEntity<ApiResponse<AssignResidentResponse>> assignResident(
            @PathVariable Long id,
            @Valid @RequestBody AssignResidentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gán cư dân thành công",
                        apartmentService.assignResident(id, req)));
    }

    /** PATCH /api/v1/manager/apartments/{id}/residents/{residentId}/move-out */
    @PatchMapping("/apartments/{id}/residents/{residentId}/move-out")
    public ResponseEntity<ApiResponse<MoveOutResponse>> moveOut(
            @PathVariable Long id,
            @PathVariable Long residentId,
            @Valid @RequestBody MoveOutRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Ghi nhận chuyển đi thành công",
                apartmentService.moveOut(id, residentId, req)));
    }

    /** GET /api/v1/manager/residents */
    @GetMapping("/residents")
    public ResponseEntity<ApiResponse<PageResponse<ResidentResponse>>> getResidents(
            @RequestParam(required = false) Long apartmentId,
            @RequestParam(required = false) Integer floor,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        return ResponseEntity.ok(ApiResponse.success(
                apartmentService.getResidents(apartmentId, floor, search, page, size, sort)));
    }

    /** GET /api/v1/manager/residents/{id} */
    @GetMapping("/residents/{id}")
    public ResponseEntity<ApiResponse<ResidentDetailResponse>> getResidentDetail(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(apartmentService.getResidentDetail(id)));
    }
}

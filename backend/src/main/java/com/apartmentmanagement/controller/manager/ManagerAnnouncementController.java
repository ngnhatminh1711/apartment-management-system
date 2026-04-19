package com.apartmentmanagement.controller.manager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.manager.AnnouncementRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.manager.AnnouncementResponse;
import com.apartmentmanagement.enums.AnnouncementPriority;
import com.apartmentmanagement.service.manager.ManagerAnnouncementService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/manager/announcements")
@PreAuthorize("hasRole('MANAGER')")
@RequiredArgsConstructor
public class ManagerAnnouncementController {

    private final ManagerAnnouncementService announcementService;

    /** GET /api/v1/manager/announcements */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AnnouncementResponse>>> getAll(
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(required = false) AnnouncementPriority priority,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success(
                announcementService.getAll(isPublished, priority, search, page, size)));
    }

    /** GET /api/v1/manager/announcements/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(announcementService.getById(id)));
    }

    /** POST /api/v1/manager/announcements */
    @PostMapping
    public ResponseEntity<ApiResponse<AnnouncementResponse>> create(
            @Valid @RequestBody AnnouncementRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo thông báo thành công",
                        announcementService.create(req)));
    }
}

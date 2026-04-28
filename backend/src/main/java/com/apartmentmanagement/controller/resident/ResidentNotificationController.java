package com.apartmentmanagement.controller.resident;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.AnnouncementResponse;
import com.apartmentmanagement.dto.response.resident.NotificationItemResponse;
import com.apartmentmanagement.dto.response.resident.NotificationsPageResponse;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.resident.ResidentNotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident")
@RequiredArgsConstructor
public class ResidentNotificationController {
    private final ResidentNotificationService residentNotificationService;

    // -- Notification 4 --
    @GetMapping("/notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<NotificationItemResponse>>> getNotifications(
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentNotificationService.getNotifications(userId, isRead, type, page, size)));
    }
    
    @PatchMapping("/notifications/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<NotificationItemResponse>> markNotificationRead(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentNotificationService.markNotificationAsRead(userId, id)));
    }
    @PatchMapping("/notifications/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<NotificationsPageResponse>> markAllNotificationsRead() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentNotificationService.markAllNotificationsAsRead(userId)));
    }

    @GetMapping("/announcements")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<AnnouncementResponse>>> getAnnouncements(
            @RequestParam(required = false) String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(residentNotificationService.getAnnouncements(userId, priority, page, size)));
    }
}

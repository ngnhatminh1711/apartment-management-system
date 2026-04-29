package com.apartmentmanagement.controller.admin;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.admin.AssignRoleRequest;
import com.apartmentmanagement.dto.request.admin.UserCreateRequest;
import com.apartmentmanagement.dto.request.admin.UserUpdateRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.UserResponse;
import com.apartmentmanagement.enums.RoleName;
import com.apartmentmanagement.service.admin.AdminUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService userService;

    /** GET /api/v1/admin/users */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAll(
            @RequestParam(required = false) RoleName role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Long buildingId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        return ResponseEntity.ok(ApiResponse.success(
                userService.getAll(role, isActive, buildingId, search, page, size, sort)));
    }

    /** GET /api/v1/admin/users/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getById(id)));
    }

    /** POST /api/v1/admin/users */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(
            @Valid @RequestBody UserCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo tài khoản thành công. Email đã được gửi.",
                        userService.create(req)));
    }

    /** PUT /api/v1/admin/users/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công",
                userService.update(id, req)));
    }

    /** PATCH /api/v1/admin/users/{id}/toggle-active */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleActive(@PathVariable Long id) {
        boolean isActive = userService.toggleActive(id);
        String msg = isActive ? "Tài khoản đã được kích hoạt" : "Tài khoản đã bị vô hiệu hóa";
        return ResponseEntity.ok(ApiResponse.success(msg,
                Map.of("id", id, "isActive", isActive)));
    }

    /** PATCH /api/v1/admin/users/{id}/reset-password */
    @PatchMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@PathVariable Long id) {
        userService.resetPassword(id);
        return ResponseEntity.ok(ApiResponse.success(
                "Mật khẩu mới đã được gửi qua email", null));
    }

    /** POST /api/v1/admin/users/{id}/roles */
    @PostMapping("/{id}/roles")
    public ResponseEntity<ApiResponse<UserResponse>> assignRole(
            @PathVariable Long id,
            @Valid @RequestBody AssignRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Gán role thành công",
                userService.assignRole(id, req)));
    }

    /** DELETE /api/v1/admin/users/{id}/roles/{roleId} */
    @DeleteMapping("/{id}/roles/{roleId}")
    public ResponseEntity<ApiResponse<UserResponse>> removeRole(
            @PathVariable Long id,
            @PathVariable Integer roleId) {
        return ResponseEntity.ok(ApiResponse.success("Thu hồi role thành công",
                userService.removeRole(id, roleId)));
    }
}
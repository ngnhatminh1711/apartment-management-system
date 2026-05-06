package com.apartmentmanagement.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.cloudinary.UploadResponse;
import com.apartmentmanagement.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload 1 ảnh (dùng cho avatar user, icon dịch vụ, ảnh thông báo...)
     *
     * POST /api/v1/upload/image?folder=avatars
     * Content-Type: multipart/form-data
     * Body: file = <image file>
     */
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String folder) {

        UploadResponse result = cloudinaryService.upload(file, folder);
        return ResponseEntity.ok(ApiResponse.success("Upload thành công", result));
    }

    /**
     * Upload nhiều ảnh cùng lúc (dùng cho attachments của ServiceRequest,
     * Announcement...)
     *
     * POST /api/v1/upload/images?folder=requests
     * Content-Type: multipart/form-data
     * Body: files = [file1, file2, ...]
     * Giới hạn: tối đa 5 ảnh / lần
     */
    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<UploadResponse>>> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(defaultValue = "general") String folder) {

        if (files.size() > 5) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<List<UploadResponse>>builder()
                            .success(false)
                            .message("Tối đa 5 ảnh mỗi lần upload")
                            .errorCode("5001")
                            .build());
        }

        List<UploadResponse> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(cloudinaryService.upload(file, folder));
        }

        return ResponseEntity.ok(ApiResponse.success(
                "Upload " + results.size() + " ảnh thành công", results));
    }

    /**
     * Xóa ảnh theo publicId
     *
     * DELETE /api/v1/upload/image?publicId=apartment-management/avatars/abc123
     */
    @DeleteMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @RequestParam String publicId) {
        cloudinaryService.delete(publicId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa ảnh", null));
    }
}
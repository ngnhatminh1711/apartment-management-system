package com.apartmentmanagement.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.apartmentmanagement.dto.response.cloudinary.UploadResponse;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:apartment-management}")
    private String baseFolder;

    // ── Các loại file được phép upload ─────────────────────────────────────
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png",
            "image/gif", "image/webp");

    // Giới hạn kích thước: 5MB
    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024L;

    // ── Upload ──────────────────────────────────────────────────────────────

    /**
     * Upload ảnh lên Cloudinary.
     *
     * @param file   File ảnh từ request
     * @param folder Sub-folder trên Cloudinary (vd: "avatars", "requests",
     *               "announcements")
     * @return UploadResponse chứa URL và metadata
     */
    @SuppressWarnings("unchecked")
    public UploadResponse upload(MultipartFile file, String folder) {
        // 1. Validate
        validateFile(file);

        // 2. Tạo public_id ngẫu nhiên để tránh trùng tên
        String publicId = baseFolder + "/" + folder + "/" + UUID.randomUUID();

        try {
            // 3. Upload lên Cloudinary
            Map<String, Object> params = ObjectUtils.asMap(
                    "public_id", publicId,
                    "overwrite", true,
                    "resource_type", "image",
                    // Tự động tối ưu chất lượng và định dạng
                    "quality", "auto",
                    "fetch_format", "auto",
                    // Eager transformation: tạo sẵn thumbnail 400x400
                    "eager", Arrays.asList(new Transformation<>().width(400).height(400).crop("fill")));

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);

            log.info("Upload thành công: publicId={}, url={}", publicId, result.get("secure_url"));

            return UploadResponse.builder()
                    .url((String) result.get("secure_url"))
                    .publicId((String) result.get("public_id"))
                    .format((String) result.get("format"))
                    .width(result.get("width") != null ? ((Number) result.get("width")).intValue() : null)
                    .height(result.get("height") != null ? ((Number) result.get("height")).intValue() : null)
                    .bytes(result.get("bytes") != null ? ((Number) result.get("bytes")).longValue() : null)
                    .build();

        } catch (IOException e) {
            log.error("Upload thất bại: {}", e.getMessage());
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    /**
     * Xóa ảnh khỏi Cloudinary theo publicId.
     * Dùng khi user đổi avatar hoặc xóa nội dung.
     */
    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank())
            return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Đã xóa ảnh: publicId={}", publicId);
        } catch (IOException e) {
            log.warn("Không thể xóa ảnh publicId={}: {}", publicId, e.getMessage());
            // Không throw – xóa thất bại không nên block luồng chính
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new AppException(ErrorCode.FILE_TYPE_NOT_ALLOWED);
        }
    }
}

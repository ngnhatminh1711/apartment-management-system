package com.apartmentmanagement.dto.response.cloudinary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    /** URL công khai của ảnh trên Cloudinary */
    private String url;

    /** Public ID – dùng để xóa ảnh sau này */
    private String publicId;

    /** Định dạng file: jpg, png, webp... */
    private String format;

    /** Chiều rộng (px) */
    private Integer width;

    /** Chiều cao (px) */
    private Integer height;

    /** Kích thước file (bytes) */
    private Long bytes;
}
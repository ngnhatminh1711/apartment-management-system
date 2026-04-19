package com.apartmentmanagement.dto.request.manager;

import java.time.LocalDateTime;
import java.util.List;

import com.apartmentmanagement.enums.AnnouncementPriority;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AnnouncementRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    @NotNull(message = "Mức độ ưu tiên không được để trống")
    private AnnouncementPriority priority;

    private List<String> attachmentUrls;

    /** NULL = thông báo không hết hạn */
    @Future(message = "Thời gian hết hạn phải là tương lai")
    private LocalDateTime expiresAt;
}
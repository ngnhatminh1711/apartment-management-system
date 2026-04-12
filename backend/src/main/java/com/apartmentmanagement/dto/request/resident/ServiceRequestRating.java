package com.apartmentmanagement.dto.request.resident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServiceRequestRating {
    @NotBlank(message = "Rating không được bỏ trống")
    private Integer rating;
    @Size(max = 200, message = "Bình luận không được vượt quá 200 ký tự")
    private String comment;
}

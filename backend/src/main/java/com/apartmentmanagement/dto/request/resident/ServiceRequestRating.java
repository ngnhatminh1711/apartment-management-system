package com.apartmentmanagement.dto.request.resident;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServiceRequestRating {
    @Min(1)
    @Max(5)
    private Integer rating;
    @Size(max = 200, message = "Bình luận không được vượt quá 200 ký tự")
    private String comment;
}

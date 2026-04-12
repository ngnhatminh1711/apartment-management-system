package com.apartmentmanagement.dto.request.resident;

import java.util.List;

import com.apartmentmanagement.enums.RequestPriority;
import com.apartmentmanagement.enums.RequestType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServiceRequest {
    private RequestType  requestType;
    @NotBlank(message = "Tiêu đề không được bỏ trống")
    @Size(max=200,message = "Tiêu đề tối đa 200 ký tự")
    private String title;
    @NotBlank(message = "Mô tả không được bỏ trống")
    @Size(max=500,message = "Mô tả tối đa 500 ký tự")
    private String description;
    private RequestPriority priority=RequestPriority.MEDIUM;
    @Size(max=5,message = "tối đa 5 ảnh")
    private List<String> attachmentUrls;
}

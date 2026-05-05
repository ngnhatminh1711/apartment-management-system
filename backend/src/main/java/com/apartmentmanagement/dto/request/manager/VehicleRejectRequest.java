package com.apartmentmanagement.dto.request.manager;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VehicleRejectRequest {

    @NotBlank(message = "Lý do từ chối không được để trống")
    private String rejectionReason;
}
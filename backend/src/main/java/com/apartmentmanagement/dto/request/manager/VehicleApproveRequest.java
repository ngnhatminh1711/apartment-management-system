package com.apartmentmanagement.dto.request.manager;

import java.time.LocalDate;

import lombok.Data;

@Data
public class VehicleApproveRequest {
    private String notes;
    private LocalDate expiredAt;
}
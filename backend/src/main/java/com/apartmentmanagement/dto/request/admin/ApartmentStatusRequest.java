package com.apartmentmanagement.dto.request.admin;

import com.apartmentmanagement.enums.ApartmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApartmentStatusRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private ApartmentStatus status;

    private String notes;
}
package com.apartmentmanagement.dto.request.manager;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignResidentRequest {

    @NotNull(message = "userId không được để trống")
    private Long userId;

    @NotNull(message = "isPrimary không được để trống")
    private Boolean isPrimary;

    @NotNull(message = "Ngày vào không được để trống")
    private LocalDate moveInDate;

    private String notes;
}

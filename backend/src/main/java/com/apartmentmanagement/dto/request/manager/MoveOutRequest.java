package com.apartmentmanagement.dto.request.manager;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class MoveOutRequest {

    @NotNull(message = "Ngày chuyển đi không được để trống")
    private LocalDate moveOutDate;

    private String notes;
}
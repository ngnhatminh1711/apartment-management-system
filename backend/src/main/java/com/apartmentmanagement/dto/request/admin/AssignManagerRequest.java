package com.apartmentmanagement.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignManagerRequest {

    @NotNull(message = "ID Manager không được để trống")
    private Long managerId;
}

package com.apartmentmanagement.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignRoleRequest {

    @NotNull(message = "ID role không được để trống")
    private Integer roleId;
}
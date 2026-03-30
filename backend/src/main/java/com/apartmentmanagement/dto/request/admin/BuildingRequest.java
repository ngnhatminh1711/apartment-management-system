package com.apartmentmanagement.dto.request.admin;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BuildingRequest {

    @NotBlank(message = "Tên tòa nhà không được để trống")
    @Size(max = 100, message = "Tên tòa nhà tối đa 100 ký tự")
    private String name;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotNull(message = "Số tầng không được để trống")
    @Min(value = 1, message = "Số tầng tối thiểu là 1")
    @Max(value = 200, message = "Số tầng tối đa là 200")
    private Integer numFloors;

    @NotNull(message = "Số căn hộ không được để trống")
    @Min(value = 1, message = "Số căn hộ tối thiểu là 1")
    private Integer numApartments;

    private String description;

    private Long managerId;
}

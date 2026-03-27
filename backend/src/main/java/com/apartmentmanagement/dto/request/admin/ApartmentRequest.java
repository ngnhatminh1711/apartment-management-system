package com.apartmentmanagement.dto.request.admin;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApartmentRequest {

    @NotNull(message = "ID tòa nhà không được để trống")
    private Long buildingId;

    @NotBlank(message = "Số căn hộ không được để trống")
    @Size(max = 10, message = "Số căn hộ tối đa 10 ký tự")
    private String apartmentNumber;

    @NotNull(message = "Tầng không được để trống")
    @Min(value = 1, message = "Tầng tối thiểu là 1")
    private Integer floor;

    @NotNull(message = "Diện tích không được để trống")
    @DecimalMin(value = "10.0", message = "Diện tích tối thiểu là 10m2")
    private BigDecimal areaM2;

    @NotNull(message = "Số phòng ngủ không được để trống")
    @Min(0)
    @Max(10)
    private Integer numBedrooms;

    @NotNull(message = "Số phòng tắm không được để trống")
    @Min(0)
    @Max(10)
    private Integer numBathrooms;
    
    @Size(max = 20)
    private String direction;
    
    private String notes;
}

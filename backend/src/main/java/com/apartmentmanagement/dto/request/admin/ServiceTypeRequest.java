package com.apartmentmanagement.dto.request.admin;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServiceTypeRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống")
    @Size(max = 100, message = "Tên tối đa 100 ký tự")
    private String name;

    private String description;

    @NotNull(message = "Phí hàng tháng không được để trống")
    @DecimalMin(value = "0.0", message = "Phí không được âm")
    private BigDecimal monthlyFee;

    @Size(max = 500)
    private String iconUrl;
}
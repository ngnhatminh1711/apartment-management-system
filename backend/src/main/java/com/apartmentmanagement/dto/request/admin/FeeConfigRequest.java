package com.apartmentmanagement.dto.request.admin;

import com.apartmentmanagement.enums.FeeType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FeeConfigRequest {

    @NotNull(message = "ID tòa nhà không được để trống")
    private Long buildingId;

    @NotNull(message = "Loại phí không được để trống")
    private FeeType feeType;

    @NotNull(message = "Đơn giá không được để trống")
    @DecimalMin(value = "0.0", message = "Đơn giá không được âm")
    private BigDecimal unitPrice;

    @NotBlank(message = "Đơn vị không được để trống")
    @Size(max = 20)
    private String unit;

    @NotNull(message = "Ngày áp dụng không được để trống")
    @FutureOrPresent(message = "Ngày áp dụng không được là ngày quá khứ")
    private LocalDate effectiveFrom;

    @Size(max = 200)
    private String description;
}
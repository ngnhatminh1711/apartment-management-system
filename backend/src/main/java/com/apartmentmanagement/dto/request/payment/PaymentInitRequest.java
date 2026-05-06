package com.apartmentmanagement.dto.request.payment;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentInitRequest {

    @NotNull(message = "ID hóa đơn không được để trống")
    private Long billId;

    /**
     * Số tiền thanh toán – có thể thanh toán một phần.
     * Nếu null, hệ thống tự tính remainingAmount.
     */
    private BigDecimal amount;
}

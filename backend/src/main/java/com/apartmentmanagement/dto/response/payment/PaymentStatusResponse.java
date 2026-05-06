package com.apartmentmanagement.dto.response.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.apartmentmanagement.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {

    private Long paymentId;
    private PaymentStatus status;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private String transactionRef;
    private String message;
}
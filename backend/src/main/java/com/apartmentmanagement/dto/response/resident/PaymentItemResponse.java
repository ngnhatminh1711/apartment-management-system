package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;
import java.time.LocalDateTime;



import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentItemResponse {
    private Long id;
    private String status;
    private String paymentMethod;
    private String transactionRef;
    private String paymentNote;
    private LocalDateTime paidAt;
    private BigDecimal amount;
    private BillItemResponse bill;
}

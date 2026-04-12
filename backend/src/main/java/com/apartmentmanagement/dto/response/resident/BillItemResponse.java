package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.apartmentmanagement.entity.BillItem;
import com.apartmentmanagement.entity.Payment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BillItemResponse {
    private Long id;
    private String billingMonth;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal remainingAmount;
    private String status;
    private LocalDate dueDate;
    private Boolean isOverdue;
    private List<BillItem> items;
    private List<Payment> payments;
}

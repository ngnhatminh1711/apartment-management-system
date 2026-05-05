package com.apartmentmanagement.dto.response.admin;

import java.math.BigDecimal;
import java.util.List;

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
public class DebtReportResponse {

    private String asOfDate;
    private DebtSummary summary;
    private List<Debtor> debtors;

    @Getter
    @Builder
    public static class DebtSummary {
        private long totalDebtors;
        private BigDecimal totalDebtAmount;
        private long overdueCount;
    }

    @Getter
    @Builder
    public static class Debtor {
        private Long apartmentId;
        private String apartmentNumber;
        private String buildingName;
        private String residentName;
        private String residentPhone;
        private BigDecimal totalDebt;
        private List<BillRef> outstandingBills;
    }

    @Getter
    @Builder
    public static class BillRef {
        private Long billId;
        private String billingMonth;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private String dueDate;
        private long daysOverdue;
    }
}
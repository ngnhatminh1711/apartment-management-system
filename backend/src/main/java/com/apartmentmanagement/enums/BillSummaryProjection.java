package com.apartmentmanagement.enums;

import java.math.BigDecimal;

public interface BillSummaryProjection {
    Long getTotalBills();

    Long getPaidBills();

    Long getPendingPartialBills();

    Long getOverdueBills();

    BigDecimal getTotalAmount();

    BigDecimal getPaidAmount();
}
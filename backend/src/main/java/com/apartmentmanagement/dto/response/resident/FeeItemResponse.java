package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;

import com.apartmentmanagement.enums.FeeType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeeItemResponse {
    public FeeType feeType;
    public String description;
    public BigDecimal readingStart;
    public BigDecimal readingEnd;
    public BigDecimal quantity;
    public BigDecimal unitPrice;
    public BigDecimal amount;
}

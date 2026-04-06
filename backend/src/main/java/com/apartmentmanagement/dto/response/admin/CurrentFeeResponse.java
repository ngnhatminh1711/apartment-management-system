package com.apartmentmanagement.dto.response.admin;

import com.apartmentmanagement.enums.FeeType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CurrentFeeResponse {

    private Long   buildingId;
    private String buildingName;
    private LocalDate effectiveDate;
    private Map<FeeType, FeeEntry> fees;

    @Getter @Builder
    public static class FeeEntry {
        private BigDecimal unitPrice;
        private String     unit;
    }
}
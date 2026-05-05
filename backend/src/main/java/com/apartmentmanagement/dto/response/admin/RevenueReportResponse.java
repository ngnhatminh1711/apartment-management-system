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
public class RevenueReportResponse {

    private Summary summary;
    private List<Period> breakdown;

    @Getter
    @Builder
    public static class Summary {
        private BigDecimal totalBilled;
        private BigDecimal totalCollected;
        private BigDecimal totalOutstanding;
        private double collectionRate;
    }

    @Getter
    @Builder
    public static class Period {
        private String period;
        private BigDecimal totalBilled;
        private BigDecimal totalCollected;
        private BigDecimal outstanding;
        private double collectionRate;
    }
}
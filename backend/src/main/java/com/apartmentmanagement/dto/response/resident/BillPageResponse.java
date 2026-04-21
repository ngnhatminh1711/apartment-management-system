package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BillPageResponse {
    @Data
    @Builder
    public static class Summary {
        private BigDecimal totalOutstanding;
        private Long overdueCount;
    }
}
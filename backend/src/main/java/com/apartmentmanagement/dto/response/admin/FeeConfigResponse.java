package com.apartmentmanagement.dto.response.admin;

import com.apartmentmanagement.entity.FeeConfig;
import com.apartmentmanagement.enums.FeeType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class FeeConfigResponse {

    private Long          id;
    private Long          buildingId;
    private String        buildingName;
    private FeeType       feeType;
    private BigDecimal    unitPrice;
    private String        unit;
    private LocalDate     effectiveFrom;
    private LocalDate     effectiveTo;
    private String        description;
    private CreatorRef    createdBy;
    private LocalDateTime createdAt;

    @Getter @Builder
    public static class CreatorRef {
        private Long   id;
        private String fullName;
    }

    public static FeeConfigResponse from(FeeConfig fc) {
        return FeeConfigResponse.builder()
                .id(fc.getId())
                .buildingId(fc.getBuilding().getId())
                .buildingName(fc.getBuilding().getName())
                .feeType(fc.getFeeType())
                .unitPrice(fc.getUnitPrice())
                .unit(fc.getUnit())
                .effectiveFrom(fc.getEffectiveFrom())
                .effectiveTo(fc.getEffectiveTo())
                .description(fc.getDescription())
                .createdBy(fc.getCreatedBy() == null ? null : CreatorRef.builder()
                        .id(fc.getCreatedBy().getId())
                        .fullName(fc.getCreatedBy().getFullName())
                        .build())
                .createdAt(fc.getCreatedAt())
                .build();
    }
}
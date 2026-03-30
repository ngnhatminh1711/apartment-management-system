package com.apartmentmanagement.dto.response.manager;

import java.math.BigDecimal;

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
public class ResidentResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String idCard;
    private String avatarUrl;
    private ApartmentRef apartment;
    private Boolean isPrimary;
    private String moveInDate;
    private BigDecimal outStandingDebt;
    private Integer vehicleCount;

    @Getter
    @Builder
    public static class ApartmentRef {
        private Long id;
        private String apartmentNumber;
        private Integer floor;
    }
}

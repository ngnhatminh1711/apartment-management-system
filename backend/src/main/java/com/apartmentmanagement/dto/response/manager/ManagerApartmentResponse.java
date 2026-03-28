package com.apartmentmanagement.dto.response.manager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.apartmentmanagement.enums.ApartmentStatus;

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
public class ManagerApartmentResponse {

    private Long id;
    private String apartmentNumber;
    private Integer floor;
    private BigDecimal areaM2;
    private Integer numBedrooms;
    private Integer numBathrooms;
    private ApartmentStatus status;
    private List<ResidentRef> currentResidents;
    private Integer pendingBillCount;
    private Integer pendingRequestCount;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class ResidentRef {
        private Long id;
        private String fullName;
        private String phone;
        private Boolean isPrimary;
        private String moveInDate;
    }
}

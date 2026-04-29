package com.apartmentmanagement.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.apartmentmanagement.entity.Apartment;
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
public class ApartmentResponse {

    private Long id;
    private Long buildingId;
    private String buildingName;
    private String apartmentNumber;
    private Integer floor;
    private BigDecimal areaM2;
    private Integer numBedrooms;
    private Integer numBathrooms;
    private String direction;
    private ApartmentStatus status;
    private String notes;
    private ResidentRef currentResident;
    private List<ResidentRef> currentResidents;
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

    public static ApartmentResponse from(Apartment a, List<ResidentRef> residents) {
        List<ResidentRef> currentResidents = residents == null ? List.of() : residents;

        return ApartmentResponse.builder()
                .id(a.getId())
                .buildingId(a.getBuilding().getId())
                .buildingName(a.getBuilding().getName())
                .apartmentNumber(a.getApartmentNumber())
                .floor(a.getFloor())
                .areaM2(a.getAreaM2())
                .numBedrooms(a.getNumBedrooms())
                .numBathrooms(a.getNumBathrooms())
                .direction(a.getDirection())
                .status(a.getStatus())
                .notes(a.getNotes())
                .currentResidents(currentResidents)
                .createdAt(a.getCreatedAt())
                .build();
    }
}

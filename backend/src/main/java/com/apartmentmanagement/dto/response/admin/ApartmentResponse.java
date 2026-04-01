package com.apartmentmanagement.dto.response.admin;

import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.enums.ApartmentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter 
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentResponse {

    private Long            id;
    private Long            buildingId;
    private String          buildingName;
    private String          apartmentNumber;
    private Integer         floor;
    private BigDecimal      areaM2;
    private Integer         numBedrooms;
    private Integer         numBathrooms;
    private String          direction;
    private ApartmentStatus status;
    private String          notes;
    private ResidentRef     currentResident;
    private LocalDateTime   createdAt;

    @Getter @Builder
    public static class ResidentRef {
        private Long   id;
        private String fullName;
        private String phone;
        private Boolean isPrimary;
        private String moveInDate;
    }

    public static ApartmentResponse from(Apartment a, ResidentRef resident) {
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
                .currentResident(resident)
                .createdAt(a.getCreatedAt())
                .build();
    }
}
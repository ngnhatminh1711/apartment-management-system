package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentResponse {
    private Long id;
    private String apartmentNumber;
    private Integer floor;
    private String buildingName;
    private Boolean isPrimary;
    private LocalDate moveInDate;
    private BigDecimal areaM2;
    private Integer numBedrooms;
    private Integer numBathrooms;
    private String direction;
    private BuildingRespone building;
    private List<HouseMembersResponse> householdMembers;
}
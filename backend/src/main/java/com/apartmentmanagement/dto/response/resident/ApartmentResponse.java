package com.apartmentmanagement.dto.response.resident;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Getter
@Setter
@Builder
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
    private BuildingRespone buildingRespone;
    private List<HouseMembersResponse> householdMembers;
}
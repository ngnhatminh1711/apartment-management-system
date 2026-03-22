package com.apartmentmanagement.dto.response;

import java.time.LocalDate;

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
}

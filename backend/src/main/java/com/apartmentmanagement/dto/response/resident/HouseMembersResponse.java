package com.apartmentmanagement.dto.response.resident;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@Builder

public class HouseMembersResponse {
    private Long id;
    private String fullName;
    @JsonProperty("isPrimary")
    private boolean isPrimary;
    private LocalDate moveInDate;
}

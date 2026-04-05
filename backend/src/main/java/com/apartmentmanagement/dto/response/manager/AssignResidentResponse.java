package com.apartmentmanagement.dto.response.manager;

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
public class AssignResidentResponse {
    private Long id;
    private Long apartmentId;
    private String apartmentNumber;
    private Long userId;
    private String fullName;
    private Boolean isPrimary;
    private String moveInDate;
}

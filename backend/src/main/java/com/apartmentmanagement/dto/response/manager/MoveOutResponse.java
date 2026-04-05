package com.apartmentmanagement.dto.response.manager;

import com.apartmentmanagement.enums.ApartmentStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoveOutResponse {
    private Long residentId;
    private String fullName;
    private String moveOutDate;
    private ApartmentStatus apartmentStatus;
}
package com.apartmentmanagement.dto.response.resident;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@Builder
public class HouseMembersResponse {
    private Long id;
    private String fullName;
    private boolean isPrimary;
    private LocalDate moveInDate;
}

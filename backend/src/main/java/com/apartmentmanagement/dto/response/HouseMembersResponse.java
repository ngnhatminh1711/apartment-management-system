package com.apartmentmanagement.dto.response;

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

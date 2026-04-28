package com.apartmentmanagement.dto.request.resident;

import lombok.Data;


@Data

public class ServiceRegistrationRequest {
    private Long serviceTypeId;
    private String notes; 
}

package com.apartmentmanagement.dto.request.resident;

import lombok.Data;

@Data

public class ServiceRegistrationRequest {
    private Integer serviceTypeId;
    private String notes;
}

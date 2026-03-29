package com.apartmentmanagement.dto.request;

import lombok.Data;


@Data

public class ServiceRegistrationRequest {
    private Long serviceTypeId;
    private String notes; 
}

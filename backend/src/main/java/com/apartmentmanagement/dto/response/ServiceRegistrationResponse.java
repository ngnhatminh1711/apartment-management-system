package com.apartmentmanagement.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.apartmentmanagement.entity.ServiceType;
import com.apartmentmanagement.enums.RegistrationStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ServiceRegistrationResponse {
    private Long id;
    private ServiceType serviceType;
    private RegistrationStatus status;
    private LocalDateTime registeredAt;
    private LocalDate startDate;
    private LocalDate endDate;
}

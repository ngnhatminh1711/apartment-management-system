package com.apartmentmanagement.dto.response;

import java.math.BigDecimal;

import com.apartmentmanagement.entity.ServiceRegistration;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ServiceTypeResponse {
    private Integer id;
    private String name;
    private String description;
    private BigDecimal monthlyFee;
    private String iconUrl;
    private Boolean isRegistered;
    private ServiceRegistration myRegistration;
}

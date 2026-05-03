package com.apartmentmanagement.dto.response.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.apartmentmanagement.entity.ServiceType;

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
public class ServiceTypeResponse {

    private Integer id;
    private String name;
    private String description;
    private BigDecimal monthlyFee;
    private Boolean isActive;
    private String iconUrl;
    private long totalRegistrations;
    private LocalDateTime createdAt;

    public static ServiceTypeResponse from(ServiceType st, long totalRegistrations) {
        return ServiceTypeResponse.builder()
                .id(st.getId())
                .name(st.getName())
                .description(st.getDescription())
                .monthlyFee(st.getMonthlyFee())
                .isActive(st.getIsActive())
                .iconUrl(st.getIconUrl())
                .totalRegistrations(totalRegistrations)
                .createdAt(st.getCreatedAt())
                .build();
    }
}
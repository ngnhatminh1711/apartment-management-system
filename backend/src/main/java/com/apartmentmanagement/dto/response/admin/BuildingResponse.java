package com.apartmentmanagement.dto.response.admin;

import java.time.LocalDateTime;

import com.apartmentmanagement.entity.Building;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildingResponse {
    
    private Long id;
    private String name;
    private String address;
    private int numFloors;
    private int numApartments;
    private String description;
    private Boolean isActive;
    private ManagerRef manager;
    private Stats stats;
    private LocalDateTime createdAt;

    @Getter @Builder
    public static class ManagerRef {
        private Long id;
        private String fullName;
        private String email;
    }

    @Getter @Builder
    public static class Stats {
        private long totalApartments;
        private long occupiedApartments;
        private long availableApartments;
        private long maintenanceApartments;
    }

    public static BuildingResponse from(Building b, Stats stats) {
        return BuildingResponse.builder()
                .id(b.getId())
                .name(b.getName())
                .address(b.getAddress())
                .numFloors(b.getNumFloors())
                .numApartments(b.getNumApartments())
                .description(b.getDescription())
                .isActive(b.getIsActive())
                .manager(b.getManager() == null ? null : ManagerRef.builder()
                        .id(b.getManager().getId())
                        .fullName(b.getManager().getFullName())
                        .email(b.getManager().getEmail())
                        .build())
                    .stats(stats)
                    .createdAt(b.getCreatedAt())
                    .build();
    }
}

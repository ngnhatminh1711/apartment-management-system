package com.apartmentmanagement.dto.response.manager;

import java.time.LocalDateTime;

import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;

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
public class ManagerVehicleResponse {
    private Long id;
    private OwnerRef owner;
    private String apartmentNumber;
    private VehicleType vehicleType;
    private String licensePlate;
    private String brand;
    private String model;
    private String color;
    private VehicleStatus status;
    private LocalDateTime registeredAt;
    private String rejectionReason;

    @Getter
    @Builder
    public static class OwnerRef {
        private Long id;
        private String fullName;
        private String phone;
    }
}
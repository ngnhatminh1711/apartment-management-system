package com.apartmentmanagement.dto.response.resident;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.*;

@Getter
@Setter
@Builder
public class VehicleResponse {
    private Long id;
    private String vehicleType;
    private String licensePlate;
    private String brand;
    private String model;
    private String color;
    private String status;
    private LocalDateTime registeredAt;
    private LocalDateTime approvedAt;
    private LocalDate expiredAt;

}

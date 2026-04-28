package com.apartmentmanagement.dto.request.resident;

import com.apartmentmanagement.enums.VehicleType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateVehicleRequest {
    private VehicleType vehicleType;
    @NotBlank(message = "License Plate không được bỏ trống")
    private String licensePlate;
    @Size(max=50,message = "Tối đa 50 ký tự")
    private String brand;
    @Size(max=50,message = "Tối đa 50 ký tự")
    private String model;
    @Size(max=50,message = "Tối đa 50 ký tự")
    private String color;
}

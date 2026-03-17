package com.apartmentmanagement.enums;

public enum VehicleType {
    MOTORBIKE("Xe máy"),
    CAR("Ô tô"),
    BICYCLE("Xe đạp"),
    TRUCK("Xe tải");

    private final String displayName;

    VehicleType(String displayName) {
        this.displayName = displayName;

    }
}

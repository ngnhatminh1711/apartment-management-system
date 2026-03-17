package com.apartmentmanagement.enums;

import lombok.Getter;

@Getter
public enum FeeType {

    ELECTRICITY("kWh", "Tiền điện"),
    WATER("m3", "Tiền nước"),
    MANAGEMENT("tháng", "Phí quản lý"),
    PARKING_MOTORBIKE("xe/tháng", "Phí gửi xe máy"),
    PARKING_CAR("xe/tháng", "Phí gửi ô tô"),
    GARBAGE("tháng", "Phí rác thải"),
    INTERNET("tháng", "Phí internet"),
    ELEVATOR("tháng", "Phí thang máy");

    private final String defaultUnit;

    private final String displayName;

    FeeType(String defaultUnit, String displayName) {
        this.defaultUnit = defaultUnit;
        this.displayName = displayName;
    }

}

package com.apartmentmanagement.enums;

public enum RequestPriority {
    LOW(1, "Thấp"),
    MEDIUM(2, "Trung bình"),
    HIGH(3, "Cao"),
    URGENT(4, "Khẩn cấp");

    private final int level;
    private final String displayName;

    RequestPriority(int level, String displayName) {
        this.level = level;
        this.displayName = displayName;
    }

}

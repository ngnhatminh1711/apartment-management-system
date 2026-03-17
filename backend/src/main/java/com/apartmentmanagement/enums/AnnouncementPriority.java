package com.apartmentmanagement.enums;

public enum AnnouncementPriority {
    NORMAL("Thông thường"),
    IMPORTANT("Quan trọng"),
    URGENT("Khẩn cấp");

    private final String displayName;

    AnnouncementPriority(String displayName) {
        this.displayName = displayName;
    }

}

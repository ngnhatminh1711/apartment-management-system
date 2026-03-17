package com.apartmentmanagement.enums;

public enum RequestType {
    MAINTENANCE("Yêu cầu sữa chửa"),
    COMPLAINT("Phản ánh / Khiếu nại"),
    INQUIRY("Câu hỏi / Thắc mắc"),
    AMENITY("Yêu cầu tiện ích"),
    OTHER("Khác");

    private final String displayName;

    RequestType(String displayName) {
        this.displayName = displayName;
    }
}

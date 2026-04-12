package com.apartmentmanagement.dto.response.resident;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class NotificationsPageResponse {
    private Long unreadCount;
    private String message;
}

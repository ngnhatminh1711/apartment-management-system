package com.apartmentmanagement.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class NotificationsPageResponse {
    private Long unreadCount;
    private List<NotificationItemResponse> content;
    private long totalElements;
    private int totalPages;
}

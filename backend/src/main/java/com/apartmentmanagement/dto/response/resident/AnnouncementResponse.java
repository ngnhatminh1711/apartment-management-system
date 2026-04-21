package com.apartmentmanagement.dto.response.resident;

import java.time.LocalDateTime;
import java.util.List;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private String priority;
    private String senderName;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    private List<String> attachmentUrls;
}

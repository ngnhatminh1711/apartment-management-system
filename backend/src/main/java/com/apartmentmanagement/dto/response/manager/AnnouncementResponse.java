package com.apartmentmanagement.dto.response.manager;

import java.time.LocalDateTime;
import java.util.List;

import com.apartmentmanagement.enums.AnnouncementPriority;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementResponse {
    private Long id;
    private String title;
    private String content;
    private AnnouncementPriority priority;
    private Boolean isPublished;
    public List<String> attachmentUrls;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

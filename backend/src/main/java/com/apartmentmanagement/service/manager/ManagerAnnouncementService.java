package com.apartmentmanagement.service.manager;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.manager.AnnouncementRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.manager.AnnouncementResponse;
import com.apartmentmanagement.entity.Announcement;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.enums.AnnouncementPriority;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.AnnouncementRepository;
import com.apartmentmanagement.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerAnnouncementService {

    private final ManagerBuildingHelper buildingHelper;
    private final AnnouncementRepository announcementRepo;

    @Transactional(readOnly = true)
    public PageResponse<AnnouncementResponse> getAll(Boolean isPublished, AnnouncementPriority priority, String search,
            int page, int size) {
        Long buildingId = buildingHelper.getMyBuildingId();
        var pageData = announcementRepo.findByBuilding(buildingId, isPublished, priority, search,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt")));
        return PageResponse.of(pageData, this::toResponse);
    }

    @Transactional(readOnly = true)
    public AnnouncementResponse getById(Long id) {
        Long buildingId = buildingHelper.getMyBuildingId();
        Announcement a = findInMyBuilding(id, buildingId);
        return toResponse(a);
    }

    @Transactional
    public AnnouncementResponse create(AnnouncementRequest req) {
        Building building = buildingHelper.getMyBuilding();

        Announcement a = Announcement.builder()
                .title(req.getTitle())
                .content(req.getContent())
                .priority(req.getPriority())
                .attachmentUrls(req.getAttachmentUrls() != null ? req.getAttachmentUrls() : List.of())
                .expiresAt(req.getExpiresAt())
                .building(building)
                .sender(SecurityUtils.getCurrentUser())
                .isPublished(true)
                .publishedAt(LocalDateTime.now())
                .build();

        return toResponse(announcementRepo.save(a));
    }

    private Announcement findInMyBuilding(Long id, Long buildingId) {
        return announcementRepo.findById(id)
                .filter(a -> a.getBuilding() != null && a.getBuilding().getId().equals(buildingId))
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
    }

    private AnnouncementResponse toResponse(Announcement a) {
        return AnnouncementResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .content(a.getContent())
                .priority(a.getPriority())
                .isPublished(a.getIsPublished())
                .attachmentUrls(a.getAttachmentUrls())
                .publishedAt(a.getPublishedAt())
                .expiresAt(a.getExpiresAt())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}

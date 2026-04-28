package com.apartmentmanagement.service.resident;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.AnnouncementResponse;
import com.apartmentmanagement.dto.response.resident.NotificationItemResponse;
import com.apartmentmanagement.dto.response.resident.NotificationsPageResponse;
import com.apartmentmanagement.entity.Announcement;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.AnnouncementPriority;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.AnnouncementRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentNotificationService {
    private final NotificationRepository notificationRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;
    private final AnnouncementRepository announcementRepository;
    // -- Notification 4 --


    @Transactional(readOnly = true)
    public PageResponse<NotificationItemResponse> getNotifications(Long userId,Boolean isRead ,String type,int page,int size ){ 
        NotificationType notificationType;
        try {
            notificationType=type!=null? NotificationType.valueOf(type.toUpperCase()): null;
        } catch (Exception e) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
        Pageable pageable = PageRequest.of(page,size,Sort.by("createdAt").descending());
        Page<Notification> pageNotifications=notificationRepository.findByUserIdAndFilters(userId,isRead,notificationType,pageable);
        long unreadCount=notificationRepository.countByUser_IdAndIsReadFalse(userId);
        
        PageResponse<NotificationItemResponse> pageResponse=PageResponse.of(pageNotifications, p -> NotificationItemResponse.builder()
                    .id(p.getId())
                    .title(p.getTitle())
                    .content(p.getContent())
                    .type(p.getType().name())
                    .referenceType(p.getReferenceType())
                    .referenceId(p.getReferenceId())
                    .isRead(p.getIsRead())
                    .createdAt(p.getCreatedAt())
                    .build()
        );
        pageResponse.setUnreadCount(unreadCount);
        return pageResponse;
    }

    @Transactional
    public NotificationItemResponse markNotificationAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        if (!notification.getIsRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
        }
        return NotificationItemResponse.builder()
                .id(notification.getId())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }
    
    @Transactional
    public NotificationsPageResponse markAllNotificationsAsRead(Long userId) {
            
        List<Notification> notifications = notificationRepository.findByUser_Id(userId);
        if (notifications.isEmpty()) 
            throw new AppException(ErrorCode.NOTIFICATION_NOT_FOUND);
        long unreadCount=notificationRepository.countByUser_IdAndIsReadFalse(userId);
        for (Notification notification : notifications) {
            notification.markAsRead();
        }
        notificationRepository.saveAll(notifications);
        return NotificationsPageResponse.builder()
                .unreadCount(unreadCount)
                .message("All notifications marked as read")
                .build();
    }
    @Transactional(readOnly = true)
    public PageResponse<AnnouncementResponse> getAnnouncements(Long userId,String priority ,int page,int size ){ 
        ApartmentResident apartmentResident=apartmentResidentRepository.findByUser_Id(userId)
            .orElseThrow(()-> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        User userSender = apartmentResident.getApartment().getBuilding().getManager();
        AnnouncementPriority priorityType;
        try {
            priorityType=(priority!=null)? AnnouncementPriority.valueOf(priority.toUpperCase()): null;
        } catch (Exception e) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
        Pageable pageable = PageRequest.of(page,size,Sort.by("publishedAt").descending());
        Page<Announcement> pageAnnoucements=announcementRepository.findByUserSenderIdAndPriority(userSender.getId(),priorityType,pageable);
        
        PageResponse<AnnouncementResponse> pageResponse=PageResponse.of(pageAnnoucements, p -> AnnouncementResponse.builder()
                    .id(p.getId())
                    .title(p.getTitle())
                    .content(p.getContent())
                    .priority(p.getPriority().name())
                    .publishedAt(p.getCreatedAt())
                    .expiresAt(p.getExpiresAt())
                    .senderName(p.getSender().getFullName())
                    .build()
        );
        return pageResponse;
    }
}

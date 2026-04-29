package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.AnnouncementResponse;
import com.apartmentmanagement.dto.response.resident.NotificationItemResponse;
import com.apartmentmanagement.dto.response.resident.NotificationsPageResponse;
import com.apartmentmanagement.entity.Announcement;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.AnnouncementPriority;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.AnnouncementRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;

@ExtendWith(MockitoExtension.class)
class ResidentNotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private AnnouncementRepository announcementRepository;

    @InjectMocks
    private ResidentNotificationService residentNotificationService;

    @Test
    void getNotifications_returnsMappedPageAndUnreadCount() {
        Notification notification = Notification.builder()
                .id(1L)
                .title("Bill")
                .content("New bill")
                .type(NotificationType.BILL_CREATED)
                .referenceType("bills")
                .referenceId(2L)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(notificationRepository.findByUserIdAndFilters(eq(99L), eq(false), eq(NotificationType.BILL_CREATED), any()))
                .thenReturn(new PageImpl<>(List.of(notification)));
        when(notificationRepository.countByUser_IdAndIsReadFalse(99L)).thenReturn(3);

        PageResponse<NotificationItemResponse> response =
                residentNotificationService.getNotifications(99L, false, "bill_created", 0, 10);

        assertEquals(1, response.getContent().size());
        assertEquals("BILL_CREATED", response.getContent().get(0).getType());
        assertEquals(3L, response.getUnreadCount());
    }

    @Test
    void markNotificationAsRead_marksUnreadNotificationAndSaves() {
        Notification notification = Notification.builder().id(1L).isRead(false).createdAt(LocalDateTime.now()).build();
        when(notificationRepository.findByIdAndUser_Id(1L, 99L)).thenReturn(Optional.of(notification));

        NotificationItemResponse response = residentNotificationService.markNotificationAsRead(99L, 1L);

        assertEquals(true, response.getIsRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAllNotificationsAsRead_whenNoNotifications_throwsNotFound() {
        when(notificationRepository.findByUser_Id(99L)).thenReturn(List.of());

        AppException exception = assertThrows(AppException.class,
                () -> residentNotificationService.markAllNotificationsAsRead(99L));

        assertEquals(ErrorCode.NOTIFICATION_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void markAllNotificationsAsRead_marksAllAndReturnsMessage() {
        Notification notification = Notification.builder().id(1L).isRead(false).build();
        when(notificationRepository.findByUser_Id(99L)).thenReturn(List.of(notification));
        when(notificationRepository.countByUser_IdAndIsReadFalse(99L)).thenReturn(1);

        NotificationsPageResponse response = residentNotificationService.markAllNotificationsAsRead(99L);

        assertEquals(1L, response.getUnreadCount());
        assertEquals("All notifications marked as read", response.getMessage());
        assertEquals(true, notification.getIsRead());
        verify(notificationRepository).saveAll(List.of(notification));
    }

    @Test
    void getAnnouncements_returnsAnnouncementsFromResidentBuildingManager() {
        User manager = User.builder().id(7L).fullName("Manager").build();
        ApartmentResident resident = ApartmentResident.builder()
                .apartment(Apartment.builder().building(Building.builder().manager(manager).build()).build())
                .build();
        Announcement announcement = Announcement.builder()
                .id(1L)
                .title("Notice")
                .content("Content")
                .priority(AnnouncementPriority.IMPORTANT)
                .sender(manager)
                .createdAt(LocalDateTime.now())
                .build();

        when(apartmentResidentRepository.findByUser_Id(99L)).thenReturn(Optional.of(resident));
        when(announcementRepository.findByUserSenderIdAndPriority(eq(7L), eq(AnnouncementPriority.IMPORTANT), any()))
                .thenReturn(new PageImpl<>(List.of(announcement)));

        PageResponse<AnnouncementResponse> response =
                residentNotificationService.getAnnouncements(99L, "important", 0, 10);

        assertEquals(1, response.getContent().size());
        assertEquals("IMPORTANT", response.getContent().get(0).getPriority());
        assertEquals("Manager", response.getContent().get(0).getSenderName());
    }
}

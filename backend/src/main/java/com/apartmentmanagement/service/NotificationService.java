package com.apartmentmanagement.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;

    @Async
    public void createNotification(User user, String title, String content, NotificationType type, String refType,
            Long refId) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .referenceType(refType)
                .referenceId(refId)
                .isRead(false)
                .build();
        notificationRepo.save(n);
    }
}

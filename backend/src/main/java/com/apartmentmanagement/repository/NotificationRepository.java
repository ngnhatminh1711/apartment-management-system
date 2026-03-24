package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Notification;



@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer>{
    int countByUserIdAndIsReadFalse(Long userId);
}
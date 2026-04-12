package com.apartmentmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.apartmentmanagement.entity.Announcement;
import com.apartmentmanagement.enums.AnnouncementPriority;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

@Query("SELECT a FROM Announcement a " +
       "WHERE a.sender.id = :userSenderId " +
       "AND (:priority IS NULL OR a.priority = :priority)")
    Page<Announcement> findByUserSenderIdAndPriority(Long userSenderId, AnnouncementPriority priority, Pageable pageable);
    
}
package com.apartmentmanagement.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.enums.NotificationType;




@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    int countByUser_IdAndIsReadFalse(Long userId);
    @Query("Select n from Notification n where n.user.id=:user_id"
        + " And (:isRead is null or n.isRead = :isRead) "
        + " And (:type is null or n.type = :type) "
    )
    Page<Notification> findByUserIdAndFilters(@Param("user_id")Long user_id
                                            ,@Param("isRead")Boolean isRead,
                                            @Param("type") NotificationType type,
                                            Pageable pageable
                                            );

    Optional<Notification> findByIdAndUser_Id(Long id, Long user_id);
    List<Notification> findByUser_Id(Long userId);

}

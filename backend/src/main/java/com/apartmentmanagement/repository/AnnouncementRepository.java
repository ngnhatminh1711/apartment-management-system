package com.apartmentmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Announcement;
import com.apartmentmanagement.enums.AnnouncementPriority;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("""
            SELECT a FROM Announcement a
            WHERE a.building.id = :buildingId
            AND (:isPublished IS NULL OR a.isPublished = :isPublished)
            AND (:priority IS NULL OR a.priority = :priority)
            AND (:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%',:search,'%')))
            ORDER BY a.publishedAt DESC
            """)
    Page<Announcement> findByBuilding(
            @Param("buildingId") Long buildingId,
            @Param("isPublished") Boolean isPublished,
            @Param("priority") AnnouncementPriority priority,
            @Param("search") String search,
            Pageable pageable);
}

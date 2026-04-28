package com.apartmentmanagement.repository;

import java.util.Optional;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.ServiceRequest;
import com.apartmentmanagement.enums.RequestStatus;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    @Query("""
            SELECT COUNT (sr) FROM ServiceRequest sr
            JOIN sr.apartment a
            WHERE a.building.id = :buildingId
            AND sr.status = :status
            """)
    long countByBuildingAndStatus(@Param("buildingId") Long buildingId, @Param("status") RequestStatus status);


    @Query("""
            SELECT sr FROM ServiceRequest sr
            WHERE sr.apartment.id = :apartmentId
            AND (:status IS NULL OR sr.status = :status)
            AND (:requestType IS NULL OR sr.requestType = :requestType)
            """)
    Page<ServiceRequest> findByApartmentIdAndFilters(@Param("apartmentId") Long apartmentId, @Param("status") String status, @Param("requestType") String requestType, Pageable pageable);

    Optional<ServiceRequest> findById(@Param("id") Long serviceRequestId);

    /** Đếm yêu cầu được giải quyết trong tuần này */
    @Query("""
            SELECT COUNT(sr) FROM ServiceRequest sr
            JOIN sr.apartment a
            WHERE a.building.id = :buildingId
            AND sr.status = 'RESOLVED'
            AND sr.resolvedAt >= :weekStart
            """)
    long countResolvedThisWeek(
            @Param("buildingId") Long buildingId,
            @Param("weekStart") java.time.LocalDateTime weekStart);

}

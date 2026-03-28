package com.apartmentmanagement.repository;

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
}

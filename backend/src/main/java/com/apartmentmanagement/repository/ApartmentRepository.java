package com.apartmentmanagement.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.enums.ApartmentStatus;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    @Query("""
            SELECT a FROM Apartment a
            JOIN FETCH a.building b
            WHERE b.id = :buildingId
            AND (:status IS NULL OR a.status = :status)
            AND (:floor IS NULL OR a.floor = :floor)
            AND (:searchPattern IS NULL OR LOWER(a.apartmentNumber) LIKE :searchPattern)
            """)
    Page<Apartment> findByManagerBuilding(
            @Param("buildingId") Long buildingId,
            @Param("status") ApartmentStatus status,
            @Param("floor") Integer floor,
            @Param("searchPattern") String searchPattern,
            Pageable pageable);

    @Query("SELECT a FROM Apartment a JOIN FETCH a.building WHERE a.id = :id AND a.building.id = :buildingId")
    Optional<Apartment> findByIdAndBuilding(@Param("id") Long id, @Param("buildingId") Long buildingId);
}

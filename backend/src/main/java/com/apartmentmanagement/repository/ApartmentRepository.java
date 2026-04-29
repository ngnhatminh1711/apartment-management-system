package com.apartmentmanagement.repository;

import java.util.List;
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

    boolean existsByBuildingIdAndApartmentNumber(Long buildingId, String apartmentNumber);

    boolean existsByBuildingIdAndApartmentNumberAndIdNot(Long buildingId, String apartmentNumber, Long id);

    @Query("""
            SELECT a FROM Apartment a
            JOIN FETCH a.building b
            WHERE b.id = :buildingId
            AND (:status IS NULL OR a.status = :status)
            AND (:floor IS NULL OR a.floor = :floor)
            AND (:search IS NULL OR LOWER(a.apartmentNumber) LIKE LOWER(CONCAT('%',:search,'%')))
            """)
    Page<Apartment> findByBuilding(
            @Param("buildingId") Long buildingId,
            @Param("status") ApartmentStatus status,
            @Param("floor") Integer floor,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT a FROM Apartment a JOIN FETCH a.building b
            WHERE (:buildingId IS NULL OR b.id = :buildingId)
            AND (:status IS NULL OR a.status = :status)
            AND (:search IS NULL OR LOWER(a.apartmentNumber) LIKE LOWER(CONCAT('%',:search,'%')))
            """)
    Page<Apartment> findAll(
            @Param("buildingId") Long buildingId,
            @Param("status") ApartmentStatus status,
            @Param("search") String search,
            Pageable pageable);

    long countByBuildingId(Long buildingId);

    long countByBuildingIdAndStatus(Long buildingId, ApartmentStatus status);

    long countByStatus(ApartmentStatus status);

    List<Apartment> findByBuildingId(Long buildingId);

    @Query("""
            SELECT a FROM Apartment a
            JOIN FETCH a.building b
            WHERE b.id = :buildingId
            AND (:status IS NULL OR a.status = :status)
            AND (:floor IS NULL OR a.floor = :floor)
            AND (:search IS NULL OR LOWER(a.apartmentNumber) LIKE LOWER(CONCAT('%',:search,'%')))
            """)
    Page<Apartment> findByManagerBuilding(
            @Param("buildingId") Long buildingId,
            @Param("status") ApartmentStatus status,
            @Param("floor") Integer floor,
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT a FROM Apartment a JOIN FETCH a.building WHERE a.id = :id AND a.building.id = :buildingId")
    Optional<Apartment> findByIdAndBuilding(@Param("id") Long id, @Param("buildingId") Long buildingId);
}

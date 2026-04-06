package com.apartmentmanagement.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.ApartmentResident;


import java.util.List;

import java.util.Optional;

@Repository
public interface ApartmentResidentRepository extends JpaRepository<ApartmentResident, Long> {
    

    Optional<ApartmentResident> findByUser_IdAndIsPrimaryTrue(Long user_id);
    Optional<ApartmentResident> findByUser_Id(Long user_id);
    List<ApartmentResident> findByApartment_Id(Long apartment_id);



    @Query("""
            SELECT ar FROM ApartmentResident ar
            JOIN FETCH ar.user u
            WHERE ar.apartment.id = :apartmentId
            AND ar.moveOutDate IS NULL
            AND ar.isPrimary = true
            """)
    Optional<ApartmentResident> findPrimaryResident(@Param("apartmentId") Long apartmentId);

    @Query("""
            SELECT COUNT (ar) > 0 FROM ApartmentResident ar
            WHERE ar.user.id = :userId
            AND ar.moveOutDate IS NULL
            """)
    boolean existsActiveByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT COUNT(DISTINCT ar.user.id) FROM ApartmentResident ar
            WHERE ar.apartment.building.id = :buildingId
            AND ar.moveOutDate IS NULL
            """)
    long countActiveResidentsByBuilding(@Param("buildingId") Long buildingId);

    @Query("""
            SELECT ar FROM ApartmentResident ar
            JOIN FETCH ar.user
            WHERE ar.apartment.id = :apartmentId
            AND ar.moveOutDate IS NULL
            """)
    List<ApartmentResident> findCurrentResidents(@Param("apartmentId") Long apartmentId);

    /** Tìm record cư trú theo apartmentId + userId + đang ở (move_out IS NULL) */
    @Query("""
            SELECT ar FROM ApartmentResident ar
            WHERE ar.apartment.id = :apartmentId
            AND ar.user.id = :userId
            AND ar.moveOutDate IS NULL
            """)
    Optional<ApartmentResident> findActiveByApartmentAndUser(
            @Param("apartmentId") Long apartmentId,
            @Param("userId") Long userId);

    @Query("""
            SELECT ar FROM ApartmentResident ar
            JOIN FETCH ar.user u
            JOIN FETCH ar.apartment a
            JOIN a.building b
            WHERE b.id = :buildingId
            AND ar.moveOutDate IS NULL
            AND (:apartmentId IS NULL OR a.id = :apartmentId)
            AND (:floor IS NULL OR a.floor = :floor)
            AND (:search IS NULL OR
                 LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR
                 LOWER(u.email)    LIKE LOWER(CONCAT('%',:search,'%')) OR
                 u.phone           LIKE CONCAT('%',:search,'%')        OR
                 u.idCard          LIKE CONCAT('%',:search,'%'))
            """)
    Page<ApartmentResident> findActiveResidentsByBuilding(
            @Param("buildingId") Long buildingId,
            @Param("apartmentId") Long apartmentId,
            @Param("floor") Integer floor,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT ar FROM ApartmentResident ar
            JOIN FETCH ar.user u
            JOIN FETCH ar.apartment a
            JOIN a.building b
            WHERE b.id = :buildingId
            AND u.id = :userId
            AND ar.moveOutDate IS NULL
            """)
    Optional<ApartmentResident> findActiveResidentInBuilding(
            @Param("buildingId") Long buildingId,
            @Param("userId") Long userId);

}

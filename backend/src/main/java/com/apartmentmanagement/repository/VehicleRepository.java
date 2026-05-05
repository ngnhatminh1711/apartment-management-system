package com.apartmentmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUser_Id(Long userId);

    boolean existsByLicensePlate(String licensePlate);

    Optional<Vehicle> findById(Long id);

    long countByStatusAndApartmentBuildingId(VehicleStatus status, Long buildingId);

    /** Vô hiệu hóa xe khi cư dân chuyển đi */
    @Query("UPDATE Vehicle v SET v.status = 'INACTIVE' WHERE v.user.id = :userId AND v.apartment.id = :aptId AND v.status = 'ACTIVE'")
    @org.springframework.data.jpa.repository.Modifying
    void deactivateByUserAndApartment(
            @Param("userId") Long userId,
            @Param("aptId") Long aptId);

    long countByStatus(VehicleStatus status);

    @Query("""
            SELECT v FROM Vehicle v
            JOIN FETCH v.user u
            JOIN FETCH v.apartment a
            JOIN a.building b
            WHERE b.id = :buildingId
            AND (:status IS NULL OR v.status = :status)
            AND (:vehicleType IS NULL OR v.vehicleType = :vehicleType)
            AND (:apartmentId IS NULL OR a.id = :apartmentId)
            AND (:search IS NULL OR
                 LOWER(v.licensePlate) LIKE LOWER(CONCAT('%',:search,'%')) OR
                 LOWER(u.fullName)     LIKE LOWER(CONCAT('%',:search,'%')))
            """)
    Page<Vehicle> findByBuilding(
            @Param("buildingId") Long buildingId,
            @Param("status") VehicleStatus status,
            @Param("vehicleType") VehicleType vehicleType,
            @Param("apartmentId") Long apartmentId,
            @Param("search") String search,
            Pageable pageable);

    @Query("""
            SELECT v FROM Vehicle v
            JOIN v.apartment a
            JOIN a.building b
            WHERE v.id = :id AND b.id = :buildingId
            """)
    Optional<Vehicle> findByIdAndBuilding(
            @Param("id") Long id,
            @Param("buildingId") Long buildingId);
}

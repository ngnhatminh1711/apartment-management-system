package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    long countByStatusAndApartmentBuildingId(VehicleStatus status, Long buildingId);

    /** Vô hiệu hóa xe khi cư dân chuyển đi */
    @Query("UPDATE Vehicle v SET v.status = 'INACTIVE' WHERE v.user.id = :userId AND v.apartment.id = :aptId AND v.status = 'ACTIVE'")
    @org.springframework.data.jpa.repository.Modifying
    void deactivateByUserAndApartment(
            @Param("userId") Long userId,
            @Param("aptId") Long aptId);
}

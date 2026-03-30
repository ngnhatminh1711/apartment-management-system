package com.apartmentmanagement.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUser_Id(Long userId);
    
    boolean existsByLicensePlate(String licensePlate);

    Optional<Vehicle> findById(Long id);
    long countByStatusAndApartmentBuildingId(VehicleStatus status, Long buildingId);


}

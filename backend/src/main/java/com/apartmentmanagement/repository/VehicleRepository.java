package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    long countByStatusAndApartmentBuildingId(VehicleStatus status, Long buildingId);
}

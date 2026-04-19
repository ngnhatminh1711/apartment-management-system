package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apartmentmanagement.entity.ServiceRegistration;
import com.apartmentmanagement.enums.RegistrationStatus;

public interface ServiceRegistrationRepository extends JpaRepository<ServiceRegistration, Long> {

    Long countByStatusAndApartmentBuildingId(RegistrationStatus status, Long buildingId);
}

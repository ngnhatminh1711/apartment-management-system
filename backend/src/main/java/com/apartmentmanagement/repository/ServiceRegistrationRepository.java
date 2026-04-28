package com.apartmentmanagement.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apartmentmanagement.entity.ServiceRegistration;
import com.apartmentmanagement.enums.RegistrationStatus;

public interface ServiceRegistrationRepository extends JpaRepository<ServiceRegistration,Long> {
    List<ServiceRegistration> findByUser_Id(Long user_id);
    List<ServiceRegistration> findByUser_IdAndStatus(Long user_id,RegistrationStatus  status);
    Optional<ServiceRegistration>  findByIdAndUser_Id(Long id,Long user_id);

    Long countByStatusAndApartmentBuildingId(RegistrationStatus status, Long buildingId);

}

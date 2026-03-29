package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apartmentmanagement.entity.ServiceType;

public interface ServiceTypeRepository extends JpaRepository<ServiceType,Long> {
    
}

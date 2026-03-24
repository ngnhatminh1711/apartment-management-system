package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.ApartmentResident;



import java.util.Optional;

@Repository
public interface ApartmentResidentRepository extends JpaRepository<ApartmentResident, Long> {
    
    Optional<ApartmentResident> findByUserIdAndIsPrimaryTrue(Long user_id);
}

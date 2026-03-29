package com.apartmentmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.ApartmentResident;

import java.util.List;

import java.util.Optional;

@Repository
public interface ApartmentResidentRepository extends JpaRepository<ApartmentResident, Long> {
    

    Optional<ApartmentResident> findByUser_IdAndIsPrimaryTrue(Long user_id);
    Optional<ApartmentResident> findByUser_Id(Long user_id);
    List<ApartmentResident> findByApartment_Id(Long apartment_id);

}

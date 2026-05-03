package com.apartmentmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.ServiceType;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Integer> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Integer id);

    @Query("""
            SELECT st FROM ServiceType st
            WHERE (:isActive IS NULL OR st.isActive = :isActive)
            """)
    Page<ServiceType> findAll(@Param("isActive") Boolean isActive, Pageable pageable);

    /** Đếm số đăng ký đang active của mỗi dịch vụ */
    @Query("""
            SELECT COUNT(sr) FROM ServiceRegistration sr
            WHERE sr.serviceType.id = :serviceTypeId
            AND sr.status = 'ACTIVE'
            """)
    long countActiveRegistrations(@Param("serviceTypeId") Integer serviceTypeId);
}
package com.apartmentmanagement.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RoleName;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("""
            SELECT u FROM User u
            WHERE (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%'))
                    OR LOWER (u.email) LIKE LOWER(CONCAT('%',:search,'%'))
                    OR LOWER (u.phone) LIKE LOWER(CONCAT('%',:search,'%')))
            AND (:role IS NULL OR EXISTS (
                    SELECT r.id FROM u.roles r
                    WHERE r.name = :role
            ))
            AND (:isActive IS NULL OR u.isActive = :isActive)
            AND (:buildingId IS NULL OR EXISTS (
                    SELECT ar.id FROM ApartmentResident ar
                    WHERE ar.user = u
                    AND ar.moveOutDate IS NULL
                    AND ar.apartment.building.id = :buildingId
            ))
            """)
    Page<User> findAll(
            @Param("search") String search,
            @Param("role") RoleName role,
            @Param("isActive") Boolean isActive,
            @Param("buildingId") Long buildingId,
            Pageable pageable);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByIdCard(String idCard);

    @Query("SELECT u from User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(String email);

}

package com.apartmentmanagement.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Building;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("""
            SELECT b FROM Building b
            LEFT JOIN FETCH b.manager
            WHERE (:search IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%',:search,'%'))
                   OR LOWER(b.address) LIKE LOWER(CONCAT('%',:search,'%')))
            AND (:isActive IS NULL OR b.isActive = :isActive)
            """)
    Page<Building> findAll(
            @Param("search") String search,
            @Param("isActive") Boolean isActive,
            Pageable pageable);

    @Query("SELECT b FROM Building b LEFT JOIN FETCH b.manager WHERE b.id = :id")
    Optional<Building> findByIdWithManager(@Param("id") Long id);

    long countByIsActiveTrue();
}

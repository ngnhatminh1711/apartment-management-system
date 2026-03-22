package com.apartmentmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.enums.RoleName;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(RoleName name);
}

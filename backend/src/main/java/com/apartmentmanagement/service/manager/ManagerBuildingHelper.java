package com.apartmentmanagement.service.manager;

import org.springframework.stereotype.Component;

import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ManagerBuildingHelper {

    private final BuildingRepository buildingRepository;

    public Building getMyBuilding() {
        Long managerId = SecurityUtils.getCurrentUserId();
        return buildingRepository.findAll().stream()
                .filter(b -> b.getManager() != null && b.getManager().getId().equals(managerId) && b.getIsActive())
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
    }

    public Long getMyBuildingId() {
        return getMyBuilding().getId();
    }
}

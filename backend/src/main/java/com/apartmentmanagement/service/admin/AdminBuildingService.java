package com.apartmentmanagement.service.admin;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.admin.AssignManagerRequest;
import com.apartmentmanagement.dto.request.admin.BuildingRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.BuildingResponse;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.RoleName;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminBuildingService {

    private final BuildingRepository buildingRepo;
    private final ApartmentRepository apartmentRepo;
    private final ApartmentResidentRepository residentRepo;
    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public PageResponse<BuildingResponse> getAll(
            String search, Boolean isActive, int page, int size, String sort) {

        String[] sortParts = sort.split(",");
        Sort.Direction dir = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        var pageData = buildingRepo.findAll(search, isActive, pageable);

        return PageResponse.of(pageData, building -> {
            var stats = buildStats(building.getId());
            return BuildingResponse.from(building, stats);
        });
    }

    @Transactional(readOnly = true)
    public BuildingResponse getById(Long id) {
        Building building = findOrThrow(id);
        return BuildingResponse.from(building, buildStats(id));
    }

    @Transactional
    public BuildingResponse create(BuildingRequest req) {
        if (buildingRepo.existsByName(req.getName())) {
            throw new AppException(ErrorCode.BUILDING_NAME_EXISTED);
        }

        Building building = Building.builder()
                .name(req.getName())
                .address(req.getAddress())
                .numFloors(req.getNumFloors())
                .numApartments(req.getNumApartments())
                .description(req.getDescription())
                .isActive(true)
                .build();

        if (req.getManagerId() != null) {
            building.setManager(findManagerOrThrow(req.getManagerId()));
        }

        return BuildingResponse.from(buildingRepo.save(building), buildStats(building.getId()));
    }

    @Transactional
    public BuildingResponse update(Long id, BuildingRequest req) {
        Building building = findOrThrow(id);

        if (req.getName() != null
                && buildingRepo.existsByNameAndIdNot(req.getName(), id)) {
            throw new AppException(ErrorCode.BUILDING_NAME_EXISTED);
        }

        if (req.getName() != null)
            building.setName(req.getName());
        if (req.getAddress() != null)
            building.setAddress(req.getAddress());
        if (req.getNumFloors() != null)
            building.setNumFloors(req.getNumFloors());
        if (req.getNumApartments() != null)
            building.setNumApartments(req.getNumApartments());
        if (req.getDescription() != null)
            building.setDescription(req.getDescription());
        if (req.getManagerId() != null)
            building.setManager(findManagerOrThrow(req.getManagerId()));

        return BuildingResponse.from(buildingRepo.save(building), buildStats(id));
    }

    @Transactional
    public void deactivate(Long id) {
        Building building = findOrThrow(id);

        long activeResidents = residentRepo.countActiveResidentsByBuilding(id);
        if (activeResidents > 0) {
            throw new AppException(ErrorCode.BUILDING_HAS_ACTIVE_RESIDENTS);
        }

        building.setIsActive(false);
        buildingRepo.save(building);
    }

    @Transactional
    public BuildingResponse assignManager(Long buildingId, AssignManagerRequest req) {
        Building building = findOrThrow(buildingId);
        User manager = findManagerOrThrow(req.getManagerId());
        building.setManager(manager);
        return BuildingResponse.from(buildingRepo.save(building), buildStats(buildingId));
    }

    private Building findOrThrow(Long id) {
        return buildingRepo.findByIdWithManager(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
    }

    private User findManagerOrThrow(Long managerId) {
        User manager = userRepo.findById(managerId)
                .orElseThrow(() -> new AppException(ErrorCode.MANAGER_NOT_FOUND));

        boolean isManager = manager.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.ROLE_MANAGER);
        if (!isManager) {
            throw new AppException(ErrorCode.MANAGER_NOT_FOUND);
        }
        return manager;
    }

    private BuildingResponse.Stats buildStats(Long buildingId) {
        return BuildingResponse.Stats.builder()
                .totalApartments(apartmentRepo.countByBuildingId(buildingId))
                .occupiedApartments(apartmentRepo.countByBuildingIdAndStatus(
                        buildingId, ApartmentStatus.OCCUPIED))
                .availableApartments(apartmentRepo.countByBuildingIdAndStatus(
                        buildingId, ApartmentStatus.AVAILABLE))
                .maintenanceApartments(apartmentRepo.countByBuildingIdAndStatus(
                        buildingId, ApartmentStatus.MAINTENANCE))
                .build();
    }
}

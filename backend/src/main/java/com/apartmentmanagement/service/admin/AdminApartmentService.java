package com.apartmentmanagement.service.admin;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.admin.ApartmentRequest;
import com.apartmentmanagement.dto.request.admin.ApartmentStatusRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.ApartmentResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BuildingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminApartmentService {

    private final ApartmentRepository apartmentRepo;
    private final ApartmentResidentRepository residentRepo;
    private final BuildingRepository buildingRepo;

    @Transactional(readOnly = true)
    public PageResponse<ApartmentResponse> getAll(
            Long buildingId, ApartmentStatus status, String search,
            int page, int size, String sort) {

        String[] parts = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        var pageData = apartmentRepo.findAll(
                buildingId, status, search,
                PageRequest.of(page, size, Sort.by(dir, parts[0])));

        return PageResponse.of(pageData, apt -> {
            List<ApartmentResponse.ResidentRef> refs = buildResidentRefs(apt.getId());
            return ApartmentResponse.from(apt, refs);
        });
    }

    @Transactional(readOnly = true)
    public ApartmentResponse getById(Long id) {
        Apartment apt = findOrThrow(id);
        return ApartmentResponse.from(apt, buildResidentRefs(id));
    }

    @Transactional
    public ApartmentResponse create(ApartmentRequest req) {
        Building building = buildingRepo.findById(req.getBuildingId())
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        if (apartmentRepo.existsByBuildingIdAndApartmentNumber(
                req.getBuildingId(), req.getApartmentNumber())) {
            throw new AppException(ErrorCode.APARTMENT_NUMBER_EXISTED);
        }

        Apartment apt = Apartment.builder()
                .building(building)
                .apartmentNumber(req.getApartmentNumber())
                .floor(req.getFloor())
                .areaM2(req.getAreaM2())
                .numBedrooms(req.getNumBedrooms())
                .numBathrooms(req.getNumBathrooms())
                .direction(req.getDirection())
                .notes(req.getNotes())
                .status(ApartmentStatus.AVAILABLE)
                .build();

        return ApartmentResponse.from(apartmentRepo.save(apt), List.of());
    }

    @Transactional
    public ApartmentResponse update(Long id, ApartmentRequest req) {
        Apartment apt = findOrThrow(id);

        if (req.getApartmentNumber() != null
                && apartmentRepo.existsByBuildingIdAndApartmentNumberAndIdNot(
                        apt.getBuilding().getId(), req.getApartmentNumber(), id)) {
            throw new AppException(ErrorCode.APARTMENT_NUMBER_EXISTED);
        }

        if (req.getApartmentNumber() != null)
            apt.setApartmentNumber(req.getApartmentNumber());
        if (req.getFloor() != null)
            apt.setFloor(req.getFloor());
        if (req.getAreaM2() != null)
            apt.setAreaM2(req.getAreaM2());
        if (req.getNumBedrooms() != null)
            apt.setNumBedrooms(req.getNumBedrooms());
        if (req.getNumBathrooms() != null)
            apt.setNumBathrooms(req.getNumBathrooms());
        if (req.getDirection() != null)
            apt.setDirection(req.getDirection());
        if (req.getNotes() != null)
            apt.setNotes(req.getNotes());

        return ApartmentResponse.from(apartmentRepo.save(apt), buildResidentRefs(id));
    }

    @Transactional
    public void delete(Long id) {
        Apartment apt = findOrThrow(id);
        if (!residentRepo.findCurrentResidents(id).isEmpty()) {
            throw new AppException(ErrorCode.APARTMENT_HAS_RESIDENTS);
        }
        apartmentRepo.delete(apt);
    }

    @Transactional
    public ApartmentResponse updateStatus(Long id, ApartmentStatusRequest req) {
        Apartment apt = findOrThrow(id);

        // Không set AVAILABLE khi vẫn còn cư dân
        if (req.getStatus() == ApartmentStatus.AVAILABLE
                && apt.getStatus() == ApartmentStatus.OCCUPIED
                && !residentRepo.findCurrentResidents(id).isEmpty()) {
            throw new AppException(ErrorCode.APARTMENT_HAS_RESIDENTS);
        }

        apt.setStatus(req.getStatus());
        if (req.getNotes() != null)
            apt.setNotes(req.getNotes());

        return ApartmentResponse.from(apartmentRepo.save(apt), buildResidentRefs(id));
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    private Apartment findOrThrow(Long id) {
        return apartmentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
    }

    private List<ApartmentResponse.ResidentRef> buildResidentRefs(Long apartmentId) {
        return residentRepo.findCurrentResidents(apartmentId).stream()
                .sorted(Comparator.comparing(
                        (ApartmentResident ar) -> Boolean.TRUE.equals(ar.getIsPrimary()))
                        .reversed())
                .map(ar -> ApartmentResponse.ResidentRef.builder()
                        .id(ar.getUser().getId())
                        .fullName(ar.getUser().getFullName())
                        .phone(ar.getUser().getPhone())
                        .isPrimary(ar.getIsPrimary())
                        .moveInDate(ar.getMoveInDate() == null ? null : ar.getMoveInDate().toString())
                        .build())
                .toList();
    }
}

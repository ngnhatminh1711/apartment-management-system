package com.apartmentmanagement.service.manager;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.manager.ManagerApartmentDetailResponse;
import com.apartmentmanagement.dto.response.manager.ManagerApartmentResponse;
import com.apartmentmanagement.dto.response.manager.ResidentDetailResponse;
import com.apartmentmanagement.dto.response.manager.ResidentResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.BillSummaryProjection;
import com.apartmentmanagement.enums.RegistrationStatus;
import com.apartmentmanagement.enums.RequestStatus;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.ServiceRequestRepository;
import com.apartmentmanagement.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerApartmentService {

    private final ManagerBuildingHelper buildingHelper;
    private final ApartmentRepository apartmentRepo;
    private final ApartmentResidentRepository residentRepo;
    private final VehicleRepository vehicleRepo;
    private final BillRepository billRepo;
    private final ServiceRequestRepository requestRepo;

    // --LIST APARTMENTS--
    @Transactional(readOnly = true)
    public PageResponse<ManagerApartmentResponse> getApartments(
            ApartmentStatus status, Integer floor, String search, int page, int size, String sort) {

        Long buildingId = buildingHelper.getMyBuildingId();
        String[] parts = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String searchPattern = handleSearch(search);

        var pageData = apartmentRepo.findByManagerBuilding(
                buildingId, status, floor, searchPattern,
                PageRequest.of(page, size, Sort.by(dir, parts[0])));

        return PageResponse.of(pageData, apt -> {
            List<ApartmentResident> residents = residentRepo.findCurrentResidents(apt.getId());
            long pending = billRepo.countPendingByApartment(apt.getId());
            long pendingReq = requestRepo.countByBuildingAndStatus(buildingId, RequestStatus.PENDING);

            List<ManagerApartmentResponse.ResidentRef> resRefs = residents.stream()
                    .map(ar -> ManagerApartmentResponse.ResidentRef.builder()
                            .id(ar.getUser().getId())
                            .fullName(ar.getUser().getFullName())
                            .phone(ar.getUser().getPhone())
                            .isPrimary(ar.getIsPrimary())
                            .moveInDate(ar.getMoveInDate().toString())
                            .build())
                    .collect(Collectors.toList());

            return ManagerApartmentResponse.builder()
                    .id(apt.getId())
                    .apartmentNumber(apt.getApartmentNumber())
                    .floor(apt.getFloor())
                    .areaM2(apt.getAreaM2())
                    .numBedrooms(apt.getNumBedrooms())
                    .numBathrooms(apt.getNumBathrooms())
                    .status(apt.getStatus())
                    .currentResidents(resRefs)
                    .pendingBillCount((int) pending)
                    .pendingRequestCount((int) pendingReq)
                    .createdAt(apt.getCreatedAt())
                    .build();
        });
    }

    // --GET APARTMENT DETAIL--
    @Transactional(readOnly = true)
    public ManagerApartmentDetailResponse getApartmentDetail(Long apartmentId) {
        Long buildingId = buildingHelper.getMyBuildingId();
        Apartment apartment = apartmentRepo.findByIdAndBuilding(apartmentId, buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));

        // Current residents
        List<ApartmentResident> currentResidents = residentRepo.findCurrentResidents(apartmentId);
        List<ManagerApartmentDetailResponse.CurrentResidentRef> currentRefs = currentResidents.stream()
                .map(ar -> ManagerApartmentDetailResponse.CurrentResidentRef.builder()
                        .id(ar.getUser().getId())
                        .fullName(ar.getUser().getFullName())
                        .email(ar.getUser().getEmail())
                        .phone(ar.getUser().getPhone())
                        .idCard(ar.getUser().getIdCard())
                        .isPrimary(ar.getIsPrimary())
                        .moveInDate(ar.getMoveInDate().toString())
                        .build())
                .collect(Collectors.toList());

        // History
        List<ManagerApartmentDetailResponse.HistoryRef> historyRefs = apartment.getResidentHistory().stream()
                .filter(ar -> ar.getMoveOutDate() != null)
                .map(ar -> ManagerApartmentDetailResponse.HistoryRef.builder()
                        .userId(ar.getUser().getId())
                        .fullName(ar.getUser().getFullName())
                        .moveInDate(ar.getMoveInDate().toString())
                        .moveOutDate(ar.getMoveOutDate().toString())
                        .build())
                .collect(Collectors.toList());

        // Vehicles
        List<ManagerApartmentDetailResponse.VehicleRef> vehicleRefs = apartment.getVehicles().stream()
                .filter(v -> v.getStatus() == VehicleStatus.ACTIVE)
                .map(v -> ManagerApartmentDetailResponse.VehicleRef.builder()
                        .id(v.getId())
                        .licensePlate(v.getLicensePlate())
                        .vehicleType(v.getVehicleType().name())
                        .brand(v.getBrand())
                        .status(v.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        List<ManagerApartmentDetailResponse.BillRef> billRefs = apartment.getBills().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(3)
                .map(b -> ManagerApartmentDetailResponse.BillRef.builder()
                        .id(b.getId())
                        .billingMonth(b.getBillingMonth()
                                .format(DateTimeFormatter.ofPattern("yyyy-MM")))
                        .totalAmount(b.getTotalAmount())
                        .status(b.getStatus().name())
                        .dueDate(b.getDueDate().toString())
                        .build())
                .collect(Collectors.toList());

        return ManagerApartmentDetailResponse.builder()
                .id(apartment.getId())
                .apartmentNumber(apartment.getApartmentNumber())
                .floor(apartment.getFloor())
                .areaM2(apartment.getAreaM2())
                .numBedrooms(apartment.getNumBedrooms())
                .numBathrooms(apartment.getNumBathrooms())
                .direction(apartment.getDirection())
                .status(apartment.getStatus())
                .notes(apartment.getNotes())
                .currentResidents(currentRefs)
                .residentHistory(historyRefs)
                .vehicles(vehicleRefs)
                .build();
    }

    // --LIST RESIDENTS--
    @Transactional(readOnly = true)
    public PageResponse<ResidentResponse> getResidents(Long apartmentId, Integer floor, String search, int page,
            int size, String sort) {

        Long buildingId = buildingHelper.getMyBuildingId();
        String[] parts = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String searchPattern = handleSearch(search);

        var pageData = residentRepo.findActiveResidentsByBuilding(
                buildingId, apartmentId, floor, searchPattern,
                PageRequest.of(page, size, Sort.by(dir, parts[0])));

        return PageResponse.of(pageData, ar -> {
            BigDecimal debt = BigDecimal.valueOf(billRepo.countPendingByApartment(ar.getApartment().getId()));
            long vehicleCount = vehicleRepo.countByStatusAndApartmentBuildingId(
                    VehicleStatus.ACTIVE, buildingId);

            return ResidentResponse.builder()
                    .id(ar.getUser().getId())
                    .fullName(ar.getUser().getFullName())
                    .email(ar.getUser().getEmail())
                    .phone(ar.getUser().getPhone())
                    .idCard(ar.getUser().getIdCard())
                    .avatarUrl(ar.getUser().getAvatarUrl())
                    .apartment(ResidentResponse.ApartmentRef.builder()
                            .id(ar.getApartment().getId())
                            .apartmentNumber(ar.getApartment().getApartmentNumber())
                            .floor(ar.getApartment().getFloor())
                            .build())
                    .isPrimary(ar.getIsPrimary())
                    .moveInDate(ar.getMoveInDate().toString())
                    .outStandingDebt(debt)
                    .vehicleCount((int) vehicleCount)
                    .build();
        });
    }

    // --GET RESIDENT DETAIL--
    @Transactional(readOnly = true)
    public ResidentDetailResponse getResidentDetail(Long userId) {
        Long buildingId = buildingHelper.getMyBuildingId();

        ApartmentResident ar = residentRepo.findActiveResidentInBuilding(buildingId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        User user = ar.getUser();
        Apartment apt = ar.getApartment();

        // Vehicles
        List<ResidentDetailResponse.VehicleRef> vehicleRefs = user.getVehicles().stream()
                .filter(v -> v.getApartment().getId().equals(apt.getId()))
                .map(v -> ResidentDetailResponse.VehicleRef.builder()
                        .id(v.getId()).licensePlate(v.getLicensePlate())
                        .vehicleType(v.getVehicleType().name()).status(v.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        // Service registrations
        List<ResidentDetailResponse.ServiceRegRef> serviceRefs = user.getServiceRegistrations() != null
                ? user.getServiceRegistrations().stream()
                        .filter(sr -> sr.getStatus() == RegistrationStatus.ACTIVE)
                        .map(sr -> ResidentDetailResponse.ServiceRegRef.builder()
                                .id(sr.getId())
                                .serviceName(sr.getServiceType().getName())
                                .status(sr.getStatus().name())
                                .startDate(sr.getStartDate() != null ? sr.getStartDate().toString() : null)
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        // Bill summary
        BillSummaryProjection stats = billRepo.findBillSummaryByApartment(apt.getId());

        long totalBills = stats.getTotalBills() != null ? stats.getTotalBills() : 0L;
        long paidBills = stats.getPaidBills() != null ? stats.getPaidBills() : 0L;
        long pendingBills = (stats.getPendingPartialBills() != null ? stats.getPendingPartialBills() : 0L)
                + (stats.getOverdueBills() != null ? stats.getOverdueBills() : 0L);

        BigDecimal totalAmount = stats.getTotalAmount() != null ? stats.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal paidAmount = stats.getPaidAmount() != null ? stats.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal outstandingAmount = totalAmount.subtract(paidAmount);

        // Recent requests
        List<ResidentDetailResponse.RequestRef> requestRefs = user.getServiceRequests() != null
                ? user.getServiceRequests().stream()
                        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                        .limit(5)
                        .map(r -> ResidentDetailResponse.RequestRef.builder()
                                .id(r.getId()).title(r.getTitle())
                                .status(r.getStatus().name())
                                .createdAt(r.getCreatedAt().toString())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        return ResidentDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .idCard(user.getIdCard())
                .dateOfBirth(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null)
                .avatarUrl(user.getAvatarUrl())
                .apartment(ResidentDetailResponse.ApartmentInfo.builder()
                        .id(apt.getId())
                        .apartmentNumber(apt.getApartmentNumber())
                        .floor(apt.getFloor())
                        .isPrimary(ar.getIsPrimary())
                        .moveInDate(ar.getMoveInDate().toString())
                        .build())
                .vehicles(vehicleRefs)
                .serviceRegistrations(serviceRefs)
                .billSummary(ResidentDetailResponse.BillSummary.builder()
                        .totalBills(totalBills)
                        .paidBills(paidBills)
                        .pendingBills(pendingBills)
                        .outstandingAmount(outstandingAmount)
                        .build())
                .recentRequests(requestRefs)
                .build();
    }

    private String handleSearch(String keyword) {
        String searchPattern = null;
        if (keyword != null && !keyword.isBlank()) {
            searchPattern = "%" + keyword.trim().toLowerCase() + "%";
        }
        return searchPattern;
    }
}

package com.apartmentmanagement.service.manager;

import java.time.LocalDateTime;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.manager.VehicleApproveRequest;
import com.apartmentmanagement.dto.request.manager.VehicleRejectRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.manager.ManagerVehicleResponse;
import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.VehicleRepository;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerVehicleService {

    private final ManagerBuildingHelper buildingHelper;
    private final VehicleRepository vehicleRepo;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Object getAll(VehicleStatus status, VehicleType vehicleType, Long apartmentId,
            String search, int page, int size) {

        Long buildingId = buildingHelper.getMyBuildingId();
        long pending = vehicleRepo.countByStatusAndApartmentBuildingId(VehicleStatus.PENDING_APPROVAL, buildingId);

        var pageData = vehicleRepo.findByBuilding(
                buildingId, status, vehicleType, apartmentId, search,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "registeredAt")));

        var content = PageResponse.of(pageData, v -> toResponse(v));

        final long p = pending;
        return new Object() {
            public final long pendingCount = p;
            public final PageResponse<ManagerVehicleResponse> vehicles = content;
        };
    }

    @Transactional
    public ManagerVehicleResponse approve(Long vehicleId, VehicleApproveRequest req) {
        Vehicle v = findInMyBuilding(vehicleId);

        if (v.getStatus() != VehicleStatus.PENDING_APPROVAL) {
            throw new AppException(ErrorCode.VEHICLE_NOT_PENDING);
        }

        v.setStatus(VehicleStatus.ACTIVE);
        v.setApprovedBy(SecurityUtils.getCurrentUser());
        v.setApprovedAt(LocalDateTime.now());
        v.setNotes(req.getNotes());
        if (req.getExpiredAt() != null)
            v.setExpiredAt(req.getExpiredAt());

        vehicleRepo.save(v);

        notificationService.createNotification(
                v.getUser(),
                "Đăng ký xe " + v.getLicensePlate() + " đã được duyệt",
                req.getNotes() != null ? req.getNotes() : "Xe của bạn đã được cấp phép vào bãi đỗ.",
                NotificationType.VEHICLE_APPROVED, "vehicles", vehicleId);

        return toResponse(v);
    }

    @Transactional
    public ManagerVehicleResponse reject(Long vehicleId, VehicleRejectRequest req) {
        Vehicle v = findInMyBuilding(vehicleId);

        if (v.getStatus() != VehicleStatus.PENDING_APPROVAL) {
            throw new AppException(ErrorCode.VEHICLE_NOT_PENDING);
        }

        v.setStatus(VehicleStatus.REJECTED);
        v.setRejectionReason(req.getRejectionReason());
        vehicleRepo.save(v);

        notificationService.createNotification(
                v.getUser(),
                "Đăng ký xe " + v.getLicensePlate() + " bị từ chối",
                req.getRejectionReason(),
                NotificationType.VEHICLE_REJECTED, "vehicles", vehicleId);

        return toResponse(v);
    }

    private Vehicle findInMyBuilding(Long id) {
        Long buildingId = buildingHelper.getMyBuildingId();
        return vehicleRepo.findByIdAndBuilding(id, buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.VEHICLE_NOT_FOUND));
    }

    private ManagerVehicleResponse toResponse(Vehicle v) {
        return ManagerVehicleResponse.builder()
                .id(v.getId())
                .owner(ManagerVehicleResponse.OwnerRef.builder()
                        .id(v.getUser().getId())
                        .fullName(v.getUser().getFullName())
                        .phone(v.getUser().getPhone())
                        .build())
                .apartmentNumber(v.getApartment().getApartmentNumber())
                .vehicleType(v.getVehicleType())
                .licensePlate(v.getLicensePlate())
                .brand(v.getBrand()).model(v.getModel()).color(v.getColor())
                .status(v.getStatus())
                .registeredAt(v.getRegisteredAt())
                .rejectionReason(v.getRejectionReason())
                .build();
    }
}
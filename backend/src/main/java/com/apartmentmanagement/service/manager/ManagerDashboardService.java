package com.apartmentmanagement.service.manager;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.manager.ManagerDashboardResponse;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.RegistrationStatus;
import com.apartmentmanagement.enums.RequestStatus;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.ServiceRegistrationRepository;
import com.apartmentmanagement.repository.ServiceRequestRepository;
import com.apartmentmanagement.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ManagerDashboardService {

    private final ManagerBuildingHelper buildingHelper;
    private final ApartmentRepository apartmentRepo;
    private final BillRepository billRepo;
    private final ServiceRequestRepository requestRepo;
    private final VehicleRepository vehicleRepo;
    private final ServiceRegistrationRepository regRepo;

    @Transactional(readOnly = true)
    public ManagerDashboardResponse getDashboard() {
        Building building = buildingHelper.getMyBuilding();
        Long buildingId = building.getId();
        LocalDate now = LocalDate.now();

        // ── Apartments ──────────────────────────────────────────────────────
        long total = apartmentRepo.countByBuildingIdAndStatus(buildingId, null);
        long occupied = apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.OCCUPIED);
        long available = apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.AVAILABLE);
        long maintenance = apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.MAINTENANCE);
        double occupancyRate = total == 0 ? 0 : Math.round((double) occupied / total * 1000.0) / 10.0;

        // ── Billing (tháng hiện tại) ────────────────────────────────────────
        BigDecimal billed = billRepo.sumBilledByBuildingAndMonth(buildingId, now.getYear(), now.getMonthValue());
        BigDecimal collected = billRepo.sumCollectedByBuildingAndMonth(buildingId, now.getYear(), now.getMonthValue());
        BigDecimal overdueDebt = billRepo.sumOutstandingDebt(buildingId);
        long pendingBills = 0;
        long overdueBills = 0;
        Object[] raw = billRepo.findBillSummaryByBuilding(buildingId);
        if (raw != null && raw.length >= 4) {
            pendingBills = raw[2] != null ? ((Number) raw[2]).longValue() : 0;
            overdueBills = raw[3] != null ? ((Number) raw[3]).longValue() : 0;
        }
        double collectionRate = billed.compareTo(BigDecimal.ZERO) == 0 ? 0
                : collected.divide(billed, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();

        // ── Service Requests ────────────────────────────────────────────────
        long pendingReqs = requestRepo.countByBuildingAndStatus(buildingId, RequestStatus.PENDING);
        long inProgressReqs = requestRepo.countByBuildingAndStatus(buildingId, RequestStatus.IN_PROGRESS);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7).withHour(0).withMinute(0).withSecond(0);
        long resolvedThisWeek = requestRepo.countResolvedThisWeek(buildingId, weekStart);

        // ── Pending Approvals ───────────────────────────────────────────────
        long pendingVehicles = vehicleRepo.countByStatusAndApartmentBuildingId(
                VehicleStatus.PENDING_APPROVAL, buildingId);
        long pendingServices = regRepo.countByStatusAndApartmentBuildingId(
                RegistrationStatus.PENDING, buildingId);

        // ── Recent Activity (mocked – có thể thay bằng event log table) ────
        List<ManagerDashboardResponse.ActivityItem> activity = List.of();

        return ManagerDashboardResponse.builder()
                .building(ManagerDashboardResponse.BuildingInfo.builder()
                        .id(building.getId()).name(building.getName()).build())
                .apartments(ManagerDashboardResponse.ApartmentStats.builder()
                        .total(total).occupied(occupied).available(available)
                        .maintenance(maintenance).occupancyRate(occupancyRate).build())
                .billing(ManagerDashboardResponse.BillingStats.builder()
                        .currentMonth(now.format(DateTimeFormatter.ofPattern("yyyy-MM")))
                        .totalBilled(billed).totalCollected(collected)
                        .collectionRate(Math.round(collectionRate * 10.0) / 10.0)
                        .pendingCount(pendingBills).overdueCount(overdueBills)
                        .overdueAmount(overdueDebt).build())
                .requests(ManagerDashboardResponse.RequestStats.builder()
                        .pendingCount(pendingReqs).inProgressCount(inProgressReqs)
                        .resolvedThisWeek(resolvedThisWeek).build())
                .pendingApprovals(ManagerDashboardResponse.PendingApprovals.builder()
                        .vehicleCount(pendingVehicles)
                        .serviceRegistrationCount(pendingServices).build())
                .recentActivity(activity)
                .build();
    }
}

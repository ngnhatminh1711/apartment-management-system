package com.apartmentmanagement.service.admin;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.admin.DashboardStatsResponse;
import com.apartmentmanagement.dto.response.admin.DebtReportResponse;
import com.apartmentmanagement.dto.response.admin.RevenueReportResponse;
import com.apartmentmanagement.enums.ApartmentStatus;
import com.apartmentmanagement.enums.RegistrationStatus;
import com.apartmentmanagement.enums.RequestStatus;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.repository.ApartmentRepository;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.repository.PaymentRepository;
import com.apartmentmanagement.repository.ServiceRegistrationRepository;
import com.apartmentmanagement.repository.ServiceRequestRepository;
import com.apartmentmanagement.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminReportService {

    private final BuildingRepository buildingRepo;
    private final ApartmentRepository apartmentRepo;
    private final ApartmentResidentRepository residentRepo;
    private final BillRepository billRepo;
    private final PaymentRepository paymentRepo;
    private final ServiceRequestRepository requestRepo;
    private final VehicleRepository vehicleRepo;
    private final ServiceRegistrationRepository registrationRepo;

    // ── DASHBOARD ──────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboard(Long buildingId, Integer year) {

        // Overview
        long totalBuildings = buildingRepo.countByIsActiveTrue();

        long occupied = buildingId != null
                ? apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.OCCUPIED)
                : apartmentRepo.countByStatus(ApartmentStatus.OCCUPIED);

        long available = buildingId != null
                ? apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.AVAILABLE)
                : apartmentRepo.countByStatus(ApartmentStatus.AVAILABLE);

        long maintenance = buildingId != null
                ? apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.MAINTENANCE)
                : apartmentRepo.countByStatus(ApartmentStatus.MAINTENANCE);

        long reserved = buildingId != null
                ? apartmentRepo.countByBuildingIdAndStatus(buildingId, ApartmentStatus.RESERVED)
                : apartmentRepo.countByStatus(ApartmentStatus.RESERVED);

        long totalApartments = occupied + available + maintenance + reserved;

        long totalResidents = buildingId != null
                ? residentRepo.countActiveResidentsByBuilding(buildingId)
                : residentRepo.countAllActiveResidents();

        double occupancyRate = totalApartments == 0 ? 0
                : (double) occupied / totalApartments * 100;

        // Financials (tháng hiện tại)
        LocalDate now = LocalDate.now();
        long buildingId2 = buildingId != null ? buildingId : -1L;

        BigDecimal billed = buildingId != null
                ? billRepo.sumBilledByBuilding(buildingId)
                : billRepo.sumAllBilled();

        BigDecimal collected = buildingId != null
                ? billRepo.sumCollectedByBuilding(buildingId)
                : billRepo.sumAllCollected();

        BigDecimal outstandingDebt = billRepo.sumOutstandingDebt(buildingId);

        long totalDebtors = billRepo.countDebtors(buildingId);

        double collectionRate = billed.compareTo(BigDecimal.ZERO) == 0 ? 0
                : collected.divide(billed, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue();

        // Operations
        long pendingReqs = requestRepo.countByStatus(RequestStatus.PENDING);
        long inProgressReqs = requestRepo.countByStatus(RequestStatus.IN_PROGRESS);
        long pendingVehicle = vehicleRepo.countByStatus(VehicleStatus.PENDING_APPROVAL);
        long pendingService = registrationRepo.countByStatus(RegistrationStatus.PENDING);

        // Revenue chart (24 tháng gần nhất)
        LocalDate sixMonthsAgo = now.minusMonths(23).withDayOfMonth(1);
        List<DashboardStatsResponse.RevenuePoint> chart;

        List<Object[]> raw = buildingId != null
                ? billRepo.findMonthlyRevenue(buildingId, sixMonthsAgo)
                : billRepo.findMonthlyRevenueFromDate(sixMonthsAgo);
        chart = raw.stream().map(row -> DashboardStatsResponse.RevenuePoint.builder()
                .month((String) row[0])
                .billed(row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO)
                .collected(row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO)
                .build()).collect(Collectors.toList());

        // Occupancy by building
        List<DashboardStatsResponse.OccupancyItem> occupancyItems = buildingRepo.findAll().stream().map(b -> {
            long total = apartmentRepo.countByBuildingId(b.getId());
            long occ = apartmentRepo.countByBuildingIdAndStatus(b.getId(), ApartmentStatus.OCCUPIED);
            double rate = total == 0 ? 0 : (double) occ / total * 100;
            return DashboardStatsResponse.OccupancyItem.builder()
                    .buildingId(b.getId())
                    .buildingName(b.getName())
                    .occupancyRate(Math.round(rate * 10.0) / 10.0)
                    .build();
        }).collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .overview(DashboardStatsResponse.Overview.builder()
                        .totalBuildings(totalBuildings)
                        .totalApartments(totalApartments)
                        .occupiedApartments(occupied)
                        .availableApartments(available)
                        .maintenanceApartments(maintenance)
                        .reservedApartments(reserved)
                        .totalResidents(totalResidents)
                        .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                        .build())
                .financials(DashboardStatsResponse.Financials.builder()
                        .currentMonthBilled(billed)
                        .currentMonthCollected(collected)
                        .currentMonthCollectionRate(Math.round(collectionRate * 10.0) / 10.0)
                        .outstandingDebt(outstandingDebt)
                        .totalDebtors(totalDebtors)
                        .build())
                .operations(DashboardStatsResponse.Operations.builder()
                        .pendingServiceRequests(pendingReqs)
                        .inProgressServiceRequests(inProgressReqs)
                        .pendingVehicleApprovals(pendingVehicle)
                        .pendingServiceRegistrations(pendingService)
                        .build())
                .revenueChart(chart)
                .occupancyByBuilding(occupancyItems)
                .build();
    }

    // ── DEBT REPORT ────────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public DebtReportResponse getDebtReport(Long buildingId) {
        var bills = billRepo.findOutstandingBills(buildingId);

        BigDecimal totalDebt = bills.stream()
                .map(b -> b.getTotalAmount().subtract(b.getPaidAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();

        var debtors = bills.stream().map(b -> {
            BigDecimal remaining = b.getTotalAmount().subtract(b.getPaidAmount());
            long daysOverdue = b.getDueDate().isBefore(today)
                    ? today.toEpochDay() - b.getDueDate().toEpochDay()
                    : 0;

            // Lấy tên cư dân chủ hộ (simplified)
            String residentName = b.getApartment().getResidentHistory().stream()
                    .filter(ar -> ar.getMoveOutDate() == null && ar.getIsPrimary())
                    .findFirst()
                    .map(ar -> ar.getUser().getFullName())
                    .orElse("—");

            String residentPhone = b.getApartment().getResidentHistory().stream()
                    .filter(ar -> ar.getMoveOutDate() == null && ar.getIsPrimary())
                    .findFirst()
                    .map(ar -> ar.getUser().getPhone())
                    .orElse("—");

            return DebtReportResponse.Debtor.builder()
                    .apartmentId(b.getApartment().getId())
                    .apartmentNumber(b.getApartment().getApartmentNumber())
                    .buildingName(b.getApartment().getBuilding().getName())
                    .residentName(residentName)
                    .residentPhone(residentPhone)
                    .totalDebt(remaining)
                    .outstandingBills(List.of(DebtReportResponse.BillRef.builder()
                            .billId(b.getId())
                            .billingMonth(b.getBillingMonth().format(fmt))
                            .totalAmount(b.getTotalAmount())
                            .paidAmount(b.getPaidAmount())
                            .dueDate(b.getDueDate().format(fmt))
                            .daysOverdue(daysOverdue)
                            .build()))
                    .build();
        }).collect(Collectors.toList());

        return DebtReportResponse.builder()
                .asOfDate(today.format(fmt))
                .summary(DebtReportResponse.DebtSummary.builder()
                        .totalDebtors(debtors.size())
                        .totalDebtAmount(totalDebt)
                        .overdueCount(bills.stream().filter(b -> b.getDueDate().isBefore(today)).count())
                        .build())
                .debtors(debtors)
                .build();
    }
}

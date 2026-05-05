package com.apartmentmanagement.dto.response.admin;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private Overview overview;
    private Financials financials;
    private Operations operations;
    private List<RevenuePoint> revenueChart;
    private List<OccupancyItem> occupancyByBuilding;

    @Getter
    @Builder
    public static class Overview {
        private long totalBuildings;
        private long totalApartments;
        private long occupiedApartments;
        private long availableApartments;
        private long maintenanceApartments;
        private long reservedApartments;
        private long totalResidents;
        private double occupancyRate;
    }

    @Getter
    @Builder
    public static class Financials {
        private BigDecimal currentMonthBilled;
        private BigDecimal currentMonthCollected;
        private double currentMonthCollectionRate;
        private BigDecimal outstandingDebt;
        private long totalDebtors;
    }

    @Getter
    @Builder
    public static class Operations {
        private long pendingServiceRequests;
        private long inProgressServiceRequests;
        private long pendingVehicleApprovals;
        private long pendingServiceRegistrations;
    }

    @Getter
    @Builder
    public static class RevenuePoint {
        private String month;
        private BigDecimal billed;
        private BigDecimal collected;
    }

    @Getter
    @Builder
    public static class OccupancyItem {
        private Long buildingId;
        private String buildingName;
        private double occupancyRate;
    }
}

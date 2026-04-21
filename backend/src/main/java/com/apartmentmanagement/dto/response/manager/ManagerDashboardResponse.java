package com.apartmentmanagement.dto.response.manager;

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
public class ManagerDashboardResponse {

    private BuildingInfo building;
    private ApartmentStats apartments;
    private BillingStats billing;
    private RequestStats requests;
    private PendingApprovals pendingApprovals;
    private List<ActivityItem> recentActivity;

    @Getter
    @Builder
    public static class BuildingInfo {
        private Long id;
        private String name;
    }

    @Getter
    @Builder
    public static class ApartmentStats {
        private long total;
        private long occupied;
        private long available;
        private long maintenance;
        private double occupancyRate;
    }

    @Getter
    @Builder
    public static class BillingStats {
        private String currentMonth;
        private BigDecimal totalBilled;
        private BigDecimal totalCollected;
        private double collectionRate;
        private long pendingCount;
        private long overdueCount;
        private BigDecimal overdueAmount;
    }

    @Getter
    @Builder
    public static class RequestStats {
        private long pendingCount;
        private long inProgressCount;
        private long resolvedThisWeek;
    }

    @Getter
    @Builder
    public static class PendingApprovals {
        private long vehicleCount;
        private long serviceRegistrationCount;
    }

    @Getter
    @Builder
    public static class ActivityItem {
        private String type;
        private String message;
        private String time;
    }
}
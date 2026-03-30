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
public class ResidentDetailResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String idCard;
    private String dateOfBirth;
    private String avatarUrl;

    private ApartmentInfo apartment;
    private List<VehicleRef> vehicles;
    private List<ServiceRegRef> serviceRegistrations;
    private BillSummary billSummary;
    private List<RequestRef> recentRequests;

    @Getter
    @Builder
    public static class ApartmentInfo {
        private Long id;
        private String apartmentNumber;
        private Integer floor;
        private Boolean isPrimary;
        private String moveInDate;
    }

    @Getter
    @Builder
    public static class VehicleRef {
        private Long id;
        private String licensePlate;
        private String vehicleType;
        private String status;
    }

    @Getter
    @Builder
    public static class ServiceRegRef {
        private Long id;
        private String serviceName;
        private String status;
        private String startDate;
    }

    @Getter
    @Builder
    public static class BillSummary {
        private Long totalBills;
        private Long paidBills;
        private Long pendingBills;
        private BigDecimal outstandingAmount;
    }

    @Getter
    @Builder
    public static class RequestRef {
        private Long id;
        private String title;
        private String status;
        private String createdAt;
    }
}

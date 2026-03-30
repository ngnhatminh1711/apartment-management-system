package com.apartmentmanagement.dto.response.manager;

import java.math.BigDecimal;
import java.util.List;

import com.apartmentmanagement.enums.ApartmentStatus;

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
public class ManagerApartmentDetailResponse {
    private Long id;
    private String apartmentNumber;
    private Integer floor;
    private BigDecimal areaM2;
    private Integer numBedrooms;
    private Integer numBathrooms;
    private String direction;
    private ApartmentStatus status;
    private String notes;
    private List<CurrentResidentRef> currentResidents;
    private List<HistoryRef> residentHistory;
    private List<VehicleRef> vehicles;
    private List<BillRef> recentBills;

    @Getter
    @Builder
    public static class CurrentResidentRef {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String idCard;
        private Boolean isPrimary;
        private String moveInDate;
    }

    @Getter
    @Builder
    public static class HistoryRef {
        private Long userId;
        private String fullName;
        private String moveInDate;
        private String moveOutDate;
    }

    @Getter
    @Builder
    public static class VehicleRef {
        private Long id;
        private String licensePlate;
        private String vehicleType;
        private String brand;
        private String status;
    }

    @Getter
    @Builder
    public static class BillRef {
        private Long id;
        private String billingMonth;
        private BigDecimal totalAmount;
        private String status;
        private String dueDate;
    }
}

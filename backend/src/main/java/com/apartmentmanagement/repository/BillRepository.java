package com.apartmentmanagement.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.enums.BillSummaryProjection;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    /** Tổng tiền đã lập hóa đơn trong tháng */
    @Query("""
            SELECT COALESCE(SUM(b.totalAmount), 0)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            AND YEAR(b.billingMonth) = :year AND MONTH(b.billingMonth) = :month
            AND b.status != 'CANCELLED'
            """)
    BigDecimal sumBilledByBuildingAndMonth(
            @Param("buildingId") Long buildingId,
            @Param("year") int year, @Param("month") int month);

    /** Tổng tiền đã thu trong tháng */
    @Query("""
            SELECT COALESCE(SUM(b.paidAmount), 0)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            AND YEAR(b.billingMonth) = :year AND MONTH(b.billingMonth) = :month
            """)
    BigDecimal sumCollectedByBuildingAndMonth(
            @Param("buildingId") Long buildingId,
            @Param("year") int year, @Param("month") int month);

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount - b.paidAmount), 0)
            FROM Bill b
            WHERE b.status IN ('PENDING', 'OVERDUE')
            AND (:buildingId IS NULL OR b.apartment.building.id = :buildingId)
            """)
    BigDecimal sumOutstandingDebt(@Param("buildingId") Long buildingId);

    /** Đếm hóa đơn PENDING/OVERDUE của một căn hộ */
    @Query("""
            SELECT COUNT(b) FROM Bill b
            WHERE b.apartment.id = :apartmentId
            AND b.status IN ('PENDING', 'PARTIALLY_PAID', 'OVERDUE')
            """)
    long countPendingByApartment(@Param("apartmentId") Long apartmentId);

    @Query("""
            SELECT
              COUNT(b) AS totalBills,
              SUM(CASE WHEN b.status = 'PAID' THEN 1 ELSE 0 END) AS paidBills,
              SUM(CASE WHEN b.status IN ('PENDING','PARTIALLY_PAID') THEN 1 ELSE 0 END) AS pendingPartialBills,
              SUM(CASE WHEN b.status = 'OVERDUE' THEN 1 ELSE 0 END) AS overdueBills,
              COALESCE(SUM(b.totalAmount), 0) AS totalAmount,
              COALESCE(SUM(b.paidAmount), 0) AS paidAmount
            FROM Bill b
            WHERE b.apartment.id = :apartmentId
            AND b.status != 'CANCELLED'
            """)
    BillSummaryProjection findBillSummaryByApartment(@Param("apartmentId") Long apartmentId);

    @Query("""
            SELECT
              COUNT(b),
              SUM(CASE WHEN b.status = 'PAID' THEN 1 ELSE 0 END),
              SUM(CASE WHEN b.status IN ('PENDING','PARTIALLY_PAID') THEN 1 ELSE 0 END),
              SUM(CASE WHEN b.status = 'OVERDUE' THEN 1 ELSE 0 END),
              COALESCE(SUM(b.totalAmount), 0),
              COALESCE(SUM(b.paidAmount), 0)
            FROM Bill b
            JOIN b.apartment a
            WHERE a.building.id = :buildingId
            AND b.status != 'CANCELLED'
            """)
    Object[] findBillSummaryByBuilding(@Param("buildingId") Long buildingId);
}
package com.apartmentmanagement.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    /** Tổng tiền đã lập hóa đơn */
    @Query("""
            SELECT COALESCE(SUM(b.totalAmount), 0)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            AND b.status != 'CANCELLED'
            """)
    BigDecimal sumBilledByBuilding(@Param("buildingId") Long buildingId);

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount), 0)
             FROM Bill b
             WHERE b.status != 'CANCELLED'
             """)
    BigDecimal sumAllBilled();

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

    /** Tổng tiền đã thu */
    @Query("""
            SELECT COALESCE(SUM(b.paidAmount), 0)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            """)
    BigDecimal sumCollectedByBuilding(@Param("buildingId") Long buildingId);

    @Query("""
            SELECT COALESCE(SUM(b.paidAmount), 0)
            FROM Bill b
            """)
    BigDecimal sumAllCollected();

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount - b.paidAmount), 0)
            FROM Bill b
            WHERE b.status != 'CANCELLED'
            AND b.paidAmount < b.totalAmount
            AND (:buildingId IS NULL OR b.apartment.building.id = :buildingId)
            """)
    BigDecimal sumOutstandingDebt(@Param("buildingId") Long buildingId);

    @Query("""
            SELECT COUNT(b)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            AND b.status != 'CANCELLED'
            AND b.paidAmount < b.totalAmount
            AND b.dueDate >= :today
            """)
    long countPendingBillsByBuilding(@Param("buildingId") Long buildingId, @Param("today") LocalDate today);

    @Query("""
            SELECT COUNT(b)
            FROM Bill b
            WHERE b.apartment.building.id = :buildingId
            AND b.status != 'CANCELLED'
            AND b.paidAmount < b.totalAmount
            AND b.dueDate < :today
            """)
    long countOverdueBillsByBuilding(@Param("buildingId") Long buildingId, @Param("today") LocalDate today);

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

    @Query("""
            SELECT b FROM Bill b
            WHERE b.apartment.id = :apartmentId
            AND (:status IS NULL OR b.status = :status)
            AND (:year IS NULL OR YEAR(b.billingMonth) = :year)
                """)
    Page<Bill> findByApartmentId(@Param("apartmentId") Long apartmentId,
            @Param("status") String status,
            @Param("year") Integer year,
            Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount - b.paidAmount), 0)
            FROM Bill b
            WHERE b.apartment.id = :apartmentId
            AND b.status not In ('PAID','CANCELLED')
            """)
    BigDecimal sumTotalOutstanding(@Param("apartmentId") Long apartmentId);

    @Query("""
            SELECT COUNT(b)
            FROM Bill b
            WHERE b.apartment.id = :apartmentId
            AND b.status = 'OVERDUE'
            """)
    Long countOverdueBills(@Param("apartmentId") Long apartmentId);

    /** Đếm số căn hộ đang nợ */
    @Query("""
            SELECT COUNT(DISTINCT b.apartment.id) FROM Bill b
            WHERE b.status != 'CANCELLED'
            AND b.paidAmount < b.totalAmount
            AND (:buildingId IS NULL OR b.apartment.building.id = :buildingId)
            """)
    long countDebtors(@Param("buildingId") Long buildingId);

    /** Thống kê doanh thu theo từng tháng (6 tháng gần nhất) */
    @Query(value = """
            SELECT
                TO_CHAR(billing_month, 'YYYY-MM') AS period,
                SUM(total_amount)                 AS billed,
                SUM(paid_amount)                  AS collected
            FROM bills b
            JOIN apartments a ON b.apartment_id = a.id
            WHERE a.building_id = :buildingId
              AND b.status != 'CANCELLED'
              AND b.billing_month >= :fromDate
            GROUP BY TO_CHAR(billing_month, 'YYYY-MM')
            ORDER BY period
            """, nativeQuery = true)
    List<Object[]> findMonthlyRevenue(
            @Param("buildingId") Long buildingId,
            @Param("fromDate") LocalDate fromDate);

    @Query(value = """
            SELECT
                TO_CHAR(billing_month, 'YYYY-MM') AS period,
                SUM(total_amount)                 AS billed,
                SUM(paid_amount)                  AS collected
            FROM bills b
            JOIN apartments a ON b.apartment_id = a.id
            WHERE b.status != 'CANCELLED'
              AND b.billing_month >= :fromDate
            GROUP BY TO_CHAR(billing_month, 'YYYY-MM')
            ORDER BY period
            """, nativeQuery = true)
    List<Object[]> findMonthlyRevenueFromDate(@Param("fromDate") LocalDate fromDate);

    /** Danh sách hóa đơn chưa thanh toán (debt report) */
    @Query("""
            SELECT b FROM Bill b
            JOIN FETCH b.apartment a
            JOIN FETCH a.building bl
            WHERE b.status != 'CANCELLED'
            AND b.paidAmount < b.totalAmount
            AND (:buildingId IS NULL OR bl.id = :buildingId)
            ORDER BY b.dueDate ASC
            """)
    List<Bill> findOutstandingBills(@Param("buildingId") Long buildingId);
}

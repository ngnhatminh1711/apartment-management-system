package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.FeeConfig;
import com.apartmentmanagement.enums.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeConfigRepository extends JpaRepository<FeeConfig, Long> {

    /** Bảng giá hiện tại của toà nhà (effectiveTo IS NULL) */
    List<FeeConfig> findByBuildingIdAndEffectiveToIsNull(Long buildingId);

    /** Giá đang áp dụng của 1 loại phí trong 1 toà nhà */
    @Query("""
        SELECT fc FROM FeeConfig fc
        WHERE fc.building.id = :buildingId
        AND fc.feeType = :feeType
        AND fc.effectiveTo IS NULL
        """)
    Optional<FeeConfig> findCurrentByBuildingAndType(
        @Param("buildingId") Long buildingId,
        @Param("feeType")    FeeType feeType
    );

    /** Tất cả lịch sử giá của 1 toà nhà */
    @Query("""
        SELECT fc FROM FeeConfig fc
        WHERE fc.building.id = :buildingId
        AND (:feeType IS NULL OR fc.feeType = :feeType)
        ORDER BY fc.effectiveFrom DESC
        """)
    List<FeeConfig> findHistory(
        @Param("buildingId") Long buildingId,
        @Param("feeType")    FeeType feeType
    );

    /** Kiểm tra có hóa đơn nào dùng config này chưa */
    @Query("""
        SELECT COUNT(bi) > 0 FROM BillItem bi
        WHERE bi.feeType = :feeType
        AND bi.bill.apartment.building.id = :buildingId
        AND bi.bill.createdAt >= :fromDate
        """)
    boolean isConfigUsedByBills(
        @Param("buildingId") Long buildingId,
        @Param("feeType")    FeeType feeType,
        @Param("fromDate")   java.time.LocalDateTime fromDate
    );
}
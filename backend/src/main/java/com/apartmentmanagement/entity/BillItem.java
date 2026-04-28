package com.apartmentmanagement.entity;

import java.math.BigDecimal;

import com.apartmentmanagement.enums.FeeType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bill_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "fee_type", nullable = false, length = 30)
    private FeeType feeType;

    /**
     * Mô tả chi tiết dòng phí, ví dụ:
     * "Điện tháng 6: 150kWh x 3.500đ"
     */
    @Column(length = 200)
    private String description;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    /** Chỉ số đầu kỳ (điện/nước). NULL với phí cố định */
    @Column(name = "reading_start", precision = 10, scale = 3)
    private BigDecimal readingStart;

    @Column(name = "reading_end", precision = 10, scale = 3)
    private BigDecimal readingEnd;

    // --Relationships--

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    // --Helper--

    /** Tính amount từ quantity và unitPrice */
    public void calculateAmount() {
        if (quantity != null && unitPrice != null)
            this.amount = this.quantity.multiply(this.unitPrice);
    }
    

}

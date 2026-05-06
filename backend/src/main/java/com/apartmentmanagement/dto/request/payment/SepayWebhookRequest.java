package com.apartmentmanagement.dto.request.payment;

import java.math.BigDecimal;

import lombok.Data;

/**
 * Payload SePay gửi qua webhook khi có giao dịch.
 * Ref: https://docs.sepay.vn/tich-hop-webhooks.html
 */
@Data
public class SepayWebhookRequest {

    /** ID giao dịch trên SePay */
    private Long id;

    /** Brand name của ngân hàng (VD: "MBBank", "Vietcombank") */
    private String gateway;

    /** Thời gian giao dịch – format: "2024-07-25 14:02:37" */
    private String transactionDate;

    /** Số tài khoản ngân hàng nhận/gửi */
    private String accountNumber;

    /** Tài khoản phụ / VA (nếu có) */
    private String subAccount;

    /**
     * Mã code thanh toán SePay tự nhận diện.
     * VD: "APT1042" nếu config prefix là "APT".
     */
    private String code;

    /** Nội dung chuyển khoản gốc */
    private String content;

    /**
     * Loại giao dịch:
     * "in" = tiền vào tài khoản (thanh toán thành công)
     * "out" = tiền ra
     */
    private String transferType;

    /** Số tiền giao dịch */
    private BigDecimal transferAmount;

    /** Số dư lũy kế */
    private BigDecimal accumulated;

    /** Mã tham chiếu ngân hàng */
    private String referenceCode;
}
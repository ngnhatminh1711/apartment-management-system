package com.apartmentmanagement.dto.response.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class PaymentQrResponse {

    private Long paymentId;
    private Long billId;
    private BigDecimal amount;
    private String paymentRef; // VD: APT1042
    private String qrImageUrl; // URL ảnh QR VietQR
    private String bankCode;
    private String accountNumber;
    private String accountName;
    private String transferContent; // Nội dung chuyển khoản
    private LocalDateTime expiredAt; // QR hết hạn lúc
    private String status; // PENDING / SUCCESS / EXPIRED
}

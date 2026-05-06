package com.apartmentmanagement.service.payment;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.payment.PaymentQrResponse;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.entity.Payment;
import com.apartmentmanagement.enums.PaymentMethod;
import com.apartmentmanagement.enums.PaymentStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.PaymentRepository;
import com.apartmentmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SepayService {

    private final BillRepository billRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;

    @Value("${sepay.bank-account-number}")
    private String bankAccountNumber;
    @Value("${sepay.bank-code}")
    private String bankCode;
    @Value("${sepay.account-name}")
    private String accountName;
    @Value("${sepay.payment-prefix}")
    private String paymentPrefix;
    @Value("${sepay.payment-timeout-minutes:15}")
    private int timeoutMinutes;

    // Template QR VietQR
    private static final String QR_URL_TEMPLATE = "https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png"
            +
            "?amount={amount}&addInfo={content}&accountName={accountName}";

    // ── Tạo QR thanh toán ─────────────────────────────────────────────────────

    @Transactional
    public PaymentQrResponse initPayment(Long billId, BigDecimal requestedAmount, Long userId) {
        Bill bill = billRepo.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));

        BigDecimal remaining = bill.getTotalAmount().subtract(bill.getPaidAmount());
        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AppException(ErrorCode.BILL_ALREADY_PAID);
        }

        // Xác định số tiền thanh toán
        BigDecimal amount = (requestedAmount != null && requestedAmount.compareTo(remaining) <= 0)
                ? requestedAmount
                : remaining;

        // Tạo mã thanh toán: APT{billId}
        String paymentRef = paymentPrefix + billId;

        // Tạo Payment record
        Payment payment = paymentRepo.findByBillIdAndUserId(billId, userId)
                .orElseGet(() -> Payment.builder()
                        .bill(bill)
                        .user(userRepo.findById(userId)
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)))
                        .paymentMethod(PaymentMethod.BANK_TRANSFER)
                        .build());

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new AppException(ErrorCode.BILL_ALREADY_PAID);
        }

        payment.setAmount(amount);
        payment.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
        payment.setTransactionRef(paymentRef);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaidAt(null);
        payment.setPaymentNote(null);
        payment = paymentRepo.save(payment);

        // Tạo QR URL
        String transferContent = URLEncoder.encode(paymentRef, StandardCharsets.UTF_8);
        String qrUrl = QR_URL_TEMPLATE
                .replace("{bankCode}", bankCode)
                .replace("{accountNumber}", bankAccountNumber)
                .replace("{amount}", amount.toPlainString())
                .replace("{content}", transferContent)
                .replace("{accountName}", URLEncoder.encode(accountName, StandardCharsets.UTF_8));

        log.info("Khởi tạo thanh toán SePay: billId={}, amount={}, ref={}", billId, amount, paymentRef);

        return PaymentQrResponse.builder()
                .paymentId(payment.getId())
                .billId(billId)
                .amount(amount)
                .paymentRef(paymentRef)
                .qrImageUrl(qrUrl)
                .bankCode(bankCode)
                .accountNumber(bankAccountNumber)
                .accountName(accountName)
                .transferContent(paymentRef)
                .expiredAt(LocalDateTime.now().plusMinutes(timeoutMinutes))
                .status("PENDING")
                .build();
    }

    // ── Kiểm tra trạng thái thanh toán ───────────────────────────────────────

    @Transactional(readOnly = true)
    public PaymentStatus checkStatus(Long paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return payment.getStatus();
    }

    // ── Xử lý Webhook từ SePay ────────────────────────────────────────────────

    @Transactional
    public void processWebhook(String code, BigDecimal amount, String transactionRef,
            Long sePayTransactionId, String content) {

        log.info("SePay webhook nhận được: code={}, amount={}, ref={}", code, amount, sePayTransactionId);

        // Tìm mã thanh toán trong content nếu code null
        String resolvedCode = code;
        if (resolvedCode == null && content != null) {
            // Tìm pattern APT\d+ trong nội dung
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile(paymentPrefix + "\\d+")
                    .matcher(content.toUpperCase());
            if (m.find())
                resolvedCode = m.group();
        }

        if (resolvedCode == null || !resolvedCode.startsWith(paymentPrefix)) {
            log.warn("Webhook SePay: không nhận diện được mã thanh toán. Content: {}", content);
            return;
        }

        // Extract billId từ mã: APT1042 → 1042
        long billId;
        try {
            billId = Long.parseLong(resolvedCode.substring(paymentPrefix.length()));
        } catch (NumberFormatException e) {
            log.error("Webhook SePay: không parse được billId từ code={}", resolvedCode);
            return;
        }

        Bill bill = billRepo.findById(billId).orElse(null);
        if (bill == null) {
            log.warn("Webhook SePay: không tìm thấy bill ID={}", billId);
            return;
        }

        // Tìm Payment đang PENDING cho bill này
        Payment payment = paymentRepo
                .findFirstByBillIdAndStatusOrderByCreatedAtDesc(billId, PaymentStatus.PENDING)
                .orElse(null);

        if (payment == null) {
            // Không tìm thấy payment PENDING → tạo mới (thanh toán trực tiếp, không qua
            // app)
            payment = Payment.builder()
                    .bill(bill)
                    .user(bill.getApartment().getResidentHistory().stream()
                            .filter(ar -> ar.getMoveOutDate() == null && ar.getIsPrimary())
                            .findFirst()
                            .map(ar -> ar.getUser())
                            .orElse(null))
                    .amount(amount)
                    .paymentMethod(PaymentMethod.BANK_TRANSFER)
                    .transactionRef(String.valueOf(sePayTransactionId))
                    .status(PaymentStatus.PENDING)
                    .build();
        }

        // Cập nhật payment thành công
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        payment.setAmount(amount);
        payment.setTransactionRef(String.valueOf(sePayTransactionId));
        payment.setPaymentNote("SePay auto-confirmed. Ref: " + resolvedCode);
        paymentRepo.save(payment);

        // Cập nhật Bill
        BigDecimal newPaidAmount = bill.getPaidAmount().add(amount);
        bill.setPaidAmount(newPaidAmount);

        if (newPaidAmount.compareTo(bill.getTotalAmount()) >= 0) {
            bill.setStatus(com.apartmentmanagement.enums.BillStatus.PAID);
            log.info("Bill #{} đã thanh toán đầy đủ. Tổng: {}", billId, bill.getTotalAmount());
        } else {
            bill.setStatus(com.apartmentmanagement.enums.BillStatus.PARTIALLY_PAID);
            log.info("Bill #{} thanh toán một phần: {}/{}", billId, newPaidAmount, bill.getTotalAmount());
        }
        billRepo.save(bill);

        log.info("Webhook SePay xử lý thành công: billId={}, amount={}", billId, amount);
    }
}

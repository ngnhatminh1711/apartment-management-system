package com.apartmentmanagement.controller.resident;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.payment.PaymentInitRequest;
import com.apartmentmanagement.dto.response.ApiResponse;
import com.apartmentmanagement.dto.response.payment.PaymentQrResponse;
import com.apartmentmanagement.dto.response.payment.PaymentStatusResponse;
import com.apartmentmanagement.enums.PaymentStatus;
import com.apartmentmanagement.security.SecurityUtils;
import com.apartmentmanagement.service.payment.SepayService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/resident/payments")
@PreAuthorize("hasRole('RESIDENT')")
@RequiredArgsConstructor
public class ResidentOnlinePaymentController {

    private final SepayService sepayService;

    /**
     * POST /api/v1/resident/payments/init
     * Khởi tạo thanh toán – trả về QR code và thông tin chuyển khoản.
     */
    @PostMapping("/init")
    public ResponseEntity<ApiResponse<PaymentQrResponse>> initPayment(
            @Valid @RequestBody PaymentInitRequest req) {

        Long userId = SecurityUtils.getCurrentUserId();
        PaymentQrResponse qr = sepayService.initPayment(req.getBillId(), req.getAmount(), userId);
        return ResponseEntity.ok(ApiResponse.success("Khởi tạo thanh toán thành công", qr));
    }

    /**
     * GET /api/v1/resident/payments/{paymentId}/status
     * Polling để kiểm tra trạng thái thanh toán (frontend gọi mỗi 3 giây).
     */
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<ApiResponse<PaymentStatusResponse>> getStatus(
            @PathVariable Long paymentId) {

        PaymentStatus status = sepayService.checkStatus(paymentId);
        String message = switch (status) {
            case SUCCESS -> "Thanh toán thành công!";
            case FAILED -> "Thanh toán thất bại";
            case PENDING -> "Đang chờ thanh toán...";
            default -> status.name();
        };

        return ResponseEntity.ok(ApiResponse.success(
                PaymentStatusResponse.builder()
                        .paymentId(paymentId)
                        .status(status)
                        .message(message)
                        .build()));
    }
}

package com.apartmentmanagement.controller.webhook;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apartmentmanagement.dto.request.payment.SepayWebhookRequest;
import com.apartmentmanagement.service.payment.SepayService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Endpoint nhận webhook từ SePay.
 * KHÔNG cần @PreAuthorize – SePay gọi trực tiếp với API Key header.
 * URL: POST /api/v1/webhook/sepay
 */
@RestController
@RequestMapping("/api/v1/webhook")
@RequiredArgsConstructor
@Slf4j
public class SepayWebhookController {

    private final SepayService sepayService;

    @Value("${sepay.webhook-api-key}")
    private String expectedApiKey;

    @PostMapping("/sepay")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @RequestBody SepayWebhookRequest payload) {

        // 2. Chỉ xử lý giao dịch tiền vào
        if (!"in".equalsIgnoreCase(payload.getTransferType())) {
            log.info("⏭Bỏ qua giao dịch tiền ra. GD SePay ID: {}", payload.getId());
            return ResponseEntity.ok(Map.of("success", true, "message", "Ignored outbound transaction"));
        }

        // 3. Validate dữ liệu cơ bản
        if (payload.getTransferAmount() == null || payload.getTransferAmount().signum() <= 0) {
            log.warn("Webhook SePay: transferAmount không hợp lệ. GD: {}", payload.getId());
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid amount"));
        }

        // 4. Xử lý thanh toán
        try {
            sepayService.processWebhook(
                    payload.getCode(),
                    payload.getTransferAmount(),
                    payload.getReferenceCode(),
                    payload.getId(),
                    payload.getContent());
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment processed"));
        } catch (Exception e) {
            log.error("Lỗi xử lý webhook SePay: {}", e.getMessage(), e);
            // Trả về 500 để SePay retry
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
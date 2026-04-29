package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.PaymentItemResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.entity.Payment;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.BillStatus;
import com.apartmentmanagement.enums.PaymentMethod;
import com.apartmentmanagement.enums.PaymentStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.PaymentRepository;

@ExtendWith(MockitoExtension.class)
class ResidentPaymentServiceTest {

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private BillRepository billRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private ResidentPaymentService residentPaymentService;

    @Test
    void getMyPayments_withoutBillId_returnsApartmentPayments() {
        Apartment apartment = Apartment.builder().id(10L).apartmentNumber("A101").build();
        Bill bill = Bill.builder()
                .id(1L)
                .apartment(apartment)
                .billingMonth(LocalDate.of(2026, 4, 1))
                .totalAmount(new BigDecimal("1000.00"))
                .status(BillStatus.PAID)
                .build();
        Payment payment = Payment.builder()
                .id(2L)
                .bill(bill)
                .amount(new BigDecimal("1000.00"))
                .paymentMethod(PaymentMethod.CASH)
                .status(PaymentStatus.SUCCESS)
                .paidAt(LocalDateTime.now())
                .build();

        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(paymentRepository.findByApartmentAndOptions(eq(10L), eq("SUCCESS"), eq("CASH"), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(payment)));

        PageResponse<PaymentItemResponse> response = residentPaymentService
                .getMyPayments(99L, null, "success", "cash", LocalDate.now().minusDays(1), LocalDate.now(), 0, 10);

        assertEquals(1, response.getContent().size());
        assertEquals("SUCCESS", response.getContent().get(0).getStatus());
        assertEquals("A101", response.getContent().get(0).getBill().getApartmentNumber());
    }

    @Test
    void getMyPayments_withOtherApartmentBill_throwsBillNotYours() {
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder()
                        .apartment(Apartment.builder().id(10L).build())
                        .build()));
        when(billRepository.findById(1L)).thenReturn(Optional.of(Bill.builder()
                .apartment(Apartment.builder().id(20L).build())
                .build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentPaymentService.getMyPayments(99L, 1L, null, null, null, null, 0, 10));

        assertEquals(ErrorCode.BILL_NOT_YOURS, exception.getErrorCode());
    }

    @Test
    void getMyPaymentDetails_whenPaymentBelongsToUser_returnsDetails() {
        User user = User.builder().id(99L).build();
        Bill bill = Bill.builder()
                .id(1L)
                .billingMonth(LocalDate.of(2026, 4, 1))
                .totalAmount(new BigDecimal("1000.00"))
                .build();
        Payment payment = Payment.builder()
                .id(2L)
                .user(user)
                .bill(bill)
                .amount(new BigDecimal("1000.00"))
                .paymentMethod(PaymentMethod.VNPAY)
                .transactionRef("TXN-1")
                .status(PaymentStatus.SUCCESS)
                .paymentNote("Paid")
                .build();
        when(paymentRepository.findById(2L)).thenReturn(Optional.of(payment));

        PaymentItemResponse response = residentPaymentService.getMyPaymentDetails(99L, 2L);

        assertEquals(2L, response.getId());
        assertEquals("TXN-1", response.getTransactionRef());
        assertEquals("2026-04", response.getBill().getBillingMonth());
    }

    @Test
    void getMyPaymentDetails_whenPaymentBelongsToOtherUser_throwsPaymentNotYours() {
        Payment payment = Payment.builder().user(User.builder().id(100L).build()).build();
        when(paymentRepository.findById(2L)).thenReturn(Optional.of(payment));

        AppException exception = assertThrows(AppException.class,
                () -> residentPaymentService.getMyPaymentDetails(99L, 2L));

        assertEquals(ErrorCode.PAYMENT_NOT_YOURS, exception.getErrorCode());
    }
}

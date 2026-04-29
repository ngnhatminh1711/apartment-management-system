package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.BillItemResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.entity.BillItem;
import com.apartmentmanagement.entity.Payment;
import com.apartmentmanagement.enums.BillStatus;
import com.apartmentmanagement.enums.FeeType;
import com.apartmentmanagement.enums.PaymentMethod;
import com.apartmentmanagement.enums.PaymentStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.PaymentRepository;

@ExtendWith(MockitoExtension.class)
class ResidentBillServiceTest {

    @Mock
    private BillRepository billRepository;

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private ResidentBillService residentBillService;

    @Test
    void getMyBills_returnsMappedPageAndSummary() {
        Apartment apartment = Apartment.builder().id(10L).apartmentNumber("A101").build();
        ApartmentResident resident = ApartmentResident.builder().apartment(apartment).build();
        Bill bill = Bill.builder()
                .id(1L)
                .apartment(apartment)
                .billingMonth(LocalDate.of(2026, 4, 1))
                .totalAmount(new BigDecimal("1000.00"))
                .paidAmount(new BigDecimal("250.00"))
                .status(BillStatus.PARTIALLY_PAID)
                .dueDate(LocalDate.now().plusDays(3))
                .build();

        when(apartmentResidentRepository.findByUser_Id(99L)).thenReturn(Optional.of(resident));
        when(billRepository.findByApartmentId(eq(10L), eq("PARTIALLY_PAID"), eq(2026), any()))
                .thenReturn(new PageImpl<>(List.of(bill)));
        when(billRepository.sumTotalOutstanding(10L)).thenReturn(new BigDecimal("750.00"));
        when(billRepository.countOverdueBills(10L)).thenReturn(2L);

        PageResponse<BillItemResponse> response = residentBillService.getMyBills(99L, "partially_paid", 2026, 0, 10);

        assertEquals(1, response.getContent().size());
        assertEquals("2026-04", response.getContent().get(0).getBillingMonth());
        assertEquals(new BigDecimal("750.00"), response.getContent().get(0).getRemainingAmount());
        assertEquals(new BigDecimal("750.00"), response.getSummary().getTotalOutstanding());
        assertEquals(2L, response.getSummary().getOverdueCount());
    }

    @Test
    void getMyBills_withInvalidStatus_throwsValidationError() {
        ApartmentResident resident = ApartmentResident.builder()
                .apartment(Apartment.builder().id(10L).build())
                .build();
        when(apartmentResidentRepository.findByUser_Id(99L)).thenReturn(Optional.of(resident));

        AppException exception = assertThrows(AppException.class,
                () -> residentBillService.getMyBills(99L, "wrong", null, 0, 10));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
    }

    @Test
    void getMyBillDetails_whenBillBelongsToResident_returnsItemsAndPayments() {
        Apartment apartment = Apartment.builder().id(10L).build();
        Bill bill = Bill.builder()
                .id(1L)
                .apartment(apartment)
                .billingMonth(LocalDate.of(2026, 4, 1))
                .totalAmount(new BigDecimal("1000.00"))
                .paidAmount(new BigDecimal("400.00"))
                .status(BillStatus.PENDING)
                .dueDate(LocalDate.now().plusDays(1))
                .items(List.of(BillItem.builder()
                        .feeType(FeeType.WATER)
                        .description("Water")
                        .quantity(new BigDecimal("10"))
                        .unitPrice(new BigDecimal("5"))
                        .amount(new BigDecimal("50"))
                        .build()))
                .build();
        Payment payment = Payment.builder()
                .amount(new BigDecimal("400.00"))
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .status(PaymentStatus.SUCCESS)
                .build();

        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(billRepository.findById(1L)).thenReturn(Optional.of(bill));
        when(paymentRepository.findByBillId(1L)).thenReturn(List.of(payment));

        BillItemResponse response = residentBillService.getMyBillDetails(99L, 1L);

        assertEquals(1L, response.getId());
        assertEquals(1, response.getItems().size());
        assertEquals(1, response.getMyPayments().size());
        assertEquals("BANK_TRANSFER", response.getMyPayments().get(0).getPaymentMethod());
    }

    @Test
    void getMyBillDetails_whenBillBelongsToOtherApartment_throwsBillNotYours() {
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder()
                        .apartment(Apartment.builder().id(10L).build())
                        .build()));
        when(billRepository.findById(1L)).thenReturn(Optional.of(Bill.builder()
                .apartment(Apartment.builder().id(20L).build())
                .build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentBillService.getMyBillDetails(99L, 1L));

        assertEquals(ErrorCode.BILL_NOT_YOURS, exception.getErrorCode());
    }
}

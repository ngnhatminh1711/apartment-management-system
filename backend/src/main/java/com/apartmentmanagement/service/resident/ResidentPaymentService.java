package com.apartmentmanagement.service.resident;

import java.time.LocalDate;
import java.time.YearMonth;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.BillItemResponse;
import com.apartmentmanagement.dto.response.resident.PaymentItemResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.entity.Payment;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;
import com.apartmentmanagement.repository.PaymentRepository;
import com.apartmentmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentPaymentService {
    private final ApartmentResidentRepository apartmentResidentRepository;  
    private final BillRepository billRepository;
    private final PaymentRepository paymentRepository;

        // --Payment Info 3--
     @Transactional(readOnly = true)
    public PageResponse<PaymentItemResponse> getMyPayments(Long userId, Long billId, String status, String paymentMethod, LocalDate from, LocalDate to, int page, int size) {
        ApartmentResident apartmentResident=apartmentResidentRepository.findByUser_Id(userId)
            .orElseThrow(()->new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        Pageable pageable=PageRequest.of(page,size, Sort.by("paidAt").descending());
        Page<Payment> paymentPage;
        status = (status != null) ? status.toUpperCase() : null;
        paymentMethod = (paymentMethod != null) ? paymentMethod.toUpperCase() : null;
        //Nếu có billId → kiểm tra bill đó có thuộc apartment của cư dân ko rồi mới lấy payment theo bill đó
        if (billId != null) {
            Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new AppException(ErrorCode.BILL_NOT_FOUND));

            if (!bill.getApartment().getId().equals(apartmentResident.getApartment().getId())) {
                throw new AppException(ErrorCode.BILL_NOT_YOURS);
            }

            paymentPage = paymentRepository.findByBillIdAndOptions(
                    billId, status, paymentMethod, from, to, pageable
            );

        } else {
            //  Không có billId → lấy toàn bộ payments theo apartment
            paymentPage = paymentRepository.findByApartmentAndOptions(
                    apartmentResident.getApartment().getId(),
                    status,
                    paymentMethod,
                    from,
                    to,
                    pageable
            );
        }
        PageResponse<PaymentItemResponse> pageResponse=PageResponse.of(paymentPage, p -> PaymentItemResponse.builder()
                .id(p.getId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod().name())
                .transactionRef(p.getTransactionRef())
                .status(p.getStatus().name())
                .paidAt(p.getPaidAt())
                .bill(BillItemResponse.builder()
                    .id(p.getBill().getId())
                    .billingMonth(YearMonth.from(p.getBill().getBillingMonth()).toString())
                    .totalAmount(p.getBill().getTotalAmount())
                    .build())
                .build()
        );
        
        return pageResponse;
    }

    @Transactional(readOnly = true)
    public PaymentItemResponse getMyPaymentDetails(Long userId, Long id){
        Payment payment=paymentRepository.findById(id)
            .orElseThrow(()->new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        if(!payment.getUser().getId().equals(userId))
            throw new AppException(ErrorCode.PAYMENT_NOT_YOURS);
        
        return PaymentItemResponse.builder()
            .id(payment.getId())
            .amount(payment.getAmount())
            .paymentMethod(payment.getPaymentMethod().name())
            .transactionRef(payment.getTransactionRef())
            .status(payment.getStatus().name())
            .paidAt(payment.getPaidAt())
            .paymentNote(payment.getPaymentNote() != null ? payment.getPaymentNote().toString() : "")
            .bill(BillItemResponse.builder()
                    .id(payment.getBill().getId())
                    .billingMonth(YearMonth.from(payment.getBill().getBillingMonth()).toString())
                    .totalAmount(payment.getBill().getTotalAmount())
                    .build())
            .build();
    }
    
}

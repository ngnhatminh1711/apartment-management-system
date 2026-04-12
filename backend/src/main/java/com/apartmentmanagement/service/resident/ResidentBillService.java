package com.apartmentmanagement.service.resident;


import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.resident.BillItemResponse;
import com.apartmentmanagement.dto.response.resident.BillPageResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Bill;
import com.apartmentmanagement.enums.BillStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.BillRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentBillService {
    private final BillRepository billRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;
     // -- Bill Info 2-- 

    @Transactional(readOnly = true)
    public PageResponse<BillItemResponse> getMyBills(Long userId, String status,int year, int page, int size){ 
        
        ApartmentResident apartmentResident=apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(()->new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        BillStatus billStatus=null;
        try {
            if(status!=null)
                billStatus=BillStatus.valueOf(status.toUpperCase());
            } catch (Exception e) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }
        Pageable pageable=PageRequest.of(page, size, Sort.by("dueDate").descending());
        Page<Bill> billPage=billRepository.findByApartmentId(apartmentResident.getApartment().getId(), billStatus.name(), year, pageable);
        PageResponse<BillItemResponse> pageResponse=PageResponse.of(billPage, b -> BillItemResponse.builder()
                .id(b.getId())
                .billingMonth(YearMonth.from(b.getBillingMonth()).toString())
                .totalAmount(b.getTotalAmount())
                .paidAmount(b.getPaidAmount())
                .status(b.getStatus().name())
                .remainingAmount(b.getRemainingAmount())
                .dueDate(b.getDueDate())
                .isOverdue(b.isOverdue())
                .build()
            );
        BillPageResponse.Summary summary= BillPageResponse.Summary.builder()
            .totalOutstanding(billRepository.sumTotalOutstanding(apartmentResident.getApartment().getId()))
            .overdueCount(billRepository.countOverdueBills(apartmentResident.getApartment().getId()))
            .build();
        pageResponse.setSummary(summary);
        return pageResponse;
    }

    public BillItemResponse getMyBillDetails(Long userId, Long billId){
        ApartmentResident apartmentResident=apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(()->new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        Bill bill=billRepository.findById(billId)
            .orElseThrow(()->new AppException(ErrorCode.BILL_NOT_FOUND));
        if(!bill.getApartment().getId().equals(apartmentResident.getApartment().getId()))
            throw new AppException(ErrorCode.BILL_NOT_YOURS);
        return BillItemResponse.builder()
            .id(bill.getId())
            .billingMonth(YearMonth.from(bill.getBillingMonth()).toString())
            .totalAmount(bill.getTotalAmount())
            .paidAmount(bill.getPaidAmount())
            .remainingAmount(bill.getRemainingAmount())
            .status(bill.getStatus().name())
            .dueDate(bill.getDueDate())
            .items(bill.getItems())
            .payments(bill.getPayments())
            .build();
    }


}

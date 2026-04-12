package com.apartmentmanagement.repository;

import java.time.LocalDate;


import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.apartmentmanagement.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("SELECT p FROM Payment p WHERE (:billId IS NULL OR p.bill.id = :billId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod) AND " +
            "(:from IS NULL OR p.paidAt >= :from) AND " +
            "(:to IS NULL OR p.paidAt <= :to)")
    Page<Payment> findByBillIdAndOptions
    (Long billId, String status, String paymentMethod,
         LocalDate from, LocalDate to, Pageable pageable);
    
    @Query("SELECT p FROM Payment p WHERE  p.bill.apartment.id = :apartmentId AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod) AND " +
            "(:from IS NULL OR p.paidAt >= :from) AND " +
            "(:to IS NULL OR p.paidAt <= :to)")
    Page<Payment> findByApartmentAndOptions(
                    Long apartmentId,
                    String status,
                    String paymentMethod,
                    LocalDate from,
                    LocalDate to,
                    Pageable pageable
            );
}

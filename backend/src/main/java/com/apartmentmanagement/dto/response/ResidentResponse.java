package com.apartmentmanagement.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.Vehicle;

import lombok.*;

@Getter
@Setter
@Builder

public class ResidentResponse {

    private Long id;
    private String fullName;
    private String email;
    private String idCard;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private List<String> roles;
    private ApartmentResponse currentApartment;
   private Integer unreadNotificationCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}

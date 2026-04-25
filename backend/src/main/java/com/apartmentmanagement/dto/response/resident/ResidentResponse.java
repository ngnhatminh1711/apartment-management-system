package com.apartmentmanagement.dto.response.resident;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import lombok.*;

@Getter
@Setter
@Builder

public class ResidentResponse  {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String idCard;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private Set<String> roles;
    private ApartmentResponse currentApartment;
    private Integer unreadNotificationCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate moveInDate;
}


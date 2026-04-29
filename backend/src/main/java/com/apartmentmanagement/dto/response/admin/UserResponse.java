package com.apartmentmanagement.dto.response.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RoleName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String idCard;
    private Boolean isActive;
    private Set<RoleName> roles;
    private ApartmentRef currentApartment;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class ApartmentRef {
        private Long id;
        private String apartmentNumber;
        private String buildingName;
    }

    public static UserResponse from(User u, ApartmentRef apartment) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .dateOfBirth(u.getDateOfBirth())
                .idCard(u.getIdCard())
                .isActive(u.getIsActive())
                .roles(u.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(Collectors.toSet()))
                .currentApartment(apartment)
                .createdAt(u.getCreatedAt())
                .build();
    }
}
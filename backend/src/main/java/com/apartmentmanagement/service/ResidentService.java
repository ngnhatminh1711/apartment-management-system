package com.apartmentmanagement.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.response.ApartmentResponse;
import com.apartmentmanagement.dto.response.ResidentResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.nimbusds.jwt.JWT;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;

     @Transactional(readOnly = true)
    public ResidentResponse getMe(){
        // Lấy email từ JWT
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        // Lấy user theo email
        User user=userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));
        //Lấy apartment hiện tại 
        ApartmentResident apartmentResident = apartmentResidentRepository
            .findByUserIdAndIsPrimaryTrue(user.getId())
            .orElse(null);

        ApartmentResponse apartmentResponse=null;
        if(apartmentResident!=null){
                apartmentResponse=apartmentResponse.builder().
                        id(apartmentResident.getApartment().getId())
                        .apartmentNumber(apartmentResident.getApartment().getApartmentNumber())
                        .moveInDate(apartmentResident.getMoveInDate())
                        .floor(apartmentResident.getApartment().getFloor())
                        .isPrimary(apartmentResident.getIsPrimary()) 
                        .build();
        }
        int unRead =notificationRepository
        .countByUserIdAndIsReadFalse(user.getId());
        return ResidentResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .idCard(user.getIdCard())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles().stream().map(role->role.getName().name()).toList())
                .currentApartment(apartmentResponse)
                .unreadNotificationCount(unRead)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
}

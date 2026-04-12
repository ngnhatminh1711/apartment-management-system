package com.apartmentmanagement.service.resident;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.resident.UpdateInfoRequest;
import com.apartmentmanagement.dto.response.resident.ApartmentResponse;
import com.apartmentmanagement.dto.response.resident.BuildingRespone;
import com.apartmentmanagement.dto.response.resident.HouseMembersResponse;
import com.apartmentmanagement.dto.response.resident.ResidentResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResidentInfoService {
    private final ApartmentResidentRepository apartmentResidentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    // -- Resident Info 4--
    @Transactional(readOnly = true)
    public ResidentResponse getMe(Long userId){
        // Lấy user theo id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        //Lấy apartment hiện tại 
        ApartmentResident apartmentResident = apartmentResidentRepository
            .findByUser_IdAndIsPrimaryTrue(user.getId())
            .orElseThrow(()-> new AppException(ErrorCode.APARTMENT_NOT_FOUND));

        ApartmentResponse apartmentResponse=ApartmentResponse.builder().
            id(apartmentResident.getApartment().getId())
            .apartmentNumber(apartmentResident.getApartment().getApartmentNumber())
            .buildingName(apartmentResident.getApartment().getBuilding().getName())
            .moveInDate(apartmentResident.getMoveInDate())
            .floor(apartmentResident.getApartment().getFloor())
            .isPrimary(apartmentResident.getIsPrimary()) 
            .build();
        
        int unRead =notificationRepository
            .countByUser_IdAndIsReadFalse(user.getId());

        return ResidentResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .idCard(user.getIdCard())
                .dateOfBirth(user.getDateOfBirth())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(java.util.stream.Collectors.toSet()))
                .currentApartment(apartmentResponse)
                .unreadNotificationCount(unRead)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
    
    @Transactional
    public void changeInfoUser(Long userId, UpdateInfoRequest request ){
        User user =userRepository.findById(userId).
        orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        if(request.getPhone()!=null){
            user.setPhone(request.getPhone());
        }
        if (request.getDateOfBirth() != null && request.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if(request.getAvatarUrl()!=null){
            user.setAvatarUrl(request.getAvatarUrl());
        }
        userRepository.save(user);
    }
    
    @Transactional
    public ApartmentResponse getMyApartment(Long userId){
        
        ApartmentResident apartmentResident=apartmentResidentRepository.
            findByUser_Id(userId).orElseThrow(()->new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        
        Building building=apartmentResident.getApartment().getBuilding();

        BuildingRespone buildingRespone=BuildingRespone.builder()
            .id(building.getId()).name(building.getName())
            .address(building.getAddress())
            .managerName(building.getManager().getFullName())
            .managerPhone(building.getManager().getPhone())
            .build();

        List<ApartmentResident>members=apartmentResidentRepository.findByApartment_Id(apartmentResident.getApartment().getId());
        
        List<HouseMembersResponse> houseMembersResponses=members.stream()
            .map(m ->
                HouseMembersResponse.builder()
                .id(m.getUser().getId())
                .fullName(m.getUser().getFullName())
                .isPrimary(m.getIsPrimary())
                .moveInDate(m.getMoveInDate())
                .build()
            ).collect(java.util.stream.Collectors.toList());

        ApartmentResponse apartmentResponse= ApartmentResponse.builder()
                            .id(apartmentResident.getId())
                            .apartmentNumber(apartmentResident.getApartment().getApartmentNumber())
                            .floor(apartmentResident.getApartment().getFloor())
                            .areaM2(apartmentResident.getApartment().getAreaM2())
                            .numBedrooms(apartmentResident.getApartment().getNumBedrooms())
                            .numBathrooms(apartmentResident.getApartment().getNumBathrooms())
                            .direction(apartmentResident.getApartment().getDirection())
                            .buildingRespone(buildingRespone)
                            .householdMembers(houseMembersResponses)
                            .moveInDate(apartmentResident.getMoveInDate())
                            .build();
        return apartmentResponse;
    }
    
   



}

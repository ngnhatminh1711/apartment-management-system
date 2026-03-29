package com.apartmentmanagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.catalina.connector.Response;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.CreateVehicleRequest;
import com.apartmentmanagement.dto.request.UpdateInfoRequest;
import com.apartmentmanagement.dto.response.ApartmentResponse;
import com.apartmentmanagement.dto.response.BuildingRespone;
import com.apartmentmanagement.dto.response.HouseMembersResponse;
import com.apartmentmanagement.dto.response.ResidentResponse;
import com.apartmentmanagement.dto.response.ServiceRegistrationResponse;
import com.apartmentmanagement.dto.response.ServiceTypeResponse;
import com.apartmentmanagement.dto.response.VehicleResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.ServiceRegistration;
import com.apartmentmanagement.entity.ServiceType;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.ServiceRegistrationRepository;
import com.apartmentmanagement.repository.ServiceTypeRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;
    private final VehicleRepository vehicleRepository;
    private final ServiceRegistrationRepository serviceRegistrationRepository;
    private final ServiceTypeRepository serviceTypeRepository;

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
    public void ChangeInfoUser(Long userId, UpdateInfoRequest request ){
        User user =userRepository.findById(userId).
        orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        user.setFullName(request.getFullName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAvatarUrl(request.getAvatarUrl());
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
    


    @Transactional(readOnly = true)
    public List<VehicleResponse> getMyVehicles(Long userId) {
        
        List<Vehicle> vehicles = vehicleRepository.findByUser_Id(userId);

        return vehicles.stream()
                .map(v -> VehicleResponse.builder()
                        .id(v.getId())
                        .vehicleType(v.getVehicleType().name())
                        .licensePlate(v.getLicensePlate())
                        .brand(v.getBrand())
                        .model(v.getModel())
                        .color(v.getColor())
                        .status(v.getStatus().name())
                        .registeredAt(v.getRegisteredAt())
                        .approvedAt(v.getApprovedAt())
                        .expiredAt(v.getExpiredAt())
                        .build()
                ).collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void createVehicle(Long userId,CreateVehicleRequest request){
        User user=userRepository.findById(userId)
            .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        
        ApartmentResident apartmentResident
            =apartmentResidentRepository.findByUser_Id(userId)
            .orElseThrow(()->new AppException(ErrorCode.NO_ACTIVE_APARTMENT));

        if(vehicleRepository.existByLicensePlate(request.getLicensePlate()))
            throw new AppException(ErrorCode.LICENSE_PLATE_EXISTED);

        Vehicle vehicle=Vehicle.builder()
            .vehicleType(VehicleType.valueOf(request.getVehicleType().toUpperCase()))
            .licensePlate(request.getLicensePlate())
            .brand(request.getBrand())
            .model(request.getModel())
            .color(request.getColor())
            .status(VehicleStatus.PENDING_APPROVAL)
            .registeredAt(LocalDateTime.now())
            .user(user)
            .apartment(apartmentResident.getApartment())
            .build();

        vehicleRepository.save(vehicle);

        //Gửi notification đến BQL: "Cư dân A1001 đăng ký xe mới chờ duyệt."
    }

    @Transactional
    public void deleteVehicle(Long vehicleId,Long userId){
         User user=userRepository.findById(userId)
            .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        Vehicle vehicle=vehicleRepository.findById(vehicleId)
            .orElseThrow(()->new AppException(ErrorCode.VEHICLE_NOT_FOUND));
        if(!vehicle.getUser().getId().equals(userId))
            throw new AppException(ErrorCode.VEHICLE_NOT_YOURS);
        if(vehicle.getStatus()!=VehicleStatus.ACTIVE)
            throw new AppException(ErrorCode.VEHICLE_NOT_ACTIVE);
        vehicle.setStatus(VehicleStatus.INACTIVE);
        vehicleRepository.save(vehicle);
    }
    
    @Transactional(readOnly = true)
    public List<ServiceTypeResponse> getServiceTypes(Long userId){
        //Hiện tất cả các ServiceType hiện có 
        List<ServiceType> serviceTypes=serviceTypeRepository.findAll();
        //Danh sách các dịch dụ đã đăng ký 
        List<ServiceRegistration> registrations=serviceRegistrationRepository
            .findByUser_Id(userId);
        //Map ServiceType mà có đăng ký thì có ServiceRegistration
        Map<Integer,ServiceRegistration> mapServiceType=registrations.stream()
            .collect(java.util.stream.Collectors.toMap(r->r.getServiceType().getId(),
                r->r
            ));
        List<ServiceTypeResponse> dataList=serviceTypes.stream().map(s->{
            //Lấy đơn đăng ký của service đó ra nếu ko có thì trả ra null
            ServiceRegistration serviceRegistration=mapServiceType.get(s.getId());
            ServiceRegistration myReg=null;
            //nếu tồn tại thì có myReg ko thì là null
            if (serviceRegistration!=null) {
                 myReg=ServiceRegistration.builder()
                    .id(serviceRegistration.getId())
                    .status(serviceRegistration.getStatus())
                    .startDate(serviceRegistration.getStartDate())
                    .endDate(serviceRegistration.getEndDate())
                    .build();
            }
            return ServiceTypeResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .monthlyFee(s.getMonthlyFee())
                .iconUrl(s.getIconUrl())
                .isRegistered(serviceRegistration!=null)
                .myRegistration(myReg)
                .build();
        }).toList();
        
        return dataList;
    }

    public List<ServiceRegistrationResponse> getServiceRegistration(String status,Long userId){
        List<ServiceRegistration> serviceReg;
        if(status!=null)
            serviceReg=serviceRegistrationRepository.findByUser_IdAndStatus(userId,status);
        else
            serviceReg=serviceRegistrationRepository.findByUser_Id(userId);


        return serviceReg.stream().map(p ->{
            ServiceType serviceType=ServiceType.builder()
                    .id(p.getServiceType().getId())
                    .name(p.getServiceType().getName())
                    .monthlyFee(p.getServiceType().getMonthlyFee())
                    .build();

                return ServiceRegistrationResponse.builder()
                    .id(p.getId())
                    .serviceType(serviceType)
                    .status(p.getStatus())
                    .registeredAt(p.getRegisteredAt())
                    .startDate(p.getStartDate())
                    .endDate(p.getEndDate())
                    .build();}
        ).collect(Collectors.toList());
    }


}

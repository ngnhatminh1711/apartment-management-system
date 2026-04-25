package com.apartmentmanagement.service.resident;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.resident.CreateVehicleRequest;
import com.apartmentmanagement.dto.response.resident.VehicleResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentVehicleService {
    private final UserRepository userRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;  
    private final VehicleRepository vehicleRepository;
    private final NotificationRepository notificationRepository;

    // -- Vehicle 3--
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
                ).collect(Collectors.toList());
    }
    
    @Transactional
    public void createVehicle(Long userId,CreateVehicleRequest request){
        User user=userRepository.findById(userId)
            .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        
        ApartmentResident apartmentResident
            =apartmentResidentRepository.findByUser_Id(userId)
            .orElseThrow(()->new AppException(ErrorCode.NO_ACTIVE_APARTMENT));

        if(vehicleRepository.existsByLicensePlate(request.getLicensePlate()))
            throw new AppException(ErrorCode.LICENSE_PLATE_EXISTED);
        
        Vehicle vehicle=Vehicle.builder()
            .vehicleType(request.getVehicleType())
            .licensePlate(request.getLicensePlate())
            .brand(request.getBrand())
            .model(request.getModel())
            .color(request.getColor())
            .user(user)
            .apartment(apartmentResident.getApartment())
            .build();
        // status mặc định là PENDING, chờ BQL duyệt
        vehicleRepository.save(vehicle);

        //Gửi notification đến BQL: "Cư dân A1001 đăng ký xe mới chờ duyệt."
        Notification newNotification=Notification.builder()
            .user(apartmentResident.getApartment().getBuilding().getManager())
            .title("Đăng ký xe mới")
            .content("Cư dân " + apartmentResident.getApartment().getApartmentNumber() + " đăng ký xe mới chờ duyệt.")
            .type(NotificationType.ANNOUNCEMENT)
            .referenceType("vehicles")
            .referenceId(vehicle.getId())
            .createdAt(LocalDateTime.now())
            .build();
        notificationRepository.save(newNotification);
    }

    @Transactional
    public void deleteVehicle(Long vehicleId,Long userId){
        Vehicle vehicle=vehicleRepository.findById(vehicleId)
            .orElseThrow(()->new AppException(ErrorCode.VEHICLE_NOT_FOUND));
        if(!vehicle.getUser().getId().equals(userId))
            throw new AppException(ErrorCode.VEHICLE_NOT_YOURS);
        if(vehicle.getStatus()!=VehicleStatus.ACTIVE)
            throw new AppException(ErrorCode.VEHICLE_NOT_ACTIVE);
        vehicle.setStatus(VehicleStatus.INACTIVE);
        vehicle.setExpiredAt(LocalDate.now());
        vehicleRepository.save(vehicle);
    }
    
}

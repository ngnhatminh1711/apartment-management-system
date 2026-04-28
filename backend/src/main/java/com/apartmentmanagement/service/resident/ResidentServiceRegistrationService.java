package com.apartmentmanagement.service.resident;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.resident.ServiceRegistrationRequest;
import com.apartmentmanagement.dto.response.resident.ServiceRegistrationResponse;
import com.apartmentmanagement.dto.response.resident.ServiceTypeResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.ServiceRegistration;
import com.apartmentmanagement.entity.ServiceType;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.enums.RegistrationStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.ServiceRegistrationRepository;
import com.apartmentmanagement.repository.ServiceTypeRepository;
import com.apartmentmanagement.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentServiceRegistrationService {
    private final UserRepository userRepository;
    private final ApartmentResidentRepository apartmentResidentRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ServiceRegistrationRepository serviceRegistrationRepository;
    private final NotificationRepository notificationRepository;
     // -- Service Registration  4--
    @Transactional(readOnly = true)
    public List<ServiceTypeResponse> getServiceTypes(Long userId){
        List<ServiceType> serviceTypes=serviceTypeRepository.findAll();
        //Danh sách các dịch dụ đã đăng ký 
        List<ServiceRegistration> registrations=serviceRegistrationRepository
            .findByUser_Id(userId);

        //Map ServiceType mà có đăng ký thì có ServiceRegistration
        Map<Integer,ServiceRegistration> mapServiceType=registrations.stream()
            .collect(Collectors.toMap(r->r.getServiceType().getId(),
                r->r,
                (existing, replacement) -> 
                existing.getCreatedAt().isAfter(replacement.getCreatedAt())
                    ? existing
                    : replacement
            ));
        List<ServiceTypeResponse> dataList=serviceTypes.stream().map(s->{
            //Lấy đơn đăng ký của service đó ra nếu ko có thì trả ra null
            ServiceRegistration serviceRegistration=mapServiceType.get(s.getId());
            ServiceRegistrationResponse myReg=null;
            //nếu tồn tại thì có myReg ko thì là null
            if (serviceRegistration!=null) {
                 myReg=ServiceRegistrationResponse.builder()
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
    
    @Transactional(readOnly = true)
    public List<ServiceRegistrationResponse> getServiceRegistration(String status,Long userId){
        List<ServiceRegistration> serviceReg;
        if(status!=null)
            serviceReg=serviceRegistrationRepository.findByUser_IdAndStatus(userId, RegistrationStatus.valueOf(status));
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

    @Transactional
    public void createServiceRegistration(Long userId, ServiceRegistrationRequest request) {
        User user= userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ApartmentResident apartmentResident= apartmentResidentRepository.findByUser_Id(userId)
            .orElseThrow(() -> new AppException(ErrorCode.APARTMENT_NOT_FOUND));
        ServiceType serviceType=serviceTypeRepository.findById(request.getServiceTypeId())
            .orElseThrow(() -> new AppException(ErrorCode.SERVICE_TYPE_NOT_FOUND));
        if (!serviceType.getIsActive())
            throw new AppException(ErrorCode.SERVICE_TYPE_INACTIVE);
        List<ServiceRegistration> serviceRegistrations= serviceRegistrationRepository.findByUser_Id(userId);
        //Nếu đã có đăng ký 
        boolean serviceStatus=false;
        for(var p: serviceRegistrations){
            if((p.getServiceType().equals(serviceType)) &&
             (p.getStatus().name().equals("ACTIVE")||p.getStatus().name().equals("PENDING"))){
                serviceStatus=true;
                break;
             }
        }
        if(serviceStatus)
            throw new AppException(ErrorCode.SERVICE_ALREADY_REGISTERED);

        ServiceRegistration serviceReg= ServiceRegistration.builder()
                .user(user)
                .apartment(apartmentResident.getApartment())
                .serviceType(serviceType)
                .registeredAt(LocalDateTime.now())
                .notes(request.getNotes())
                .build();
        serviceRegistrationRepository.save(serviceReg);
        Notification notification;
        if(apartmentResident.getApartment().getBuilding().getManager()!=null){
            notification=Notification.builder()
                .title("Đăng ký dịch vụ mới")
                .content("Cư dân "+user.getFullName()+" Căn hộ " + apartmentResident.getApartment().getApartmentNumber()
                 + " đăng ký dịch vụ " + serviceType.getName())
                .type(NotificationType.ANNOUNCEMENT)
                .user(apartmentResident.getApartment().getBuilding().getManager())
                .referenceType("service_registrations")
                .referenceId(serviceReg.getId())
                .createdAt(LocalDateTime.now())
                .build();
            notificationRepository.save(notification);
        }
        
    }
    
    @Transactional
    public void deleteServiceRegistration(Long userId,Long id){
        ServiceRegistration serviceReg =serviceRegistrationRepository.findByIdAndUser_Id(id, userId)
            .orElseThrow(()-> new AppException(ErrorCode.REGISTRATION_NOT_FOUND));
        if (!serviceReg.getStatus().equals(RegistrationStatus.ACTIVE)) 
            throw new AppException(ErrorCode.REGISTRATION_NOT_ACTIVE);
        serviceReg.setStatus(RegistrationStatus.CANCELLED);
        serviceReg.setEndDate(LocalDate.now());
        Notification notification;
        if(serviceReg.getApartment().getBuilding().getManager()!=null){
            notification=Notification.builder()
                .title("Yêu cầu hủy dịch vụ ")
                .content("Cư dân  " +serviceReg.getUser().getFullName()
                +" Căn hộ " + serviceReg.getApartment().getApartmentNumber()
                 + " hủy dịch vụ " + serviceReg.getServiceType().getName())
                .type(NotificationType.ANNOUNCEMENT)
                .user(serviceReg.getApartment().getBuilding().getManager())
                .referenceType("service_registrations")
                .referenceId(serviceReg.getId())
                .createdAt(LocalDateTime.now())
                .build();
            notificationRepository.save(notification);
        }
    }
    
}

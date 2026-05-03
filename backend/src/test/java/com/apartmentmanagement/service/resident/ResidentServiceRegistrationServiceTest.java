package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.apartmentmanagement.dto.request.resident.ServiceRegistrationRequest;
import com.apartmentmanagement.dto.response.resident.ServiceRegistrationResponse;
import com.apartmentmanagement.dto.response.resident.ServiceTypeResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.ServiceRegistration;
import com.apartmentmanagement.entity.ServiceType;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RegistrationStatus;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.ServiceRegistrationRepository;
import com.apartmentmanagement.repository.ServiceTypeRepository;
import com.apartmentmanagement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ResidentServiceRegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private ServiceTypeRepository serviceTypeRepository;

    @Mock
    private ServiceRegistrationRepository serviceRegistrationRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ResidentServiceRegistrationService residentServiceRegistrationService;

    @Test
    void getServiceTypes_marksRegisteredServicesWithLatestRegistration() {
        ServiceType internet = ServiceType.builder().id(1).name("Internet").monthlyFee(new BigDecimal("100.00"))
                .build();
        ServiceRegistration oldRegistration = ServiceRegistration.builder()
                .id(1L)
                .serviceType(internet)
                .status(RegistrationStatus.CANCELLED)
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();
        ServiceRegistration latestRegistration = ServiceRegistration.builder()
                .id(2L)
                .serviceType(internet)
                .status(RegistrationStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        when(serviceTypeRepository.findAll()).thenReturn(List.of(internet));
        when(serviceRegistrationRepository.findByUser_Id(99L)).thenReturn(List.of(oldRegistration, latestRegistration));

        List<ServiceTypeResponse> response = residentServiceRegistrationService.getServiceTypes(99L);

        assertEquals(1, response.size());
        assertEquals(true, response.get(0).getIsRegistered());
        assertEquals(2L, response.get(0).getMyRegistration().getId());
    }

    @Test
    void getServiceRegistration_withStatus_returnsMappedRegistrations() {
        ServiceType serviceType = ServiceType.builder().id(1).name("Internet").monthlyFee(new BigDecimal("100.00"))
                .build();
        ServiceRegistration registration = ServiceRegistration.builder()
                .id(1L)
                .serviceType(serviceType)
                .status(RegistrationStatus.ACTIVE)
                .registeredAt(LocalDateTime.now())
                .build();
        when(serviceRegistrationRepository.findByUser_IdAndStatus(99L, RegistrationStatus.ACTIVE))
                .thenReturn(List.of(registration));

        List<ServiceRegistrationResponse> response = residentServiceRegistrationService.getServiceRegistration("ACTIVE",
                99L);

        assertEquals(1, response.size());
        assertEquals(RegistrationStatus.ACTIVE, response.get(0).getStatus());
        assertEquals("Internet", response.get(0).getServiceType().getName());
    }

    @Test
    void createServiceRegistration_savesRegistrationAndManagerNotification() {
        User user = User.builder().id(99L).fullName("Resident").build();
        User manager = User.builder().id(7L).build();
        Apartment apartment = Apartment.builder()
                .id(10L)
                .apartmentNumber("A101")
                .building(Building.builder().manager(manager).build())
                .build();
        ServiceType serviceType = ServiceType.builder().id(1).name("Internet").isActive(true).build();
        ServiceRegistrationRequest request = new ServiceRegistrationRequest();
        request.setServiceTypeId(1);
        request.setNotes("Please register");

        when(userRepository.findById(99L)).thenReturn(Optional.of(user));
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(serviceTypeRepository.findById(1)).thenReturn(Optional.of(serviceType));
        when(serviceRegistrationRepository.findByUser_Id(99L)).thenReturn(List.of());

        residentServiceRegistrationService.createServiceRegistration(99L, request);

        verify(serviceRegistrationRepository).save(any(ServiceRegistration.class));
        verify(notificationRepository).save(any());
    }

    @Test
    void createServiceRegistration_whenAlreadyPending_throwsAlreadyRegistered() {
        ServiceType serviceType = ServiceType.builder().id(1).name("Internet").isActive(true).build();
        ServiceRegistrationRequest request = new ServiceRegistrationRequest();
        request.setServiceTypeId(1);

        when(userRepository.findById(99L)).thenReturn(Optional.of(User.builder().id(99L).build()));
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder()
                        .apartment(Apartment.builder().building(Building.builder().build()).build())
                        .build()));
        when(serviceTypeRepository.findById(1)).thenReturn(Optional.of(serviceType));
        when(serviceRegistrationRepository.findByUser_Id(99L)).thenReturn(List.of(ServiceRegistration.builder()
                .serviceType(serviceType)
                .status(RegistrationStatus.PENDING)
                .build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentServiceRegistrationService.createServiceRegistration(99L, request));

        assertEquals(ErrorCode.SERVICE_ALREADY_REGISTERED, exception.getErrorCode());
    }

    @Test
    void deleteServiceRegistration_setsCancelledAndEndDate() {
        ServiceRegistration registration = ServiceRegistration.builder()
                .id(1L)
                .status(RegistrationStatus.ACTIVE)
                .user(User.builder().fullName("Resident").build())
                .apartment(Apartment.builder()
                        .apartmentNumber("A101")
                        .building(Building.builder().manager(null).build())
                        .build())
                .serviceType(ServiceType.builder().name("Internet").build())
                .build();
        when(serviceRegistrationRepository.findByIdAndUser_Id(1L, 99L)).thenReturn(Optional.of(registration));

        residentServiceRegistrationService.deleteServiceRegistration(99L, 1L);

        assertEquals(RegistrationStatus.CANCELLED, registration.getStatus());
        assertEquals(java.time.LocalDate.now(), registration.getEndDate());
    }

    @Test
    void deleteServiceRegistration_whenNotActive_throwsRegistrationNotActive() {
        when(serviceRegistrationRepository.findByIdAndUser_Id(1L, 99L))
                .thenReturn(Optional.of(ServiceRegistration.builder().status(RegistrationStatus.PENDING).build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentServiceRegistrationService.deleteServiceRegistration(99L, 1L));

        assertEquals(ErrorCode.REGISTRATION_NOT_ACTIVE, exception.getErrorCode());
    }
}

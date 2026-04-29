package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import com.apartmentmanagement.dto.request.resident.CreateServiceRequest;
import com.apartmentmanagement.dto.request.resident.ServiceRequestRating;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.ServiceRequest;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RequestPriority;
import com.apartmentmanagement.enums.RequestStatus;
import com.apartmentmanagement.enums.RequestType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.ServiceRequestRepository;

@ExtendWith(MockitoExtension.class)
class ResidentServiceRequestServiceTest {

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ResidentServiceRequestService residentServiceRequestService;

    @Test
    void getMyServiceRequests_returnsMappedPage() {
        Apartment apartment = Apartment.builder().id(10L).build();
        ServiceRequest request = ServiceRequest.builder()
                .id(1L)
                .requestType(RequestType.MAINTENANCE)
                .title("Fix light")
                .description("Broken")
                .priority(RequestPriority.HIGH)
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(serviceRequestRepository.findByApartmentIdAndFilters(eq(10L), eq("PENDING"), eq("MAINTENANCE"), any()))
                .thenReturn(new PageImpl<>(List.of(request)));

        PageResponse<ServiceRequest> response =
                residentServiceRequestService.getMyServiceRequests(99L, "pending", "maintenance", 0, 10);

        assertEquals(1, response.getContent().size());
        assertEquals("Fix light", response.getContent().get(0).getTitle());
    }

    @Test
    void getMyServiceRequestDetail_whenOtherApartment_throwsNotYours() {
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder()
                        .apartment(Apartment.builder().id(10L).build())
                        .build()));
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(ServiceRequest.builder()
                        .apartment(Apartment.builder().id(20L).build())
                        .build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentServiceRequestService.getMyServiceRequestDetail(99L, 1L));

        assertEquals(ErrorCode.SERVICE_REQUEST_NOT_YOURS, exception.getErrorCode());
    }

    @Test
    void createServiceRequest_savesRequestAndNotification() {
        User user = User.builder().id(99L).fullName("Resident").build();
        User manager = User.builder().id(7L).build();
        Apartment apartment = Apartment.builder()
                .id(10L)
                .apartmentNumber("A101")
                .building(Building.builder().manager(manager).build())
                .build();
        CreateServiceRequest request = new CreateServiceRequest();
        request.setRequestType(RequestType.MAINTENANCE);
        request.setTitle("Fix light");
        request.setDescription("Broken");
        request.setPriority(RequestPriority.HIGH);
        request.setAttachmentUrls(List.of("a.png"));

        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().user(user).apartment(apartment).build()));

        residentServiceRequestService.createServiceRequest(99L, request);

        verify(serviceRequestRepository).save(any(ServiceRequest.class));
        verify(notificationRepository).save(any());
    }

    @Test
    void rateServiceRequest_whenResolvedAndUnrated_savesRating() {
        Apartment apartment = Apartment.builder().id(10L).build();
        ServiceRequest request = ServiceRequest.builder()
                .id(1L)
                .apartment(apartment)
                .status(RequestStatus.RESOLVED)
                .rating(null)
                .build();
        ServiceRequestRating rating = new ServiceRequestRating();
        rating.setRating(5);

        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(serviceRequestRepository.findById(1L)).thenReturn(Optional.of(request));

        residentServiceRequestService.rateServiceRequest(99L, 1L, rating);

        assertEquals(5, request.getRating());
        verify(serviceRequestRepository).save(request);
    }

    @Test
    void rateServiceRequest_withInvalidRating_throwsValidationError() {
        ServiceRequestRating rating = new ServiceRequestRating();
        rating.setRating(6);
        Apartment apartment = Apartment.builder().id(10L).build();

        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(serviceRequestRepository.findById(1L)).thenReturn(Optional.of(ServiceRequest.builder()
                .apartment(apartment)
                .status(RequestStatus.RESOLVED)
                .build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentServiceRequestService.rateServiceRequest(99L, 1L, rating));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
    }
}

package com.apartmentmanagement.service.resident;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.resident.CreateServiceRequest;
import com.apartmentmanagement.dto.request.resident.ServiceRequestRating;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Notification;
import com.apartmentmanagement.entity.ServiceRequest;
import com.apartmentmanagement.enums.NotificationType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.ServiceRequestRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ResidentServiceRequestService {
    private final ApartmentResidentRepository apartmentResidentRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final NotificationRepository notificationRepository;
    // -- Service Request 4--

    @Transactional(readOnly = true)
    public PageResponse<ServiceRequest> getMyServiceRequests(Long userId, String status, String requestType, int page, int size) {
        ApartmentResident apartmentResident = apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        status = status != null ? status.toUpperCase() : null;
        requestType = requestType != null ? requestType.toUpperCase() : null;
        Page<ServiceRequest> serviceRequestPage = serviceRequestRepository.findByApartmentIdAndFilters(
                apartmentResident.getApartment().getId(),
                status,
                requestType,
                pageable
        );
        PageResponse<ServiceRequest> pageResponse = PageResponse.of(serviceRequestPage,
            (p) -> ServiceRequest.builder()
                .id(p.getId())
                .RequestType(p.getRequestType())
                .title(p.getTitle())
                .priority(p.getPriority())
                .status(p.getStatus())
                .resolvedAt(p.getResolvedAt())
                .rating(p.getRating())
                .createdAt(p.getCreatedAt())
                .resolvedAt(p.getResolvedAt())
                .build()
        );

        return pageResponse;
    }  

    @Transactional(readOnly = true)
    public ServiceRequest getMyServiceRequestDetail(Long userId, Long requestId) {
        ApartmentResident apartmentResident = apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_REQUEST_NOT_FOUND));
        if (!serviceRequest.getApartment().getId().equals(apartmentResident.getApartment().getId())) {
            throw new AppException(ErrorCode.SERVICE_REQUEST_NOT_YOURS);
        }

        return ServiceRequest.builder()
                .id(serviceRequest.getId())
                .RequestType(serviceRequest.getRequestType())
                .title(serviceRequest.getTitle())
                .description(serviceRequest.getDescription())
                .attachmentUrls(serviceRequest.getAttachmentUrls())
                .priority(serviceRequest.getPriority())
                .status(serviceRequest.getStatus())
                .rating(serviceRequest.getRating())
                .createdAt(serviceRequest.getCreatedAt())
                .resolvedAt(serviceRequest.getResolvedAt())
                .build();
    }

    @Transactional
    public void createServiceRequest(Long userId, CreateServiceRequest serviceRequest) {
        ApartmentResident apartmentResident = apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        ServiceRequest newRequest = ServiceRequest.builder()
                        .apartment(apartmentResident.getApartment())
                        .RequestType(serviceRequest.getRequestType())
                        .title(serviceRequest.getTitle())
                        .description(serviceRequest.getDescription())
                        .attachmentUrls(serviceRequest.getAttachmentUrls())
                        .priority(serviceRequest.getPriority())
                        .user(apartmentResident.getUser())
                        //status đã được tao sẵn mặc định trong entity là PENDING 
                        .build();
        serviceRequestRepository.save(newRequest);
        Notification notification=Notification.builder()
                .title("Yêu cầu dịch vụ mới")
                .content("Cư dân "+apartmentResident.getUser().getFullName()+" Căn hộ " + apartmentResident.getApartment().getApartmentNumber()
                 + " tạo yêu cầu dịch vụ " + newRequest.getTitle())
                .type(NotificationType.ANNOUNCEMENT)
                .user(apartmentResident.getApartment().getBuilding().getManager())
                .referenceType("service_requests")
                .referenceId(newRequest.getId())
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }
    @Transactional
    public void rateServiceRequest(Long userId, Long requestId, ServiceRequestRating serviceRequestRating) {
        ApartmentResident apartmentResident = apartmentResidentRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACTIVE_APARTMENT));
        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_REQUEST_NOT_FOUND));
        if (!serviceRequest.getApartment().getId().equals(apartmentResident.getApartment().getId())) {
            throw new AppException(ErrorCode.SERVICE_REQUEST_NOT_YOURS);
        }
        if (serviceRequestRating.getRating() < 1 || serviceRequestRating.getRating() > 5) {
            throw new AppException(ErrorCode.VALIDATION_ERROR);
        }
        if (!serviceRequest.getStatus().name().equals("RESOLVED")) {
            throw new AppException(ErrorCode.SERVICE_REQUEST_NOT_RESOLVED);
        }
        if (serviceRequest.getRating() != null) {
            throw new AppException(ErrorCode.SERVICE_REQUEST_ALREADY_RATED);
        }
        serviceRequest.setRating(serviceRequestRating.getRating());
        serviceRequestRepository.save(serviceRequest);
    }


}

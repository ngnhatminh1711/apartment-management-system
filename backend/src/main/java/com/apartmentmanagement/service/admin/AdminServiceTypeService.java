package com.apartmentmanagement.service.admin;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.admin.ServiceTypeRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.ServiceTypeResponse;
import com.apartmentmanagement.entity.ServiceType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ServiceTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepo;

    @Transactional(readOnly = true)
    public PageResponse<ServiceTypeResponse> getAll(Boolean isActive, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        var pageData = serviceTypeRepo.findAll(isActive, pageable);

        return PageResponse.of(pageData, st -> {
            long count = serviceTypeRepo.countActiveRegistrations(st.getId());
            return ServiceTypeResponse.from(st, count);
        });
    }

    @Transactional(readOnly = true)
    public ServiceTypeResponse getById(Integer id) {
        ServiceType st = findOrThrow(id);
        return ServiceTypeResponse.from(st, serviceTypeRepo.countActiveRegistrations(id));
    }

    @Transactional
    public ServiceTypeResponse create(ServiceTypeRequest req) {
        if (serviceTypeRepo.existsByName(req.getName())) {
            throw new AppException(ErrorCode.SERVICE_TYPE_NOT_FOUND);
        }

        ServiceType st = ServiceType.builder()
                .name(req.getName())
                .description(req.getDescription())
                .monthlyFee(req.getMonthlyFee())
                .iconUrl(req.getIconUrl())
                .isActive(true)
                .build();

        return ServiceTypeResponse.from(serviceTypeRepo.save(st), 0);
    }

    @Transactional
    public ServiceTypeResponse update(Integer id, ServiceTypeRequest req) {
        ServiceType st = findOrThrow(id);

        if (req.getName() != null
                && serviceTypeRepo.existsByNameAndIdNot(req.getName(), id)) {
            throw new AppException(ErrorCode.SERVICE_TYPE_NOT_FOUND);
        }

        if (req.getName() != null)
            st.setName(req.getName());
        if (req.getDescription() != null)
            st.setDescription(req.getDescription());
        if (req.getMonthlyFee() != null)
            st.setMonthlyFee(req.getMonthlyFee());
        if (req.getIconUrl() != null)
            st.setIconUrl(req.getIconUrl());

        long count = serviceTypeRepo.countActiveRegistrations(id);
        return ServiceTypeResponse.from(serviceTypeRepo.save(st), count);
    }

    @Transactional
    public ServiceTypeResponse toggleActive(Integer id) {
        ServiceType st = findOrThrow(id);
        st.setIsActive(!st.getIsActive());
        long count = serviceTypeRepo.countActiveRegistrations(id);
        return ServiceTypeResponse.from(serviceTypeRepo.save(st), count);
    }

    private ServiceType findOrThrow(Integer id) {
        return serviceTypeRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_TYPE_NOT_FOUND));
    }
}
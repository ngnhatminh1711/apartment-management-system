package com.apartmentmanagement.service.admin;

import com.apartmentmanagement.dto.request.admin.FeeConfigRequest;
import com.apartmentmanagement.dto.response.admin.CurrentFeeResponse;
import com.apartmentmanagement.dto.response.admin.FeeConfigResponse;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.FeeConfig;
import com.apartmentmanagement.enums.FeeType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.BuildingRepository;
import com.apartmentmanagement.repository.FeeConfigRepository;
import com.apartmentmanagement.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminFeeConfigService {

    private final FeeConfigRepository feeConfigRepo;
    private final BuildingRepository  buildingRepo;

    @Transactional(readOnly = true)
    public List<FeeConfigResponse> getAll(Long buildingId, FeeType feeType, boolean activeOnly) {
        if (activeOnly) {
            return feeConfigRepo.findByBuildingIdAndEffectiveToIsNull(buildingId)
                    .stream()
                    .filter(fc -> feeType == null || fc.getFeeType() == feeType)
                    .map(FeeConfigResponse::from)
                    .collect(Collectors.toList());
        }
        return feeConfigRepo.findHistory(buildingId, feeType)
                .stream()
                .map(FeeConfigResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FeeConfigResponse getById(Long id) {
        return FeeConfigResponse.from(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public CurrentFeeResponse getCurrentFees(Long buildingId) {
        Building building = buildingRepo.findById(buildingId)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        List<FeeConfig> configs = feeConfigRepo.findByBuildingIdAndEffectiveToIsNull(buildingId);

        Map<FeeType, CurrentFeeResponse.FeeEntry> fees = new EnumMap<>(FeeType.class);
        configs.forEach(fc -> fees.put(fc.getFeeType(),
                CurrentFeeResponse.FeeEntry.builder()
                        .unitPrice(fc.getUnitPrice())
                        .unit(fc.getUnit())
                        .build()));

        LocalDate earliest = configs.stream()
                .map(FeeConfig::getEffectiveFrom)
                .min(LocalDate::compareTo)
                .orElse(LocalDate.now());

        return CurrentFeeResponse.builder()
                .buildingId(buildingId)
                .buildingName(building.getName())
                .effectiveDate(earliest)
                .fees(fees)
                .build();
    }

    @Transactional
    public FeeConfigResponse create(FeeConfigRequest req) {
        Building building = buildingRepo.findById(req.getBuildingId())
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));

        // Đóng config cũ (nếu có) – set effectiveTo = ngày trước effectiveFrom mới
        feeConfigRepo.findCurrentByBuildingAndType(req.getBuildingId(), req.getFeeType())
                .ifPresent(old -> {
                    old.setEffectiveTo(req.getEffectiveFrom().minusDays(1));
                    feeConfigRepo.save(old);
                });

        FeeConfig newConfig = FeeConfig.builder()
                .building(building)
                .feeType(req.getFeeType())
                .unitPrice(req.getUnitPrice())
                .unit(req.getUnit())
                .effectiveFrom(req.getEffectiveFrom())
                .effectiveTo(null)
                .description(req.getDescription())
                .createdBy(SecurityUtils.getCurrentUser())
                .build();

        return FeeConfigResponse.from(feeConfigRepo.save(newConfig));
    }

    @Transactional
    public FeeConfigResponse update(Long id, FeeConfigRequest req) {
        FeeConfig fc = findOrThrow(id);

        // Chỉ cho sửa description và effectiveTo
        if (req.getDescription() != null) fc.setDescription(req.getDescription());

        return FeeConfigResponse.from(feeConfigRepo.save(fc));
    }

    @Transactional
    public void delete(Long id) {
        FeeConfig fc = findOrThrow(id);

        boolean inUse = feeConfigRepo.isConfigUsedByBills(
                fc.getBuilding().getId(),
                fc.getFeeType(),
                fc.getEffectiveFrom().atStartOfDay()
        );
        if (inUse) {
            throw new AppException(ErrorCode.FEE_CONFIG_IN_USE);
        }

        feeConfigRepo.delete(fc);
    }

    private FeeConfig findOrThrow(Long id) {
        return feeConfigRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BUILDING_NOT_FOUND));
    }
}
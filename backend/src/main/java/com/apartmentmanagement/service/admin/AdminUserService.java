package com.apartmentmanagement.service.admin;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentmanagement.dto.request.admin.AssignRoleRequest;
import com.apartmentmanagement.dto.request.admin.UserCreateRequest;
import com.apartmentmanagement.dto.request.admin.UserUpdateRequest;
import com.apartmentmanagement.dto.response.PageResponse;
import com.apartmentmanagement.dto.response.admin.UserResponse;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RoleName;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.RoleRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final ApartmentResidentRepository residentRepo;
    private final PasswordEncoder encoder;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAll(
            RoleName role, Boolean isActive, Long buildingId,
            String search, int page, int size, String sort) {

        String[] parts = sort.split(",");
        Sort.Direction dir = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        // Dùng JPA Specification hoặc query đơn giản hơn
        var pageable = PageRequest.of(page, size, Sort.by(dir, parts[0]));
        var pageData = userRepo.findAll(pageable); // TODO: thêm filter khi cần

        return PageResponse.of(pageData, u -> {
            UserResponse.ApartmentRef aptRef = buildAptRef(u.getId());
            return UserResponse.from(u, aptRef);
        });
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        User u = findOrThrow(id);
        return UserResponse.from(u, buildAptRef(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest req) {
        // Kiểm tra unique
        if (userRepo.existsByEmail(req.getEmail()))
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        if (req.getPhone() != null && userRepo.existsByPhone(req.getPhone()))
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        if (req.getIdCard() != null && userRepo.existsByIdCard(req.getIdCard()))
            throw new AppException(ErrorCode.ID_CARD_ALREADY_EXISTS);

        // Sinh password ngẫu nhiên
        String rawPassword = "Apt@" + UUID.randomUUID().toString().substring(0, 8);

        Set<Role> roles = new HashSet<>();
        for (RoleName roleName : req.getRoles()) {
            Role role = roleRepo.findByName(roleName)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            roles.add(role);
        }

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .idCard(req.getIdCard())
                .dateOfBirth(req.getDateOfBirth())
                .passwordHash(encoder.encode(rawPassword))
                .isActive(true)
                .roles(roles)
                .build();

        User saved = userRepo.save(user);

        // Gửi email thông tin đăng nhập
        try {
            // mailService.sendWelcomeEmail(saved.getEmail(), saved.getFullName(),
            // rawPassword);
        } catch (Exception e) {
            log.warn("Gửi email thất bại cho user {}: {}", saved.getEmail(), e.getMessage());
        }

        return UserResponse.from(saved, null);
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest req) {
        User user = findOrThrow(id);

        if (req.getPhone() != null && !req.getPhone().equals(user.getPhone())
                && userRepo.existsByPhone(req.getPhone())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        if (req.getFullName() != null)
            user.setFullName(req.getFullName());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getDateOfBirth() != null)
            user.setDateOfBirth(req.getDateOfBirth());
        if (req.getAvatarUrl() != null)
            user.setAvatarUrl(req.getAvatarUrl());

        return UserResponse.from(userRepo.save(user), buildAptRef(id));
    }

    @Transactional
    public boolean toggleActive(Long id) {
        Long currentId = SecurityUtils.getCurrentUserId();
        if (currentId.equals(id)) {
            throw new AppException(ErrorCode.CANNOT_DEACTIVATE_SELF);
        }

        User user = findOrThrow(id);
        user.setIsActive(!user.getIsActive());
        userRepo.save(user);
        return user.getIsActive();
    }

    @Transactional
    public void resetPassword(Long id) {
        User user = findOrThrow(id);
        String rawPassword = "Apt@" + UUID.randomUUID().toString().substring(0, 8);
        user.setPasswordHash(encoder.encode(rawPassword));
        userRepo.save(user);

        try {
            // mailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(),
            // rawPassword);
        } catch (Exception e) {
            log.warn("Gửi email reset password thất bại: {}", e.getMessage());
        }
    }

    @Transactional
    public UserResponse assignRole(Long userId, AssignRoleRequest req) {
        User user = findOrThrow(userId);
        Role role = roleRepo.findById(req.getRoleId())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (user.getRoles().contains(role)) {
            throw new AppException(ErrorCode.ROLE_ALREADY_ASSIGNED);
        }

        user.getRoles().add(role);
        return UserResponse.from(userRepo.save(user), buildAptRef(userId));
    }

    @Transactional
    public UserResponse removeRole(Long userId, Integer roleId) {
        User user = findOrThrow(userId);
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        if (user.getRoles().size() <= 1) {
            throw new AppException(ErrorCode.CANNOT_REMOVE_LAST_ROLE);
        }

        user.getRoles().remove(role);
        return UserResponse.from(userRepo.save(user), buildAptRef(userId));
    }

    // ── Helpers ────────────────────────────────────────────────────────────────
    private User findOrThrow(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private UserResponse.ApartmentRef buildAptRef(Long userId) {
        // Tìm căn hộ user đang ở
        return userRepo.findById(userId).flatMap(u -> u.getResidenceHistory().stream()
                .filter(ar -> ar.getMoveOutDate() == null)
                .findFirst()
                .map(ar -> UserResponse.ApartmentRef.builder()
                        .id(ar.getApartment().getId())
                        .apartmentNumber(ar.getApartment().getApartmentNumber())
                        .buildingName(ar.getApartment().getBuilding().getName())
                        .build()))
                .orElse(null);
    }
}

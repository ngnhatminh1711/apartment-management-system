package com.apartmentmanagement.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;

public class SecurityUtils {

    private SecurityUtils() {
    }

    /**
     * Lấy user entity của người đang đăng nhập.
     * Throw UNAUTHOIED nếu chưa login.
     */
    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return ((CustomUserDetails) auth.getPrincipal()).getUser();
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public static boolean hasRole(String roleName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(roleName));
    }
}

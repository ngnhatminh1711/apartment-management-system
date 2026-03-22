package com.apartmentmanagement.config;

import java.util.Arrays;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RoleName;
import com.apartmentmanagement.repository.RoleRepository;
import com.apartmentmanagement.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        seedAdminAccount();
    }

    private void seedRoles() {
        Arrays.stream(RoleName.values()).forEach(roleName -> {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(roleName)
                        .description(getDescription(roleName))
                        .build());
                log.info("Seeded role: {}", roleName);
            }
        });
    }

    private void seedAdminAccount() {
        if (userRepository.existsByEmail("admin@apartment.com"))
            return;

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow();

        User admin = User.builder()
                .fullName("System Administrator")
                .email("admin@apartment.com")
                .passwordHash(passwordEncoder.encode("Admin@123456"))
                .isActive(true)
                .roles(Set.of(adminRole))
                .build();

        userRepository.save(admin);
        log.info("Seeded admin account: admin@apartment.com / Admin@123456");
        log.warn("⚠️  Please change admin password immediately after first login!");
    }

    private String getDescription(RoleName name) {
        return switch (name) {
            case ROLE_ADMIN -> "Quản trị hệ thống toàn bộ";
            case ROLE_MANAGER -> "Ban quản lý tòa nhà";
            case ROLE_RESIDENT -> "Cư dân đang sinh sống";
        };
    }
}

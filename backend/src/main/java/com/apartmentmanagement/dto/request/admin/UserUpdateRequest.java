package com.apartmentmanagement.dto.request.admin;

import java.time.LocalDate;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @Size(max = 100)
    private String fullName;

    @Pattern(regexp = "^0[3-9]\\d{8}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 500)
    private String avatarUrl;
}
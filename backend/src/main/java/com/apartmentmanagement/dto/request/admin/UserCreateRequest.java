package com.apartmentmanagement.dto.request.admin;

import java.time.LocalDate;
import java.util.Set;

import com.apartmentmanagement.enums.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 150)
    private String email;

    @Pattern(regexp = "^0[3-9]\\d{8}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Pattern(regexp = "^\\d{9}$|^\\d{12}$", message = "CCCD/CMND phải có 9 hoặc 12 số")
    private String idCard;

    private LocalDate dateOfBirth;

    @NotEmpty(message = "Phải chọn ít nhất 1 role")
    private Set<RoleName> roles;
}
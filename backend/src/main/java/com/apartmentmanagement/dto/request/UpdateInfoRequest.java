package com.apartmentmanagement.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateInfoRequest {
    @NotBlank(message = "Full name không được để trống")
    @Size(max=100,message = "Full name tối đa 100 ký tự")
    private String fullName;
    private String phone;
    @PastOrPresent(message = "Không được là ngày tương lai ")
    private LocalDate dateOfBirth;
    private String avatarUrl;
}

package com.apartmentmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
public class BuildingRespone {
    private Long id;
    private String name;
    private String address;
    private String managerName;
    private String managerPhone;

}

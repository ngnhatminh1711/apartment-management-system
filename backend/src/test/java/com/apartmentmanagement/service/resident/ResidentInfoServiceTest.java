package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.apartmentmanagement.dto.request.resident.UpdateInfoRequest;
import com.apartmentmanagement.dto.response.resident.ApartmentResponse;
import com.apartmentmanagement.dto.response.resident.ResidentResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.RoleName;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ResidentInfoServiceTest {

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ResidentInfoService residentInfoService;

    @Test
    void getMe_returnsProfileApartmentRolesAndUnreadCount() {
        User user = User.builder()
                .id(99L)
                .fullName("Nguyen Van A")
                .email("a@example.com")
                .phone("0909000000")
                .roles(Set.of(Role.builder().name(RoleName.ROLE_RESIDENT).build()))
                .build();
        Apartment apartment = Apartment.builder()
                .id(10L)
                .apartmentNumber("A101")
                .floor(3)
                .building(Building.builder().name("Tower A").build())
                .build();
        ApartmentResident resident = ApartmentResident.builder()
                .apartment(apartment)
                .moveInDate(LocalDate.of(2026, 1, 1))
                .isPrimary(true)
                .build();

        when(userRepository.findById(99L)).thenReturn(Optional.of(user));
        when(apartmentResidentRepository.findByUser_IdAndIsPrimaryTrue(99L)).thenReturn(Optional.of(resident));
        when(notificationRepository.countByUser_IdAndIsReadFalse(99L)).thenReturn(5);

        ResidentResponse response = residentInfoService.getMe(99L);

        assertEquals("Nguyen Van A", response.getFullName());
        assertEquals(Set.of("ROLE_RESIDENT"), response.getRoles());
        assertEquals("A101", response.getCurrentApartment().getApartmentNumber());
        assertEquals(5, response.getUnreadNotificationCount());
    }

    @Test
    void changeInfoUser_updatesAllowedFieldsAndSaves() {
        User user = User.builder().id(99L).phone("old").fullName("Old").build();
        UpdateInfoRequest request = new UpdateInfoRequest();
        request.setPhone("0911111111");
        request.setFullName("New Name");
        request.setDateOfBirth(LocalDate.of(2000, 1, 1));
        request.setAvatarUrl("avatar.png");

        when(userRepository.findById(99L)).thenReturn(Optional.of(user));
        when(userRepository.existsByPhone("0911111111")).thenReturn(false);

        residentInfoService.changeInfoUser(99L, request);

        assertEquals("0911111111", user.getPhone());
        assertEquals("New Name", user.getFullName());
        assertEquals(LocalDate.of(2000, 1, 1), user.getDateOfBirth());
        verify(userRepository).save(user);
    }

    @Test
    void changeInfoUser_withFutureBirthDate_throwsValidationError() {
        UpdateInfoRequest request = new UpdateInfoRequest();
        request.setDateOfBirth(LocalDate.now().plusDays(1));

        when(userRepository.findById(99L)).thenReturn(Optional.of(User.builder().id(99L).build()));

        AppException exception = assertThrows(AppException.class,
                () -> residentInfoService.changeInfoUser(99L, request));

        assertEquals(ErrorCode.VALIDATION_ERROR, exception.getErrorCode());
    }

    @Test
    void getMyApartment_returnsBuildingAndHouseholdMembers() {
        User manager = User.builder().id(1L).fullName("Manager").phone("0123").build();
        Building building = Building.builder().id(2L).name("Tower A").address("District 1").manager(manager).build();
        Apartment apartment = Apartment.builder()
                .id(10L)
                .apartmentNumber("A101")
                .floor(3)
                .areaM2(new BigDecimal("70.5"))
                .numBedrooms(2)
                .numBathrooms(2)
                .direction("East")
                .building(building)
                .build();
        ApartmentResident resident = ApartmentResident.builder().id(100L).apartment(apartment).moveInDate(LocalDate.now()).build();
        ApartmentResident member = ApartmentResident.builder()
                .user(User.builder().id(99L).fullName("Member").build())
                .isPrimary(true)
                .moveInDate(LocalDate.of(2026, 1, 1))
                .build();

        when(apartmentResidentRepository.findByUser_Id(99L)).thenReturn(Optional.of(resident));
        when(apartmentResidentRepository.findByApartment_Id(10L)).thenReturn(List.of(member));

        ApartmentResponse response = residentInfoService.getMyApartment(99L);

        assertEquals("A101", response.getApartmentNumber());
        assertEquals("Tower A", response.getBuilding().getName());
        assertEquals(1, response.getHouseholdMembers().size());
    }
}

package com.apartmentmanagement.service.resident;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.apartmentmanagement.dto.request.resident.CreateVehicleRequest;
import com.apartmentmanagement.dto.response.resident.VehicleResponse;
import com.apartmentmanagement.entity.Apartment;
import com.apartmentmanagement.entity.ApartmentResident;
import com.apartmentmanagement.entity.Building;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.entity.Vehicle;
import com.apartmentmanagement.enums.VehicleStatus;
import com.apartmentmanagement.enums.VehicleType;
import com.apartmentmanagement.exception.AppException;
import com.apartmentmanagement.exception.ErrorCode;
import com.apartmentmanagement.repository.ApartmentResidentRepository;
import com.apartmentmanagement.repository.NotificationRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.repository.VehicleRepository;

@ExtendWith(MockitoExtension.class)
class ResidentVehicleServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApartmentResidentRepository apartmentResidentRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ResidentVehicleService residentVehicleService;

    @Test
    void getMyVehicles_returnsMappedVehicles() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .vehicleType(VehicleType.CAR)
                .licensePlate("51A-12345")
                .brand("Toyota")
                .model("Vios")
                .color("White")
                .status(VehicleStatus.ACTIVE)
                .registeredAt(LocalDateTime.now())
                .approvedAt(LocalDateTime.now())
                .build();
        when(vehicleRepository.findByUser_Id(99L)).thenReturn(List.of(vehicle));

        List<VehicleResponse> response = residentVehicleService.getMyVehicles(99L);

        assertEquals(1, response.size());
        assertEquals("CAR", response.get(0).getVehicleType());
        assertEquals("51A-12345", response.get(0).getLicensePlate());
    }

    @Test
    void createVehicle_savesVehicleAndManagerNotification() {
        User user = User.builder().id(99L).build();
        User manager = User.builder().id(7L).build();
        Apartment apartment = Apartment.builder()
                .id(10L)
                .apartmentNumber("A101")
                .building(Building.builder().manager(manager).build())
                .build();
        CreateVehicleRequest request = new CreateVehicleRequest();
        request.setVehicleType(VehicleType.MOTORBIKE);
        request.setLicensePlate("59X1-12345");
        request.setBrand("Honda");

        when(userRepository.findById(99L)).thenReturn(Optional.of(user));
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder().apartment(apartment).build()));
        when(vehicleRepository.existsByLicensePlate("59X1-12345")).thenReturn(false);

        residentVehicleService.createVehicle(99L, request);

        verify(vehicleRepository).save(any(Vehicle.class));
        verify(notificationRepository).save(any());
    }

    @Test
    void createVehicle_whenLicensePlateExists_throwsLicensePlateExisted() {
        CreateVehicleRequest request = new CreateVehicleRequest();
        request.setLicensePlate("59X1-12345");

        when(userRepository.findById(99L)).thenReturn(Optional.of(User.builder().id(99L).build()));
        when(apartmentResidentRepository.findByUser_Id(99L))
                .thenReturn(Optional.of(ApartmentResident.builder()
                        .apartment(Apartment.builder().building(Building.builder().build()).build())
                        .build()));
        when(vehicleRepository.existsByLicensePlate("59X1-12345")).thenReturn(true);

        AppException exception = assertThrows(AppException.class,
                () -> residentVehicleService.createVehicle(99L, request));

        assertEquals(ErrorCode.LICENSE_PLATE_EXISTED, exception.getErrorCode());
    }

    @Test
    void deleteVehicle_whenActiveAndOwned_setsInactiveAndSaves() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .user(User.builder().id(99L).build())
                .status(VehicleStatus.ACTIVE)
                .build();
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        residentVehicleService.deleteVehicle(1L, 99L);

        assertEquals(VehicleStatus.INACTIVE, vehicle.getStatus());
        assertEquals(LocalDate.now(), vehicle.getExpiredAt());
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void deleteVehicle_whenNotOwned_throwsVehicleNotYours() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .user(User.builder().id(100L).build())
                .status(VehicleStatus.ACTIVE)
                .build();
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        AppException exception = assertThrows(AppException.class,
                () -> residentVehicleService.deleteVehicle(1L, 99L));

        assertEquals(ErrorCode.VEHICLE_NOT_YOURS, exception.getErrorCode());
    }
}

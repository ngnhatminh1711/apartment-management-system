// BUILDINGS

import type { UserRole } from "./common";

export interface ManagerRef {
    id: number;
    fullName: string;
    email: string;
}

export interface BuildingStats {
    totalApartments: number;
    occupiedApartments: number;
    availableApartments: number;
    maintenanceApartments: number;
}

export interface Building {
    id: number;
    name: string;
    address: string;
    numFloors: number;
    numApartments: number;
    description: string | null;
    isActive: boolean;
    manager: ManagerRef | null;
    stats: BuildingStats;
    createdAt: string;
    updatedAt?: string;
}

export interface BuildingFormData {
    name: string;
    address: string;
    numFloors: number;
    numApartments: number;
    description?: string;
    managerId?: number | null;
}

// USERS

export interface ApartmentRef {
    id: number;
    apartmentNumber: string;
    buildingName: string;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    idCard: string | null;
    dateOfBirth?: string | null;
    avatarUrl?: string | null;
    isActive: boolean;
    roles: UserRole[];
    currentApartment: ApartmentRef | null;
    createdAt: string;
}

export interface UserCreateFormData {
    fullName: string;
    email: string;
    phone?: string;
    idCard?: string;
    dateOfBirth?: string;
    roles: UserRole[];
}

export interface UserUpdateFormData {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
}

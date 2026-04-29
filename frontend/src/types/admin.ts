// BUILDINGS

import type { ApartmentStatus, FeeType, UserRole } from "./common";

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

// APARTMENTS

export interface ResidentRef {
    id: number;
    fullName: string;
    phone: string | null;
    isPrimary: boolean;
    moveInDate: string;
    email?: string;
    idCard?: string;
}

export interface HistoryRef {
    userId: number;
    fullName: string;
    moveInDate: string;
    moveOutDate: string;
}

export interface Apartment {
    id: number;
    buildingId: number;
    buildingName: string;
    apartmentNumber: string;
    floor: number;
    areaM2: number;
    numBedrooms: number;
    numBathrooms: number;
    direction: string | null;
    status: ApartmentStatus;
    notes: string | null;
    currentResident: ResidentRef | null;
    currentResidents?: ResidentRef[];
    residenceHistory?: HistoryRef[];
    pendingBillCount?: number;
    pendingRequestCount?: number;
    createdAt: string;
}

export interface ApartmentFormData {
    buildingId: number;
    apartmentNumber: string;
    floor: number;
    areaM2: number;
    numBedrooms?: number;
    numBathrooms?: number;
    direction?: string;
    notes?: string;
}

// FEE CONFIGS

export interface FeeConfig {
    id: number;
    buildingId: number;
    buildingName: string;
    feeType: FeeType;
    unitPrice: number;
    unit: string;
    effectiveFrom: string;
    effectiveTo: string | null;
    description: string | null;
    createdBy: { id: number; fullName: string } | null;
    createdAt: string;
}

export interface CurrentFeeEntry {
    unitPrice: number;
    unit: string;
}

export interface CurrentFeeResponse {
    buildingId: number;
    buildingName: string;
    effectiveDate: string;
    fees: Partial<Record<FeeType, CurrentFeeEntry>>;
}

export interface FeeConfigFormData {
    buildingId: number;
    feeType: FeeType;
    unitPrice: number;
    unit: string;
    effectiveFrom: string;
    description?: string;
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

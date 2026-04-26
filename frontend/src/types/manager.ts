import type { ApartmentStatus, BillStatus, RequestStatus, ServiceRegistrationStatus, VehicleStatus, VehicleType } from "./common";

// ─────────────────────────────────────────────────────────────
// APARTMENTS
// ─────────────────────────────────────────────────────────────

export interface ResidentRef {
    id: number;
    fullName: string;
    phone: string | null;
    email?: string;
    idCard?: string;
    isPrimary: boolean;
    moveInDate: string;
}

export interface VehicleRef {
    id: number;
    licensePlate: string;
    vehicleType: VehicleType;
    brand: string | null;
    status: VehicleStatus;
}

export interface BillRef {
    id: number;
    billingMonth: string;
    totalAmount: number;
    status: BillStatus;
    dueDate: string;
}

export interface HistoryRef {
    userId: number;
    fullName: string;
    moveInDate: string;
    moveOutDate: string;
}

export interface ManagerApartment {
    id: number;
    apartmentNumber: string;
    floor: number;
    areaM2: number;
    numBedrooms: number;
    numBathrooms: number;
    status: ApartmentStatus;
    currentResidents: ResidentRef[];
    pendingBillCount: number;
    pendingRequestCount: number;
    createdAt: string;
}

export interface ManagerApartmentDetail {
    id: number;
    apartmentNumber: string;
    floor: number;
    areaM2: number;
    numBedrooms: number;
    numBathrooms: number;
    direction: string | null;
    status: ApartmentStatus;
    notes: string | null;
    currentResidents: ResidentRef[];
    residenceHistory: HistoryRef[];
    vehicles: VehicleRef[];
    recentBills: BillRef[];
}

export interface AssignResidentRequest {
    userId: number;
    isPrimary: boolean;
    moveInDate: string;
    notes?: string;
}

export interface MoveOutRequest {
    moveOutDate: string;
    notes?: string;
}

// ─────────────────────────────────────────────────────────────
// RESIDENTS
// ─────────────────────────────────────────────────────────────

export interface ApartmentRefShort {
    id: number;
    apartmentNumber: string;
    floor: number;
}

export interface Resident {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    idCard: string | null;
    avatarUrl: string | null;
    apartment: ApartmentRefShort;
    isPrimary: boolean;
    moveInDate: string;
    outstandingDebt: number;
    vehicleCount: number;
}

export interface ResidentDetail {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    idCard: string | null;
    dateOfBirth: string | null;
    avatarUrl: string | null;
    apartment: {
        id: number;
        apartmentNumber: string;
        floor: number;
        isPrimary: boolean;
        moveInDate: string;
    };
    vehicles: {
        id: number;
        licensePlate: string;
        vehicleType: VehicleType;
        status: VehicleStatus;
    }[];
    serviceRegistrations: {
        id: number;
        serviceName: string;
        status: ServiceRegistrationStatus;
        startDate: string | null;
    }[];
    billSummary: {
        totalBills: number;
        paidBills: number;
        pendingBills: number;
        outstandingAmount: number;
    };
    recentRequests: {
        id: number;
        title: string;
        status: RequestStatus;
        createdAt: string;
    }[];
}

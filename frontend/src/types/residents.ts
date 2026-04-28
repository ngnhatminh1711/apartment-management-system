import type { ServiceRegistrationStatus, VehicleStatus } from "./common";

export interface ApartmentRefShort {
    apartmentNumber: string;
    floor: string;
    id: number;
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
    outStandingDebt: number;
    vehicleCount: number;
}

export interface ResidentDetail {
    id: number;
    fullName: string;
    email: string | null;
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
        vehicleType: string;
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
        status: string;
        createdAt: string;
    }[];
}

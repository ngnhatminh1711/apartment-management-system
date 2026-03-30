import type { ApartmentStatus } from "./common";

export interface ResidentRef {
    id: number;
    fullName: string;
    phone: string | null;
    isPrimary: boolean;
    moveInDate: string;
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
    currentResident?: ResidentRef | null;
    currentResidents?: ResidentRef[];
    pendingBillCount?: number;
    pendingRequestCount?: number;
    createdAt: string;
}

export interface ApartmentCreateRequest {
    buildingId: number;
    apartmentNumber: string;
    floor: number;
    areaM2: number;
    numBedrooms: number;
    numBathrooms: number;
    direction?: string;
    notes?: string;
}

export type ApartmentUpdateRequest = Omit<Partial<ApartmentCreateRequest>, "buildingId">;

export interface ApartmentStatusRequest {
    status: ApartmentStatus;
    notes?: string;
}

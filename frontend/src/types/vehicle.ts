import type { VehicleStatus, VehicleType } from "./common";

export interface Vehicle {
    id: number;
    owner?: {
        id: number;
        fullName: string;
        phone: string | null;
    };
    apartmentNumber?: string;
    vehicleType: VehicleType;
    licensePlate: string;
    brand: string | null;
    model: string | null;
    color: string | null;
    status: VehicleStatus;
    registeredAt: string;
    approvedAt: string | null;
    rejectionReason: string | null;
    expiredAt: string | null;
    notes: string | null;
}

export interface VehicleRegisterRequest {
    vehicleType: VehicleType;
    licensePlate: string;
    brand?: string;
    model?: string;
    color?: string;
}

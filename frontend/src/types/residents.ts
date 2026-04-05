export interface Resident {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    idCard: string;
    avatarUrl: string | null;
    apartment: ApartmentRef | null;
    isPrimary: boolean;
    moveInDate: string;
    outStandingDebt: number;
    vehicleCount: number;
}

export interface ApartmentRef {
    apartmentNumber: string;
    floor: string;
    id: number;
}

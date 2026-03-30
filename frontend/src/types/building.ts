export interface BuildingStats {
    totalApartments: number;
    occupiedApartments: number;
    availableApartments: number;
    maintenanceApartments?: number;
}

export interface ManagerRef {
    id: number;
    fullName: string;
    email: string;
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
    stats?: BuildingStats;
    createdAt: string;
    updatedAt?: string;
}

export interface BuildingCreateRequest {
    name: string;
    address: string;
    numFloors: number;
    numApartments: number;
    description?: string;
    managerId?: number;
}

export type BuildingUpdateRequest = Partial<BuildingCreateRequest>;

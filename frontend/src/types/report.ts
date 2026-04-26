export interface RevenueByPeriod {
    period: string;
    totalBilled: number;
    totalCollected: number;
    outstanding: number;
    collectionRate: number;
}

export interface RevenueReport {
    summary: {
        totalBilled: number;
        totalCollected: number;
        totalOutstanding: number;
        collectionRate: number;
    };
    breakdown: RevenueByPeriod[];
}

export interface OccupancyReport {
    reportMonth: string;
    buildings: {
        buildingId: number;
        buildingName: string;
        totalApartments: number;
        occupied: number;
        available: number;
        maintenance: number;
        occupancyRate: number;
    }[];
    overall: {
        totalApartments: number;
        occupancyRate: number;
    };
}

export interface DashboardStats {
    overview: {
        totalBuildings: number;
        totalApartments: number;
        totalResidents: number;
        occupancyRate: number;
    };
    financials: {
        currentMonthBilled: number;
        currentMonthCollected: number;
        currentMonthCollectionRate: number;
        outstandingDebt: number;
        totalDebtors: number;
    };
    operations: {
        pendingServiceRequests: number;
        inProgressServiceRequests: number;
        pendingVehicleApprovals: number;
        pendingServiceRegistrations: number;
    };
    revenueChart: {
        month: string;
        billed: number;
        collected: number;
    }[];
    occupancyByBuilding: {
        buildingId: number;
        buildingName: string;
        occupancyRate: number;
    }[];
}

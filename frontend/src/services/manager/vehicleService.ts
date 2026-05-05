import type { ApiResponse, PageParams, PageResponse, VehicleStatus, VehicleType } from "../../types/common";
import type { ManagerVehicle } from "../../types/manager";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/vehicles";

export interface VehicleListResponse {
    pendingCount: number;
    vehicles: PageResponse<ManagerVehicle>;
}

export const managerVehicleService = {
    getAll: async (
        params?: PageParams & {
            status?: VehicleStatus;
            vehicleType?: VehicleType;
            apartmentId?: number;
        },
    ): Promise<VehicleListResponse> => {
        const res = await axiosInstance.get<ApiResponse<VehicleListResponse>>(BASE, { params });
        return res.data.data;
    },

    approve: async (id: number, notes?: string, expiredAt?: string): Promise<ManagerVehicle> => {
        const res = await axiosInstance.patch<ApiResponse<ManagerVehicle>>(`${BASE}/${id}/approve`, { notes, expiredAt });
        return res.data.data;
    },

    reject: async (id: number, rejectionReason: string): Promise<ManagerVehicle> => {
        const res = await axiosInstance.patch<ApiResponse<ManagerVehicle>>(`${BASE}/${id}/reject`, { rejectionReason });
        return res.data.data;
    },
};

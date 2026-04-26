import type { Building, BuildingFormData } from "../../types/admin";
import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/admin/buildings";

export const adminBuildingService = {
    getAll: async (params?: PageParams & { isActive?: boolean }): Promise<PageResponse<Building>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Building>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number): Promise<Building> => {
        const res = await axiosInstance.get<ApiResponse<Building>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: BuildingFormData): Promise<Building> => {
        const res = await axiosInstance.post<ApiResponse<Building>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: Partial<BuildingFormData>): Promise<Building> => {
        const res = await axiosInstance.put<ApiResponse<Building>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    deactivate: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${BASE}/${id}`);
    },

    assignManager: async (id: number, managerId: number): Promise<Building> => {
        const res = await axiosInstance.put<ApiResponse<Building>>(`${BASE}/${id}/assign-manager`, { managerId });
        return res.data.data;
    },
};

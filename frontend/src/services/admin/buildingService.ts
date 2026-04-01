import axiosInstance from "../axiosInstance";
import type { ApiResponse, PageResponse, PageParams } from "../../types/common";
import type { Building, BuildingCreateRequest, BuildingUpdateRequest } from "../../types/building";

const BASE = "/admin/buildings";

export const buildingService = {
    getAll: async (params?: PageParams & { isActive?: boolean; search?: string }) => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Building>>>(BASE, { params });
        console.log(res.data);
        return res.data.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get<ApiResponse<Building>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (req: BuildingCreateRequest) => {
        const res = await axiosInstance.post<ApiResponse<Building>>(BASE, req);
        return res.data.data;
    },

    update: async (id: number, req: BuildingUpdateRequest) => {
        const res = await axiosInstance.put<ApiResponse<Building>>(`${BASE}/${id}`, req);
        return res.data.data;
    },

    deactivate: async (id: number) => {
        await axiosInstance.delete(`${BASE}/${id}`);
    },

    assignManager: async (id: number, managerId: number) => {
        const res = await axiosInstance.put<ApiResponse<Building>>(`${BASE}/${id}/assign-manager`, {
            managerId,
        });
        return res.data.data;
    },
};

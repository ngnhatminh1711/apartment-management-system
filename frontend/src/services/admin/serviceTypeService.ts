import type { ServiceType, ServiceTypeFormData } from "../../types/admin";
import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/admin/service-types";

export const adminServiceTypeService = {
    getAll: async (params?: PageParams & { isActive?: boolean }): Promise<PageResponse<ServiceType>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<ServiceType>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number): Promise<ServiceType> => {
        const res = await axiosInstance.get<ApiResponse<ServiceType>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: ServiceTypeFormData): Promise<ServiceType> => {
        const res = await axiosInstance.post<ApiResponse<ServiceType>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: Partial<ServiceTypeFormData>): Promise<ServiceType> => {
        const res = await axiosInstance.put<ApiResponse<ServiceType>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    toggleActive: async (id: number): Promise<ServiceType> => {
        const res = await axiosInstance.patch<ApiResponse<ServiceType>>(`${BASE}/${id}/toggle-active`);
        return res.data.data;
    },
};

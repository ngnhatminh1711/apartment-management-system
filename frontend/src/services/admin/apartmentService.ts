import type { Apartment, ApartmentFormData } from "../../types/admin";
import type { ApartmentStatus, ApiResponse, PageParams, PageResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/admin/apartments";

export const adminApartmentService = {
    getAll: async (params?: PageParams & { buildingId?: number; status?: ApartmentStatus }): Promise<PageResponse<Apartment>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Apartment>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number): Promise<Apartment> => {
        const res = await axiosInstance.get<ApiResponse<Apartment>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: ApartmentFormData): Promise<Apartment> => {
        const res = await axiosInstance.post<ApiResponse<Apartment>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: Partial<ApartmentFormData>): Promise<Apartment> => {
        const res = await axiosInstance.put<ApiResponse<Apartment>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${BASE}/${id}`);
    },

    updateStatus: async (id: number, status: ApartmentStatus, notes?: string): Promise<Apartment> => {
        const res = await axiosInstance.patch<ApiResponse<Apartment>>(`${BASE}/${id}/status`, { status, notes });
        return res.data.data;
    },
};

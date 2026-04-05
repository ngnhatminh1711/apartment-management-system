import type { Apartment } from "../../types/apartment";
import type { ApiResponse, PageResponse, PageParams } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/apartments";

export const apartmentService = {
    getAll: async (params?: PageParams & { isActive?: boolean; search?: string }) => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Apartment>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get<ApiResponse<Apartment>>(`${BASE}/${id}`);
        return res.data.data;
    },
};

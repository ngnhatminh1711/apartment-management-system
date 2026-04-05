import type { ApiResponse, PageResponse, PageParams } from "../../types/common";
import type { Resident } from "../../types/residents";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/residents";

export const residentService = {
    getAll: async (params?: PageParams & { isActive?: boolean; search?: string }) => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Resident>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number) => {
        const res = await axiosInstance.get<ApiResponse<Resident>>(`${BASE}/${id}`);
        return res.data.data;
    },
};

import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import type { Resident, ResidentDetail } from "../../types/manager";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/residents";

export const managerResidentService = {
    getAll: async (params?: PageParams & { apartmentId?: number; floor?: number }): Promise<PageResponse<Resident>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Resident>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number): Promise<ResidentDetail> => {
        const res = await axiosInstance.get<ApiResponse<ResidentDetail>>(`${BASE}/${id}`);
        return res.data.data;
    },
};

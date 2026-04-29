import type { CurrentFeeResponse, FeeConfig, FeeConfigFormData } from "../../types/admin";
import type { ApiResponse, FeeType } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/admin/fee-configs";

export const adminFeeConfigService = {
    getAll: async (params: { buildingId: number; feeType?: FeeType; activeOnly?: boolean }): Promise<FeeConfig[]> => {
        const res = await axiosInstance.get<ApiResponse<FeeConfig[]>>(BASE, { params });
        return res.data.data;
    },

    getCurrent: async (buildingId: number): Promise<CurrentFeeResponse> => {
        const res = await axiosInstance.get<ApiResponse<CurrentFeeResponse>>(`${BASE}/current`, { params: { buildingId } });
        return res.data.data;
    },

    getById: async (id: number): Promise<FeeConfig> => {
        const res = await axiosInstance.get<ApiResponse<FeeConfig>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: FeeConfigFormData): Promise<FeeConfig> => {
        const res = await axiosInstance.post<ApiResponse<FeeConfig>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: Partial<FeeConfigFormData>): Promise<FeeConfig> => {
        const res = await axiosInstance.put<ApiResponse<FeeConfig>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${BASE}/${id}`);
    },
};

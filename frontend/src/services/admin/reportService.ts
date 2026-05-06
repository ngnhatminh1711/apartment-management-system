import type { DashboardStats, DebtReport } from "../../types/admin";
import type { ApiResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

export const adminReportService = {
    getDashboard: async (buildingId?: number, year?: number): Promise<DashboardStats> => {
        const res = await axiosInstance.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats", {
            params: { buildingId, year },
        });
        return res.data.data;
    },

    getDebt: async (buildingId?: number): Promise<DebtReport> => {
        const res = await axiosInstance.get<ApiResponse<DebtReport>>("/admin/reports/debt", { params: { buildingId } });
        return res.data.data;
    },
};

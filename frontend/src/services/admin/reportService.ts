import type { DashboardStats, DebtReport, OccupancyReport, RevenueReport } from "../../types/admin";
import type { ApiResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

export const adminReportService = {
    getDashboard: async (buildingId?: number, year?: number): Promise<DashboardStats> => {
        const res = await axiosInstance.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats", {
            params: { buildingId, year },
        });
        return res.data.data;
    },

    getRevenue: async (params: { buildingId?: number; from?: string; to?: string; groupBy?: string }): Promise<RevenueReport> => {
        const res = await axiosInstance.get<ApiResponse<RevenueReport>>("/admin/reports/revenue", { params });
        return res.data.data;
    },

    getOccupancy: async (params: { buildingId?: number; month?: string }): Promise<OccupancyReport> => {
        const res = await axiosInstance.get<ApiResponse<OccupancyReport>>("/admin/reports/occupancy", { params });
        return res.data.data;
    },

    getDebt: async (buildingId?: number): Promise<DebtReport> => {
        const res = await axiosInstance.get<ApiResponse<DebtReport>>("/admin/reports/debt", { params: { buildingId } });
        return res.data.data;
    },
};

import type { ApiResponse } from "../../types/common";
import type { ManagerDashboard } from "../../types/manager";
import axiosInstance from "../axiosInstance";

export const managerDashboardService = {
    get: async (): Promise<ManagerDashboard> => {
        const res = await axiosInstance.get<ApiResponse<ManagerDashboard>>("/manager/dashboard");
        return res.data.data;
    },
};

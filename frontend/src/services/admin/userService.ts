import type { Building, User } from "../../types/admin";
import type { ApiResponse, PageParams, PageResponse, UserRole } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/admin/users";

export const adminUserService = {
    getAll: async (
        params?: PageParams & { role?: UserRole; isActive?: boolean; buildingId?: number },
    ): Promise<PageResponse<User>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<User>>>(BASE, { params });
        return res.data.data;
    },

    getById: async (id: number): Promise<Building> => {
        const res = await axiosInstance.get<ApiResponse<Building>>(`${BASE}/${id}`);
        return res.data.data;
    },
};

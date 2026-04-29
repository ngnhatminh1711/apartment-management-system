import type { User, UserCreateFormData, UserUpdateFormData } from "../../types/admin";
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

    getById: async (id: number): Promise<User> => {
        const res = await axiosInstance.get<ApiResponse<User>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: UserCreateFormData): Promise<User> => {
        const res = await axiosInstance.post<ApiResponse<User>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: UserUpdateFormData): Promise<User> => {
        const res = await axiosInstance.put<ApiResponse<User>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    toggleActive: async (id: number): Promise<{ id: number; isActive: boolean }> => {
        const res = await axiosInstance.patch<ApiResponse<{ id: number; isActive: boolean }>>(`${BASE}/${id}/toggle-active`);
        return res.data.data;
    },

    resetPassword: async (id: number): Promise<void> => {
        await axiosInstance.patch(`${BASE}/${id}/reset-password`);
    },

    assignRole: async (id: number, roleId: number): Promise<User> => {
        const res = await axiosInstance.post<ApiResponse<User>>(`${BASE}/${id}/roles`, { roleId });
        return res.data.data;
    },

    removeRole: async (id: number, roleId: number): Promise<User> => {
        const res = await axiosInstance.delete<ApiResponse<User>>(`${BASE}/${id}/roles/${roleId}`);
        return res.data.data;
    },
};

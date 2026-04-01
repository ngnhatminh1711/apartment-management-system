import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/common";
import type { AuthResponse, LoginRequest, ChangePasswordRequest } from "../types/auth";

export const authService = {
    login: async (req: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>("/auth/login", req);
        return res.data.data;
    },

    changePassword: async (req: ChangePasswordRequest): Promise<void> => {
        await axiosInstance.post("/auth/change-password", req);
    },

    getMe: async () => {
        const res = await axiosInstance.get("/auth/me");
        return res.data.data;
    },
};

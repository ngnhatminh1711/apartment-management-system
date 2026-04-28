import type { ApartmentStatus, ApiResponse, PageParams, PageResponse } from "../../types/common";
import type {
    AssignResidentRequest,
    ManagerApartment,
    ManagerApartmentDetail,
    MoveOutRequest,
} from "../../types/manager";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/apartments";

export const managerApartmentService = {
    getAll: async (
        params?: PageParams & { status?: ApartmentStatus; floor?: number },
    ): Promise<PageResponse<ManagerApartment>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<ManagerApartment>>>(BASE, {
            params,
        });
        return res.data.data;
    },

    getById: async (id: number): Promise<ManagerApartmentDetail> => {
        const res = await axiosInstance.get<ApiResponse<ManagerApartmentDetail>>(`${BASE}/${id}`);
        return res.data.data;
    },

    assignResident: async (aptId: number, req: AssignResidentRequest) => {
        const res = await axiosInstance.post<ApiResponse<unknown>>(
            `${BASE}/${aptId}/residents`,
            req,
        );
        return res.data.data;
    },

    moveOut: async (aptId: number, residentId: number, req: MoveOutRequest) => {
        const res = await axiosInstance.patch<ApiResponse<unknown>>(
            `${BASE}/${aptId}/residents/${residentId}/move-out`,
            req,
        );
        return res.data.data;
    },
};

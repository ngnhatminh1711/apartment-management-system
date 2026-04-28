import axiosInstance from "../axiosInstance";
import type { ApiResponse } from "../../types/common";
import type { Vehicle, VehicleRegisterRequest } from "../../types/vehicle";

const BASE_URL = "resident/vehicles";

export const vehicleService = {
  getAll: async () => {
    const res = await axiosInstance.get<ApiResponse<Vehicle[]>>(BASE_URL);

    return res.data;
  },
  create: async (data: VehicleRegisterRequest) => {
    const res = await axiosInstance.post<ApiResponse<any>>(BASE_URL, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};

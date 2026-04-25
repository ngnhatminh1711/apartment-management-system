import axiosInstance from "../axiosInstance";
import type {
  ServiceRequest,
  ServiceRequestCreateRequest,
} from "../../types/serviceRequest";
import type { ApiResponse, PageParams, PageResponse } from "../../types/common";

const BASE_URL = "resident/service-requests";

export const serviceRequestService = {
  getAll: async (params?: PageParams) => {
    const res = await axiosInstance.get<
      ApiResponse<PageResponse<ServiceRequest>>
    >(`${BASE_URL}`, { params });
    return res.data.data;
  },
  create: async (data: ServiceRequestCreateRequest) => {
    const res = await axiosInstance.post(`${BASE_URL}`, data);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await axiosInstance.get(`${BASE_URL}/${id}`);
    return res.data.data;
  },
  rating: async (id: number, rating: number, comment: string) => {
    const res = await axiosInstance.patch(`${BASE_URL}/${id}/rate`, {
      rating,
      comment,
    });
    return res.data;
  },
};

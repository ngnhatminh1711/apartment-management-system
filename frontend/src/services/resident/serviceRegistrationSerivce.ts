import type { ServiceRegistrationCreateRequest } from "../../types/serviceRegistration";
import axiosInstance from "../axiosInstance";

const BASE_URL = "resident/service-registrations";

const serviceRegistrationService = {
  getAll: async () => {
    const res = await axiosInstance.get(`resident/service-types`);
    return res.data.data;
  },
  getMyServices: async () => {
    const res = await axiosInstance.get(`${BASE_URL}`);
    return res.data.data;
  },
  create: async (data: ServiceRegistrationCreateRequest) => {
    const res = await axiosInstance.post(`${BASE_URL}`, data);
    return res.data.data;
  },
  delete: async (id: number) => {
    const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return res.data.data;
  },
};
export default serviceRegistrationService;

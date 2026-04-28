import axiosInstance from "../axiosInstance";
import type { UpdateProfileRequest } from "../../types/auth";

const BASE_URL = "resident/me";

const ProfileService = {
  getProfile: async () => {
    const res = await axiosInstance.get(`${BASE_URL}`);
    return res.data.data;
  },
  updateProfile: async (data: UpdateProfileRequest) => {
    const res = await axiosInstance.put(`${BASE_URL}`, data);
    return res.data.data;
  },
  getApartmentInfo: async () => {
    const res = await axiosInstance.get(`${BASE_URL}/apartment`);
    return res.data.data;
  },
};
export default ProfileService;

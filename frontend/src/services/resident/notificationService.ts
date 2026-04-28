import axiosInstance from "../axiosInstance";
import type { ApiResponse, PageResponse, PageParams } from "../../types/common";
import type { Announcement, Notification } from "../../types/notification";

const BASE = "resident/notifications";

export const notificationService = {
  getAll: async (
    params?: PageParams & { isRead?: boolean; type?: Notification["type"] },
  ) => {
    const res = await axiosInstance.get<
      ApiResponse<PageResponse<Notification>>
    >(BASE, { params });

    return res.data.data;
  },

  markAsRead: async (id: number) => {
    await axiosInstance.patch(`${BASE}/${id}/read`);
  },

  markAllAsRead: async () => {
    await axiosInstance.patch(`${BASE}/read-all`);
  },
  getAnnouncements: async (params?: PageParams) => {
    const res = await axiosInstance.get<
      ApiResponse<PageResponse<Announcement>>
    >(`resident/announcements`, { params });
    return res.data.data;
  },
};

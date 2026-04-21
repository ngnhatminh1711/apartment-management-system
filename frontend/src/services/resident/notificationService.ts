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

    return res.data.data; // PageResponse
  },

  markAsRead: async (id: number) => {
    await axiosInstance.patch(`${BASE}/${id}/read`);
  },

  markAllAsRead: async () => {
    await axiosInstance.patch(`${BASE}/read-all`);
  },
  getAnnouncement: async () => {
    const res = await axiosInstance.get<ApiResponse<Announcement>>(
      `resident/announcements`,
    );
    return res.data.data;
  },
};

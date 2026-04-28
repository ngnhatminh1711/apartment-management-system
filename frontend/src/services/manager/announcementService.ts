import type { Announcement, AnnouncementFormData } from "../../types/announcement";
import type { AnnouncementPriority, ApiResponse, PageParams, PageResponse } from "../../types/common";
import axiosInstance from "../axiosInstance";

const BASE = "/manager/announcements";

export const managerAnnouncementService = {
    getAll: async (
        params?: PageParams & {
            isPublished?: boolean;
            priority?: AnnouncementPriority;
            search?: string;
        },
    ): Promise<PageResponse<Announcement>> => {
        const res = await axiosInstance.get<ApiResponse<PageResponse<Announcement>>>(BASE, {
            params,
        });
        return res.data.data;
    },

    getById: async (id: number): Promise<Announcement> => {
        const res = await axiosInstance.get<ApiResponse<Announcement>>(`${BASE}/${id}`);
        return res.data.data;
    },

    create: async (data: AnnouncementFormData): Promise<Announcement> => {
        const res = await axiosInstance.post<ApiResponse<Announcement>>(BASE, data);
        return res.data.data;
    },

    update: async (id: number, data: AnnouncementFormData): Promise<Announcement> => {
        const res = await axiosInstance.put<ApiResponse<Announcement>>(`${BASE}/${id}`, data);
        return res.data.data;
    },

    togglePublish: async (id: number): Promise<Announcement> => {
        const res = await axiosInstance.patch<ApiResponse<Announcement>>(`${BASE}/${id}/toggle-publish`);
        return res.data.data;
    },
};

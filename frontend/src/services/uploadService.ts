import type { ApiResponse } from "../types/common";
import axiosInstance from "./axiosInstance";

export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    width: number | null;
    height: number | null;
    bytes: number | null;
}

export type UploadFolder = "avatars" | "requests" | "announcements" | "service-types" | "general";

export const uploadService = {
    /**
     * Upload 1 ảnh lên Cloudinary qua backend.
     * @param file    File ảnh từ input
     * @param folder  Sub-folder trên Cloudinary
     */
    uploadImage: async (file: File, folder: UploadFolder = "general"): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosInstance.post<ApiResponse<UploadResult>>(`/upload/image?folder=${folder}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data;
    },

    /**
     * Upload nhiều ảnh cùng lúc (tối đa 5).
     */
    uploadImages: async (files: File[], folder: UploadFolder = "general"): Promise<UploadResult[]> => {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));

        const res = await axiosInstance.post<ApiResponse<UploadResult[]>>(`/upload/images?folder=${folder}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.data;
    },

    /**
     * Xóa ảnh theo publicId.
     */
    deleteImage: async (publicId: string): Promise<void> => {
        await axiosInstance.delete(`/upload/image?publicId=${encodeURIComponent(publicId)}`);
    },
};

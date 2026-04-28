import type { AnnouncementPriority } from "./common";

export interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: AnnouncementPriority;
    isPublished: boolean;
    attachmentUrls: string[];
    publishedAt: string;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AnnouncementFormData {
    title: string;
    content: string;
    priority: AnnouncementPriority;
    attachmentUrls?: string[];
    expiresAt?: string;
}

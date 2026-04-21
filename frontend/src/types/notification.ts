import type { NotificationType } from "./common";

export interface Notification {
  id: number;
  title: string;
  content: string | null;
  type: NotificationType;
  referenceType: string | null;
  referenceId: number | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  senderName: string;
  buildingId?: number;
  attachmentUrls: string[];
  isPublished: boolean;
  publishedAt: string;
  expiresAt: string | null;
  viewCount?: number;
  createdAt: string;
}

export interface AnnouncementCreateRequest {
  title: string;
  content: string;
  priority: string;
  attachmentUrls?: string[];
  expiresAt?: string;
}

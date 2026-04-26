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

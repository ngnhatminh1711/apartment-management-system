import type { RequestStatus, RequestType } from "./common";

export interface ServiceRequest {
    id: number;
    requestType: RequestType;
    title: string;
    description: string;
    attachmentUrls: string[];
    priority: RequestPriority;
    status: RequestStatus;
    apartmentNumber?: string;
    resident?: {
        id: number;
        fullName: string;
        phone: string | null;
    };
    assignedTo?: {
        id: number;
        fullName: string;
        phone?: string | null;
    } | null;
    resolutionNotes: string | null;
    rating: number | null;
    createdAt: string;
    assignedAt: string | null;
    resolvedAt: string | null;
    updatedAt: string;
}

export interface ServiceRequestCreateRequest {
    requestType: RequestType;
    title: string;
    description: string;
    priority?: RequestPriority;
    attachmentUrls?: string[];
}

export interface ServiceRequestAssignRequest {
    assignedToId: number;
    notes?: string;
}

export interface ServiceRequestStatusRequest {
    status: RequestStatus;
    resolutionNotes?: string;
}

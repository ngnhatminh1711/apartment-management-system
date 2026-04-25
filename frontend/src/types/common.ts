export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: string;
}

export interface PageResponse<T> {
  summary: {};
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export type UserRole = "ROLE_ADMIN" | "ROLE_MANAGER" | "ROLE_RESIDENT";

export type ApartmentStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "RESERVED";

export type BillStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type FeeType =
  | "ELECTRICITY"
  | "WATER"
  | "MANAGEMENT"
  | "PARKING_MOTORBIKE"
  | "PARKING_CAR"
  | "GARBAGE"
  | "INTERNET"
  | "ELEVATOR";

export type PaymentMethod = "CASH" | "VNPAY" | "MOMO" | "BANK_TRANSFER";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type VehicleType = "MOTORBIKE" | "CAR" | "BICYCLE" | "TRUCK";

export type VehicleStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "INACTIVE"
  | "REJECTED";

export type RequestType =
  | "MAINTENANCE"
  | "COMPLAINT"
  | "INQUIRY"
  | "AMENITY"
  | "OTHER";

export type RequestStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type RegistrationStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export type AnnouncementPriority = "NORMAL" | "IMPORTANT" | "URGENT";

export type NotificationType =
  | "BILL_CREATED"
  | "BILL_DUE_SOON"
  | "BILL_OVERDUE"
  | "PAYMENT_SUCCESS"
  | "REQUEST_UPDATE"
  | "REQUEST_RESOLVED"
  | "VEHICLE_APPROVED"
  | "VEHICLE_REJECTED"
  | "SERVICE_APPROVED"
  | "ANNOUNCEMENT"
  | "SYSTEM";

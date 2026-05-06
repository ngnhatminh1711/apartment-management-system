import type { PaymentMethod, PaymentStatus } from "./common";

export interface Payment {
    id: number;
    bill?: {
        id: number;
        billingMonth: string;
        totalAmount: number;
        apartmentNumber?: string;
    };
    amount: number;
    paymentMethod: PaymentMethod;
    transactionRef: string | null;
    status: PaymentStatus;
    paymentNote: string | null;
    paidAt: string | null;
    createdAt: string;
}

export interface PaymentRequest {
    billId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentNote?: string;
}

export interface PaymentCreateResponse {
    paymentId: number;
    billId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    paymentUrl?: string;
    expiredAt?: string;
}

export interface PaymentQrData {
    paymentId: number;
    billId: number;
    amount: number;
    paymentRef: string;
    qrImageUrl: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    transferContent: string;
    expiredAt: string; // ISO datetime
    status: "PENDING" | "SUCCESS" | "EXPIRED";
}

export interface PaymentStatusData {
    paymentId: number;
    status: PaymentStatus;
    amount: number | null;
    paidAt: string | null;
    transactionRef: string | null;
    message: string;
}

export interface PaymentInitRequest {
    billId: number;
    amount?: number; // null = thanh toán toàn bộ remaining
}

import type { BillStatus, FeeType, PaymentStatus } from "./common";

export interface BillItem {
  id: number;
  feeType: FeeType;
  description: string | null;
  readingStart: number | null;
  readingEnd: number | null;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentRef {
  id: number;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  paidAt: string | null;
}

export interface Bill {
  id: number;
  apartmentId?: number;
  apartmentNumber: number;
  residentName?: string;
  billingMonth: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount?: number;
  status: BillStatus;
  dueDate: string;
  isOverdue?: boolean;
  notes: string | null;
  items?: BillItem[];
  payments?: PaymentRef[];
  myPayments?: PaymentRef[];
  createdBy?: string;
  createdAt: string;
}

export interface BillItemRequest {
  feeType: FeeType;
  readingStart?: number;
  readingEnd?: number;
}

export interface BillCreateRequest {
  apartmentId: number;
  billingMonth: string;
  dueDate: string;
  notes?: string;
  items: BillItemRequest[];
}

export interface BillSummary {
  totalBills?: number;
  paidCount?: number;
  pendingCount?: number;
  overdueCount?: number;
  totalAmount?: number;
  collectedAmount?: number;
  totalOutstanding?: number;
}
export interface PageBillResponse {
  summary: BillSummary;
  content: Bill[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

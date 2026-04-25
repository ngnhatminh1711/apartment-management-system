import type { PageParams } from "../../types/common";
import type { ApiResponse, PageResponse } from "../../types/common";
import type { Payment, PaymentRequest } from "../../types/payment";
import axiosInstance from "../axiosInstance";
const BASE_URL = "resident/payments";
const MOCK_PAYMENT_KEY = "resident_mock_payments";

type PaymentQueryParams = PageParams & {
  billId?: number;
  status?: Payment["status"];
  paymentMethod?: Payment["paymentMethod"];
  from?: string;
  to?: string;
};

const readMockPayments = (): Payment[] => {
  const raw = localStorage.getItem(MOCK_PAYMENT_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Payment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeMockPayments = (payments: Payment[]) => {
  localStorage.setItem(MOCK_PAYMENT_KEY, JSON.stringify(payments));
};

const mergePaymentPages = (
  remotePage: PageResponse<Payment>,
  localPayments: Payment[],
  params?: PaymentQueryParams,
): PageResponse<Payment> => {
  const merged = [...remotePage.content, ...localPayments];

  const filtered = merged.filter((p) => {
    if (params?.billId && p.bill?.id !== params.billId) return false;
    if (params?.status && p.status !== params.status) return false;
    if (params?.paymentMethod && p.paymentMethod !== params.paymentMethod) return false;
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    const aTime = new Date(a.paidAt ?? a.createdAt).getTime();
    const bTime = new Date(b.paidAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });

  const page = params?.page ?? 0;
  const size = params?.size ?? 10;
  const start = page * size;
  const end = start + size;

  return {
    ...remotePage,
    content: sorted.slice(start, end),
    totalElements: sorted.length,
    totalPages: Math.max(1, Math.ceil(sorted.length / size)),
    currentPage: page,
  };
};

const PaymentService = {
  getPayments: async (params?: PaymentQueryParams) => {
    const localPayments = readMockPayments();

    try {
      const response = await axiosInstance.get<
        ApiResponse<PageResponse<Payment>>
      >(`${BASE_URL}`, { params });
      return mergePaymentPages(response.data.data, localPayments, params);
    } catch {
      const fallbackPage: PageResponse<Payment> = {
        summary: {},
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: params?.page ?? 0,
      };
      return mergePaymentPages(fallbackPage, localPayments, params);
    }
  },
  getPaymentDetails: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Payment>>(
      `${BASE_URL}/${id}`,
    );
    return response.data.data;
  },
  createPayment: async (request: PaymentRequest, billInfo?: Payment["bill"]) => {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      id: Date.now(),
      amount: request.amount,
      paymentMethod: request.paymentMethod,
      transactionRef: null,
      status: "PENDING",
      paymentNote: request.paymentNote ?? null,
      paidAt: null,
      createdAt: now,
      bill: billInfo,
    };

    const current = readMockPayments();
    writeMockPayments([newPayment, ...current]);
    return newPayment;
  },
  updatePaymentStatusComplete: async (id: number) => {
    try {
      await axiosInstance.patch(`${BASE_URL}/${id}/status`, { status: "SUCCESS" });
    } catch {
      // Backend currently has no status update endpoint; keep local simulation.
    }

    const current = readMockPayments();
    const updated = current.map((p) =>
      p.id === id
        ? {
            ...p,
            status: "SUCCESS" as const,
            paidAt: p.paidAt ?? new Date().toISOString(),
          }
        : p,
    );
    writeMockPayments(updated);
  },
};

export default PaymentService;

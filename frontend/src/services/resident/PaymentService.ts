import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import type { Payment, PaymentInitRequest, PaymentQrData, PaymentStatusData } from "../../types/payment";
import axiosInstance from "../axiosInstance";
const BASE_URL = "resident/payments";

type PaymentQueryParams = PageParams & {
    billId?: number;
    status?: Payment["status"];
    paymentMethod?: Payment["paymentMethod"];
    from?: string;
    to?: string;
};

const PaymentService = {
    getPayments: async (params?: PaymentQueryParams) => {
        const response = await axiosInstance.get<ApiResponse<PageResponse<Payment>>>(`${BASE_URL}`, { params });
        return response.data.data;
    },

    getPaymentDetails: async (id: number) => {
        const response = await axiosInstance.get<ApiResponse<Payment>>(`${BASE_URL}/${id}`);
        return response.data.data;
    },

    // SEPAY
    /** Khởi tạo thanh toán SePay – lấy QR code và thông tin chuyển khoản */
    initSepayPayment: async (req: PaymentInitRequest): Promise<PaymentQrData> => {
        const res = await axiosInstance.post<ApiResponse<PaymentQrData>>(`${BASE_URL}/init`, req);
        return res.data.data;
    },

    /** Polling trạng thái thanh toán (gọi mỗi 3s khi hiển thị QR) */
    checkPaymentStatus: async (paymentId: number): Promise<PaymentStatusData> => {
        const res = await axiosInstance.get<ApiResponse<PaymentStatusData>>(`${BASE_URL}/${paymentId}/status`);
        return res.data.data;
    },
};

export default PaymentService;

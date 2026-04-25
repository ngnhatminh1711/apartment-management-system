import type { PageParams } from "../../types/common";
import type { ApiResponse, PageResponse } from "../../types/common";
import type { Payment } from "../../types/payment";
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
    const response = await axiosInstance.get<
      ApiResponse<PageResponse<Payment>>
    >(`${BASE_URL}`, { params });
    return response.data.data;
  },
  getPaymentDetails: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Payment>>(
      `${BASE_URL}/${id}`,
    );
    return response.data.data;
  },
};

export default PaymentService;

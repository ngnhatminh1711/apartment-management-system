import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import type { Bill, BillSummary } from "../../types/bill";
import axiosInstance from "../axiosInstance";

const BASE_URL = "resident/bills";

const BillService = {
  getBills: async (params?: PageParams) => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Bill>>>(
      `${BASE_URL}`,
      { params },
    );
    return response.data.data;
  },
  getBillDetails: async (billId: number) => {
    const response = await axiosInstance.get<ApiResponse<Bill>>(
      `${BASE_URL}/${billId}`,
    );

    return response.data.data;
  },
};

export default BillService;

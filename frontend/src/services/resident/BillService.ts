import type { ApiResponse, PageParams, PageResponse } from "../../types/common";
import type { Bill, PageBillResponse } from "../../types/bill";
import axiosInstance from "../axiosInstance";

const BASE_URL = "resident/bills";

const BillService = {
  getBills: async (params?: PageParams) => {
    const response = await axiosInstance.get<ApiResponse<PageBillResponse>>(
      `${BASE_URL}`,
      { params },
    );
    console.log("Get bills response:", response.data);
    return response.data.data;
  },
  getBillDetails: async (billId: number) => {
    const response = await axiosInstance.get<ApiResponse<Bill>>(
      `${BASE_URL}/${billId}`,
    );
    console.log("Bill details response:", response.data);
    return response.data.data;
  },
};

export default BillService;

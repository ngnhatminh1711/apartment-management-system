import { useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import { useToast } from "../../../hooks/useToast";
import BillService from "../../../services/resident/BillService";
import { useEffect, useState } from "react";
import { ToastContainer } from "../../../components/common/ToastContainer";
import type { Bill } from "../../../types/bill";
import type { PaymentRequest } from "../../../types/payment";

const Payment = () => {
  const { id } = useParams();
  const toast = useToast();
  const [data, setData] = useState<Bill>();
  const fetchPaymentInfo = async () => {
    try {
      const res = await BillService.getBillDetails(Number(id));
      setData(res);
      toast.success("Tải thông tin thanh toán thành công!");
    } catch (error) {
      toast.error("Không thể tải thông tin thanh toán");
    }
  };
  const handleSubmit = async (payment: PaymentRequest) => {
    console.log("Submitting payment:", payment);
    toast.success("Đang xử lý thanh toán, vui lòng chờ 1 phút...");
    await new Promise((resolve) => setTimeout(resolve, 60_000));
    toast.success("Thanh toán tạm hoàn tất sau 1 phút.");
  };
  useEffect(() => {
    fetchPaymentInfo();
  }, []);
  if (data?.status === "PAID") {
    return (
      <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
        Hóa đơn đã được thanh toán
      </div>
    );
  }
  return (
    <main>
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-container rounded-xl shadow-sm border border-outline overflow-hidden">
          <div className="p-8 border-b border-outline bg-linear-to-r from-white to-primary-container/20">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Thanh toán hóa đơn
                </h2>

                <div className="flex items-center gap-2 text-primary font-medium">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  <span>
                    Đang thanh toán cho: Hóa đơn tháng {data?.billingMonth}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <PaymentForm
            billId={Number(id)}
            remainingAmount={data?.remainingAmount ?? 0}
            handSubmit={handleSubmit}
          />
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};

export default Payment;

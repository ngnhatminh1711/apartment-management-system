import { useEffect, useState } from "react";
import ServiceTable from "../../../components/resident/ServiceTable";
import PaymentHistory from "../../../components/resident/PaymentHistory";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import BillService from "../../../services/resident/BillService";
import type { Bill } from "../../../types/bill";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { BILL_STATUS_LABELS } from "../../../utils/constants";
import { Spinner } from "../../../components/common/Spinner";

const BillDetailPage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState<Bill | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const fetchBillDetail = async () => {
    try {
      const data = await BillService.getBillDetails(Number(id));
      setBill(data);
      toast.success("Tải chi tiết hóa đơn thành công!");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.code ||
        e?.message ||
        "Không thể tải chi tiết hóa đơn";
      toast.error(msg);
    } finally {
    }
  };
  useEffect(() => {
    if (id) {
      fetchBillDetail();
    }
  }, [id]);

  if (!bill) {
    return <Spinner />;
  }

  return (
    <main>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors duration-200 group"
      >
        <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
          arrow_back
        </span>
        <span className="text-sm font-semibold uppercase tracking-wider">
          Quay về
        </span>
      </button>
      <div>
        <div className="bg-white rounded-xl p-8 border border-outline shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1  text-xs font-bold rounded-full uppercase tracking-wider">
                {BILL_STATUS_LABELS[bill.status]}
              </span>
              <span className="text-slate-500 text-sm font-medium">
                Hóa đơn: #{bill.id}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Kỳ thanh toán {bill.billingMonth}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-base"
                  data-icon="calendar_month"
                >
                  calendar_month
                </span>
                Hạn chót: {formatDate(bill.dueDate)}
              </div>
            </div>
          </div>
          {(bill.remainingAmount ?? 0) > 0 && (
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500 mb-1">
                Tổng cộng cần thanh toán
              </p>
              <p className="text-4xl font-black text-blue-600">
                {formatCurrency(bill.remainingAmount ?? 0)}
              </p>
              <button
                onClick={() => navigate(`/resident/bills/${bill.id}/payment`)}
                className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <span
                  className="material-symbols-outlined"
                  data-icon="account_balance_wallet"
                >
                  account_balance_wallet
                </span>
                Thanh Toán Ngay
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ServiceTable
              data={bill.items ?? []}
              totalAmount={bill.totalAmount}
            />
          </div>

          <div className="space-y-8">
            <PaymentHistory payments={bill.myPayments ?? []} />
            <div className="bg-primary-container/10 border-dashed border-2 border-primary/30 rounded-xl p-6 flex items-center gap-6">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <span
                  className="material-symbols-outlined text-primary text-3xl"
                  data-icon="security"
                >
                  security
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Thanh toán an toàn</h4>
                <p className="text-sm text-slate-600">
                  Hệ thống hỗ trợ đa dạng phương thức thanh toán bảo mật tuyệt
                  đối qua VNPAY, Bank Transfer và Thẻ tín dụng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};

export default BillDetailPage;

import type { Bill } from "../../../types/bill";
import { formatDate } from "../../../utils/formatters";
import { useNavigate } from "react-router-dom";
type Props = {
  bill: Bill;
};

export default function BillCard({ bill }: Props) {
  const navigate = useNavigate();

  const getStatusStyle = () => {
    switch (bill.status) {
      case "OVERDUE":
        return {
          badge: "bg-red-500 text-white",
          border: "border-red-300 hover:border-red-500",
          amount: "text-red-500",
          dueDate: "text-red-500",
        };
      case "PENDING":
        return {
          badge: "bg-amber-100 text-amber-700",
          border: "border-outline hover:border-amber-400/50",
          amount: "text-amber-600",
          dueDate: "text-slate-900",
        };
      case "PARTIALLY_PAID":
        return {
          badge: "bg-primary-container text-primary",
          border: "border-outline hover:border-primary/50",
          amount: "text-primary",
          dueDate: "text-slate-900",
        };
      case "PAID":
        return {
          badge: "bg-emerald-100 text-emerald-700",
          border: "border-outline/50",
          amount: "text-slate-900",
          dueDate: "text-emerald-600",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-600",
          border: "border-outline",
          amount: "",
          dueDate: "",
        };
    }
  };

  const styles = getStatusStyle();

  return (
    <div
      className={`bg-white rounded-xl p-6 editorial-shadow border ${styles.border} transition-all group`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-1">
            Kỳ hóa đơn
          </p>
          <h4 className="text-lg font-bold text-slate-900">
            {bill.billingMonth}
          </h4>
        </div>
        <span
          className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${styles.badge}`}
        >
          {bill.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tổng số tiền</span>
          <span className="font-bold">
            {bill.totalAmount.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Còn nợ</span>
          <span className={`font-bold ${styles.amount}`}>
            {bill.remainingAmount?.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>

        <div className="flex justify-between text-[11px] pt-3 border-t border-slate-100">
          <span className="text-slate-400">Ngày đến hạn</span>
          <span className={`font-medium ${styles.dueDate}`}>
            {formatDate(bill.dueDate)}
          </span>
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-lg text-sm font-bold transition-transform group-hover:scale-[1.01] border border-outline text-slate-600`}
        onClick={() => navigate(`/resident/bills/${bill.id}`)}
      >
        Xem chi tiết
      </button>
    </div>
  );
}

import type { PaymentRef } from "../../../types/bill";
type Props = {
  payment: PaymentRef;
};
const PaymentItem = ({ payment }: Props) => {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-slate-900">
          {payment.amount.toLocaleString("vi-VN")}đ
        </p>

        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-green-50 text-green-600">
          {payment.status}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">Thanh toán hóa đơn</p>

      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">payments</span>
          {payment.paymentMethod}
        </span>

        <span>
          {payment.paidAt
            ? new Date(payment.paidAt).toLocaleDateString("vi-VN")
            : "-"}
        </span>
      </div>
    </div>
  );
};

export default PaymentItem;

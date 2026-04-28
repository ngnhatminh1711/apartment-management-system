import type { PaymentRef } from "../../types/bill";
import {
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from "../../utils/constants";
import { formatCurrency, formatDate } from "../../utils/formatters";
type Props = {
  payment: PaymentRef;
};
const PaymentItemBill = ({ payment }: Props) => {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-slate-900">
          {formatCurrency(payment.amount)}
        </p>

        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${PAYMENT_STATUS_COLORS[payment.status]}`}
        >
          {PAYMENT_STATUS_LABELS[payment.status]}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">Thanh toán hóa đơn</p>

      <div className="flex justify-between items-center text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">payments</span>
          {payment.paymentMethod}
        </span>

        <span>{formatDate(payment.paidAt)}</span>
      </div>
    </div>
  );
};

export default PaymentItemBill;

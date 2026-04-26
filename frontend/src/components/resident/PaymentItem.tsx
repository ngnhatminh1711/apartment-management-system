import type { Payment } from "../../types/payment";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
} from "../../utils/constants";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

type Props = {
  item: Payment;
};
const PaymentItem = ({ item }: Props) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-8 py-5 font-mono text-slate-500">#{item.id}</td>

      <td className="px-8 py-5">
        <div>{formatDateTime(item.paidAt)}</div>
      </td>

      <td className="px-8 py-5">
        <div className="font-semibold">{item.bill?.apartmentNumber ?? "-"}</div>
        <div className="text-xs text-slate-500">
          {item.bill?.billingMonth ?? "-"}
        </div>
      </td>

      <td className="px-8 py-5">{PAYMENT_METHOD_LABELS[item.paymentMethod]}</td>

      <td className="px-8 py-5 font-bold text-green-600">
        {formatCurrency(item.bill?.totalAmount ?? 0)}
      </td>

      <td className={`px-8 py-5  font-medium `}>
        <span className={PAYMENT_STATUS_COLORS[item.status]}>
          {PAYMENT_STATUS_LABELS[item.status]}
        </span>
      </td>
    </tr>
  );
};

export default PaymentItem;

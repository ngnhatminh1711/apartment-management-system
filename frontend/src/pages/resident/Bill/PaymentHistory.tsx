import type { PaymentRef } from "../../../types/bill";
import PaymentItem from "./PaymentItemBill";
type Props = {
  payments: PaymentRef[];
};
const PaymentHistory = ({ payments }: Props) => {
  if (!payments.length) {
    return (
      <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
        Chưa có giao dịch nào
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50">
        <h3 className="text-sm font-bold uppercase tracking-widest">
          Lịch sử giao dịch
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {payments.map((p) => (
          <PaymentItem key={p.id} payment={p} />
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;

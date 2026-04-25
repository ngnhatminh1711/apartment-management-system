import { useState } from "react";
import type { PaymentMethod } from "../../../types/common";
import PaymentMethodSection from "./PaymentMethodSection";
import type { PaymentRequest } from "../../../types/payment";
type Props = {
  billId: number;
  remainingAmount: number;
  handSubmit: (payment: PaymentRequest) => Promise<void>;
};
const PaymentForm = ({ billId, remainingAmount, handSubmit }: Props) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("VNPAY");
  const [paymentNote, setPaymentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await handSubmit({
        billId,
        amount: remainingAmount,
        paymentMethod,
        paymentNote: paymentNote.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="p-8 space-y-8">
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Số tiền thanh toán
        </label>

        <div className="relative group">
          <input
            className="w-full h-16 pl-6 pr-12 text-2xl font-bold text-primary bg-surface-variant rounded-lg"
            value={
              remainingAmount
                ? `${remainingAmount.toLocaleString("vi-VN")}đ`
                : ""
            }
            readOnly
          />
        </div>
      </div>
      <PaymentMethodSection value={paymentMethod} onChange={setPaymentMethod} />
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Ghi chú thanh toán
        </label>

        <textarea
          className="w-full p-4 text-sm bg-surface-variant rounded-lg"
          placeholder="Nhập ghi chú..."
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
        />
      </div>
      <div className="pt-6">
        <button
          type="button"
          className="w-full h-14 bg-primary text-white rounded-lg font-bold text-lg flex items-center justify-center gap-3"
          onClick={handleClick}
          disabled={submitting}
        >
          {submitting ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;

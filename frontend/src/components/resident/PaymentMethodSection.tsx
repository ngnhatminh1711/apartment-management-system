import type { PaymentMethod } from "../../types/common";
import { PAYMENT_METHOD_LABELS } from "../../utils/constants";

type Props = {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
};

const PaymentMethodSection = ({ value, onChange }: Props) => {
  const methods: { name: PaymentMethod; icon: string }[] = [
    { name: "VNPAY", icon: "qr_code_2" },
    { name: "MOMO", icon: "account_balance_wallet" },
    {
      name: "BANK_TRANSFER",
      icon: "account_balance",
    },
    { name: "CASH", icon: "payments" },
  ];
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-slate-700">
        Phương thức thanh toán
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m, i) => (
          <PaymentMethodItem
            key={i}
            method={m}
            selected={value}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  );
};
const PaymentMethodItem = ({
  method,
  selected,
  onSelect,
}: {
  method: { name: PaymentMethod; icon: string };
  selected: PaymentMethod;
  onSelect: (value: PaymentMethod) => void;
}) => {
  return (
    <label
      className={`p-4 border rounded-lg cursor-pointer transition-all
        ${selected === method.name ? "border-primary bg-blue-50" : "border-outline"}
      `}
    >
      <input
        type="radio"
        name="payment_method"
        className="sr-only"
        checked={selected === method.name}
        onChange={() => onSelect(method.name)}
      />

      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm mr-4">
        <span className="material-symbols-outlined">{method.icon}</span>
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold">
          {PAYMENT_METHOD_LABELS[method.name]}
        </p>
      </div>
    </label>
  );
};
export default PaymentMethodSection;

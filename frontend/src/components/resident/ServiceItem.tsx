import type { BillItem } from "../../types/bill";
import { FEE_TYPE_LABELS } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatters";

type Props = {
  data: BillItem;
};
const ServiceItem = ({ data }: Props) => {
  return (
    <tr>
      <td className="px-6 py-6 align-top">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-bold text-slate-900">
              {FEE_TYPE_LABELS[data.feeType]}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-6 text-sm text-slate-600">
        <div className="flex flex-col gap-1">
          <span className="text-slate-900 font-medium">{data.description}</span>
          <span className="text-xs">
            Tiêu thụ: <span className="font-bold">{data.quantity}</span> x{" "}
            <span className="font-bold">{formatCurrency(data.unitPrice)}</span>
          </span>
        </div>
      </td>
      <td className="px-6 py-6 text-right font-bold text-slate-900">
        {formatCurrency(data.amount)}
      </td>
    </tr>
  );
};

export default ServiceItem;

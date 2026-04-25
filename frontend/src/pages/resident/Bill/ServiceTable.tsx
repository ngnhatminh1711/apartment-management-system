import type { BillItem } from "../../../types/bill";
import ServiceItem from "./ServiceItem";

type Props = {
  data: BillItem[];
  totalAmount: number;
};

const ServiceTable = ({ data, totalAmount }: Props) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b text-lg font-bold text-slate-900">
        Chi tiết dịch vụ
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4">Hạng mục</th>
            <th className="px-6 py-4">Chỉ số / Mô tả</th>
            <th className="px-6 py-4 text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, index) => (
            <ServiceItem key={index} data={item} />
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-slate-50/50">
            <td className="px-6 py-6 font-bold text-slate-900 text-lg">
              Tổng hóa đơn
            </td>
            <td className="px-6 py-6 text-right font-black text-blue-600 text-2xl">
              {totalAmount.toLocaleString("vi-VN")}đ
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ServiceTable;

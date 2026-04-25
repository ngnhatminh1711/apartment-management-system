import React from "react";
import type { Vehicle } from "../../../types/vehicle";
import VehicleItem from "./VehicleItem";

type Props = {
  data: Vehicle[];
  onDelete: (id: number) => void;
};
const VehicleList = ({ data, onDelete }: Props) => {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-400 italic">
        Bạn chưa đăng ký xe nào. Hãy thêm xe để sử dụng các tiện ích bãi đỗ xe.
      </div>
    );
  }
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-800/50">
          <th className="px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Biển số
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Loại xe
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Hãng/Mẫu xe
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Màu sắc
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Ngày đăng ký
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Ngày chấp thuận
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Ngày hết hạn
          </th>
          <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
            Trạng thái
          </th>
          <th className="px-8 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((v) => (
          <VehicleItem key={v.id} data={v} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

export default VehicleList;

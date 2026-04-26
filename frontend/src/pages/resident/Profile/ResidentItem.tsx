import React from "react";
import type { ResidentRef } from "../../../types/apartment";
type Props = {
  data: ResidentRef;
};
const ResidentItem = ({ data }: Props) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{data?.fullName}</span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
          {data.isPrimary === true ? "Chủ hộ" : "Thành viên"}
        </span>
      </td>

      <td className="px-6 py-4 text-sm text-slate-500">
        {data?.moveInDate
          ? new Date(data.moveInDate).toLocaleDateString()
          : "N/A"}
      </td>
    </tr>
  );
};

export default ResidentItem;

import React from "react";
import ResidentItem from "./ResidentItem";
import type { ApartmentBuilding } from "../../../types/apartment";

type Props = {
  data: ApartmentBuilding;
};

const ResidentSection = ({ data }: Props) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">groups</span>
          Danh sách thành viên trong căn hộ
        </h3>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Họ và tên
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                Ngày dọn vào
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data?.householdMembers?.map((member) => (
              <ResidentItem key={member.id} data={member} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ResidentSection;

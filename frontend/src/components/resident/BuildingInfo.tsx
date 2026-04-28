import type { ApartmentBuilding } from "../../types/apartment";

type Props = {
  data: ApartmentBuilding;
};
const BuildingInfo = ({ data }: Props) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      <h3 className="font-bold flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">domain</span>
        Thông tin tòa nhà
      </h3>
      <div className="space-y-4">
        <InfoItem label="Tên dự án" value={data?.building?.name} />
        <InfoItem label="Địa chỉ" value={data?.building?.address} />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium uppercase mb-2">
          Người Quản lý Tòa nhà
        </p>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded bg-primary/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">
              admin_panel_settings
            </span>
          </div>
          <div>
            <p className="text-sm font-bold">{data?.building?.managerName}</p>
            <p className="text-[10px] text-primary font-semibold">
              Hotline: {data?.building?.managerPhone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
const InfoItem = ({ label, value }: any) => (
  <div>
    <p className="text-xs text-slate-400 font-medium uppercase mb-1">{label}</p>
    <p className="font-bold text-slate-900">{value}</p>
  </div>
);
export default BuildingInfo;

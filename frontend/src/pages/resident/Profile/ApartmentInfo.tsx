import type { ApartmentBuilding } from "../../../types/apartment";
type Props = {
  data: ApartmentBuilding;
};
const ApartmentInfo = ({ data }: Props) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            apartment
          </span>
          Thông tin cơ bản căn hộ
        </h3>
        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded">
          Đang ở
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        <InfoItem label="Số căn hộ :" value={data?.apartmentNumber} />
        <InfoItem label="Tòa nhà :" value={data?.building?.name} />
        <InfoItem label="Tầng :" value={data?.floor} />
        <InfoItem label="Diện tích :" value={data?.areaM2} />
        <InfoItem label="Số phòng ngủ :" value={data?.numBedrooms} />
        <InfoItem label="Số phòng vệ sinh :" value={data?.numBathrooms} />
        <InfoItem label="Hướng ban công :" value={data?.direction} />
      </div>
    </section>
  );
};
const InfoItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-slate-400 font-medium uppercase">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
export default ApartmentInfo;

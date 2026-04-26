import type { Vehicle } from "../../../types/vehicle";
import {
  VEHICLE_STATUS_COLORS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
} from "../../../utils/constants";

type Props = {
  data: Vehicle;
  onDelete: (id: number) => void;
};

const vehicleIconMap = {
  MOTORBIKE: "motorcycle",
  CAR: "directions_car",
  BICYCLE: "pedal_bike",
  TRUCK: "local_shipping",
};

const VehicleItem = ({ data, onDelete }: Props) => {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200">
          {data.licensePlate}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-900">
          <span
            className="material-symbols-outlined text-lg"
            data-icon={vehicleIconMap[data.vehicleType]}
          >
            {vehicleIconMap[data.vehicleType]}
          </span>
          {VEHICLE_TYPE_LABELS[data.vehicleType]}
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-slate-700">
        {data?.brand ? `${data.brand} ` : "__"}{" "}
        {data?.model ? `${data.model}` : "__"}
      </td>
      <td className="px-6 py-5 text-sm text-slate-700">
        {data?.color ? `${data.color}` : "__"}
      </td>
      <td className="px-6 py-5 text-sm text-slate-600">
        {data?.registeredAt
          ? new Date(data.registeredAt).toLocaleDateString()
          : "__"}
      </td>
      <td className="px-6 py-5 text-sm text-slate-600">
        {data?.approvedAt
          ? new Date(data.approvedAt).toLocaleDateString()
          : "__"}
      </td>
      <td className="px-6 py-5 text-sm text-slate-600">
        {data?.expiredAt ? new Date(data.expiredAt).toLocaleDateString() : "__"}
      </td>

      <td>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            VEHICLE_STATUS_COLORS[data.status]
          }`}
        >
          {VEHICLE_STATUS_LABELS[data.status]}
        </span>
      </td>

      <td className="px-8 py-5 text-right">
        {data.status !== "ACTIVE" ? (
          <button className="text-slate-400 cursor-not-allowed px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">
              visibility
            </span>
            Không thể hủy
          </button>
        ) : (
          <button
            className="text-red-700 text-error hover:bg-error/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
            onClick={() => {
              if (confirm("Bạn có chắc muốn hủy đăng ký xe này?")) {
                onDelete(data.id);
              }
            }}
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            Hủy đăng ký
          </button>
        )}
      </td>
    </tr>
  );
};

export default VehicleItem;

import type { ServiceRegistration } from "../../../types/serviceRegistration";

type Props = {
  data: ServiceRegistration;
  onDelete: (id: number) => void;
};

const ServiceRegistrationItem = ({ data, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-outline flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-xl bg-primary-container flex items-center justify-center text-primary">
          <span
            className="material-symbols-outlined text-3xl"
            data-icon="fitness_center"
          >
            fitness_center
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {data?.serviceType?.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
              {data?.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <span
                className="material-symbols-outlined text-lg"
                data-icon="payments"
              >
                payments
              </span>
              <span className="font-medium">
                {data.serviceType?.monthlyFee?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
                /tháng
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <span
                className="material-symbols-outlined text-lg"
                data-icon="calendar_today"
              >
                calendar_today
              </span>
              {!data?.startDate ? (
                <span>
                  Ngày đăng ký:{" "}
                  {data?.registeredAt
                    ? new Date(data.registeredAt).toLocaleDateString()
                    : "__"}
                </span>
              ) : (
                <>
                  <span>
                    Bắt đầu:{" "}
                    {data?.startDate
                      ? new Date(data.startDate).toLocaleDateString()
                      : "__"}
                  </span>
                  <span>
                    Ngày kết thúc:{" "}
                    {data?.endDate
                      ? new Date(data.endDate).toLocaleDateString()
                      : "__"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {data?.status === "ACTIVE" && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onDelete(data.id)}
            className="px-6 h-12 flex items-center justify-center border-2 border-error text-error font-bold rounded-lg hover:bg-error-container transition-all active:scale-95"
          >
            Hủy dịch vụ
          </button>
          <button className="p-3 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
            <span className="material-symbols-outlined" data-icon="more_vert">
              more_vert
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceRegistrationItem;

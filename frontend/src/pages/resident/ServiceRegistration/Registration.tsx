import React, { useState } from "react";
import type {
  ServiceRegistrationCreateRequest,
  ServiceType,
} from "../../../types/serviceRegistration";
import { is } from "date-fns/locale";

type Props = {
  data: ServiceType;
  onclose: () => void;
  createService: (data: ServiceRegistrationCreateRequest) => void;
};
const Registration = ({ data, onclose, createService }: Props) => {
  const [note, setNotes] = useState("");

  const handleCreate = () => {
    const requestData: ServiceRegistrationCreateRequest = {
      serviceTypeId: data.id,
      notes: note,
    };
    createService(requestData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-surface-container w-full max-w-[560px] rounded-xl shadow-2xl overflow-hidden border border-outline bg-white">
        <div className="p-8 border-b border-outline flex items-center justify-between bg-white">
          <h2 className="text-[20px] font-bold text-on-surface tracking-tight">
            {data?.isRegistered
              ? "Thông tin dịch vụ đã đăng ký "
              : "Đăng ký dịch vụ"}
          </h2>
          <button
            className="text-slate-400 hover:text-slate-600 transition-colors"
            onClick={onclose}
          >
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[716px] overflow-y-auto">
          <div className="bg-primary-container/30 rounded-xl p-6 flex items-start gap-5 border border-primary/10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-1">
                Dịch vụ lựa chọn
              </p>
              <h4 className="text-[18px] font-bold text-on-surface">
                {data?.name}
              </h4>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary text-[18px]"
                  data-icon="payments"
                >
                  payments
                </span>
                <span className="text-primary font-bold text-[16px]">
                  {data?.monthlyFee?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
                <span className="text-slate-500 text-xs">/ mỗi tháng</span>
              </div>
            </div>
          </div>

          {!data?.myRegistration ? (
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-500">
                  notes
                </span>
                Ghi chú thêm
              </label>

              <textarea
                className="w-full p-4 bg-surface-variant border border-transparent rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-[14px] text-on-surface placeholder:text-slate-400 transition-all resize-none"
                id="notes"
                placeholder="Ghi chú thêm cho Ban quản lý..."
                rows={4}
                value={note}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-green-700 font-semibold text-[14px]">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                Đã đăng ký dịch vụ
              </div>

              <div className="text-[14px] text-slate-700 space-y-1">
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  {data.myRegistration?.status}
                </p>
                <p>
                  <span className="font-medium">Ngày bắt đầu:</span>{" "}
                  {data.myRegistration.startDate}
                </p>
                <p>
                  <span className="font-medium">Ngày kết thúc:</span>{" "}
                  {data.myRegistration?.endDate}
                </p>
              </div>
            </div>
          )}
        </div>
        {!data?.isRegistered && (
          <div className="p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-outline">
            <button
              onClick={onclose}
              className="w-full sm:w-auto px-8 py-3 text-[14px] font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 hover:border-slate-400 active:scale-95 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleCreate}
              className="w-full sm:w-auto px-8 py-3 text-[14px] font-bold bg-[#137fec] text-white rounded-lg shadow-lg hover:bg-[#1171d4] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Xác nhận đăng ký
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="arrow_forward"
              >
                arrow_forward
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;

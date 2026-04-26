import { useState } from "react";
import type { VehicleRegisterRequest } from "../../types/vehicle";
type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleRegisterRequest) => void;
};
function CreateVehicle({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<VehicleRegisterRequest>({
    vehicleType: "MOTORBIKE",
    licensePlate: "",
    brand: "",
    model: "",
    color: "",
  });

  if (!open) {
    return null;
  }
  function handleSubmit() {
    onSubmit(form);

    setForm({
      vehicleType: "MOTORBIKE",
      licensePlate: "",
      brand: "",
      model: "",
      color: "",
    });
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full rounded-xl shadow-2xl overflow-hidden border border-outline max-w-140">
        <div className="px-8 py-6 border-b border-outline flex justify-between items-center">
          <h2 className="text-lg font-bold">Đăng ký phương tiện mới</h2>

          <button
            className="p-2 hover:bg-slate-100 rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div>
          <div className="px-8 py-8 space-y-6">
            <div>
              <label className="text-sm font-semibold mb-3 block">
                Loại xe
              </label>

              <div className="grid grid-cols-4 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="MOTORBIKE"
                    checked={form.vehicleType === "MOTORBIKE"}
                    onChange={() =>
                      setForm({ ...form, vehicleType: "MOTORBIKE" })
                    }
                    className="peer sr-only"
                  />

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <span
                      className="material-symbols-outlined text-slate-400 peer-checked:text-primary mb-2"
                      data-icon="motorcycle"
                    >
                      motorcycle
                    </span>
                    <span className="text-xs font-medium">Xe máy</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="CAR"
                    checked={form.vehicleType === "CAR"}
                    onChange={() => setForm({ ...form, vehicleType: "CAR" })}
                    className="peer sr-only"
                  />

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <span
                      className="material-symbols-outlined text-slate-400 peer-checked:text-primary mb-2"
                      data-icon="directions_car"
                    >
                      directions_car
                    </span>
                    <span className="text-xs font-medium">Xe ô tô</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="BICYCLE"
                    checked={form.vehicleType === "BICYCLE"}
                    onChange={() =>
                      setForm({ ...form, vehicleType: "BICYCLE" })
                    }
                    className="peer sr-only"
                  />

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <span
                      className="material-symbols-outlined text-slate-400 peer-checked:text-primary mb-2"
                      data-icon="pedal_bike"
                    >
                      pedal_bike
                    </span>
                    <span className="text-xs font-medium">Xe đạp</span>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="TRUCK"
                    checked={form.vehicleType === "TRUCK"}
                    onChange={() => setForm({ ...form, vehicleType: "TRUCK" })}
                    className="peer sr-only"
                  />

                  <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-outline peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <span
                      className="material-symbols-outlined text-slate-400 peer-checked:text-primary mb-2"
                      data-icon="local_shipping"
                    >
                      local_shipping
                    </span>
                    <span className="text-xs font-medium">Xe tải</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-slate-900 flex items-center gap-1">
                Biển số <span className="text-error">*</span>
              </label>
              <input
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 text-sm font-medium placeholder:text-slate-400"
                placeholder="Vd: 30A-123.45"
                value={form.licensePlate}
                onChange={(e) =>
                  setForm({ ...form, licensePlate: e.target.value })
                }
                type="text"
              />
              <p className="text-[11px] italic text-slate-500">
                Nhập biển số chính xác để hệ thống tự động nhận diện tại cổng.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm">
                  <label className="font-semibold">Hãng xe</label>
                </div>

                <input
                  maxLength={50}
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-slate-100 mt-1 focus:ring-2 focus:ring-blue-200"
                  placeholder="Vd: Honda, Toyota..."
                />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <label className="font-semibold">Mẫu xe</label>
                </div>

                <input
                  maxLength={50}
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg bg-slate-100 mt-1 focus:ring-2 focus:ring-blue-200"
                  placeholder="Vd: Vision, Camry..."
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <label className="font-semibold">Màu sắc</label>
              </div>

              <input
                maxLength={50}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-12 px-4 rounded-lg bg-slate-100 mt-1 focus:ring-2 focus:ring-blue-200"
                placeholder="Vd: Đen nhám, Trắng"
              />
            </div>
          </div>
          <div className="px-8 py-6 bg-slate-50 border-t border-outline flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Huỷ
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 bg-primary text-white font-bold text-sm rounded-lg shadow-lg hover:brightness-110"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateVehicle;

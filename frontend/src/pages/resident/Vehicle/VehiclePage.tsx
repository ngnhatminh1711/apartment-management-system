import { useEffect, useState } from "react";
import VehicleList from "./VehicleList";
import type { Vehicle, VehicleRegisterRequest } from "../../../types/vehicle";
import CreateVehicle from "./CreateVehicle";
import { vehicleService } from "../../../services/resident/vehicleService";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/ToastContainer";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const onClose = () => {
    setOpen(!open);
  };
  const onSubmit = async (data: VehicleRegisterRequest) => {
    try {
      await vehicleService.create(data);
      toast.success("Đăng ký phương tiện thành công!");
      fetchVehicles();
    } catch (e: any) {
      const msg =
        Object.values(e?.response?.data?.data || {})[0] ||
        e?.response?.data?.message ||
        e?.response?.data?.code ||
        e?.message ||
        "Có lỗi xảy ra";

      toast.error(msg);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await vehicleService.delete(id);
      toast.success("Đã gởi hủy đăng ký phương tiện!");
      fetchVehicles();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.code ||
        e?.message ||
        "Có lỗi xảy ra";
      toast.error(msg);
    }
  };
  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data.data);
      toast.success("Tải danh sách phương tiện thành công!");
    } catch (error) {
      toast.error(
        "Lỗi không tải được danh sách phương tiện: " +
          (error as { message?: string }).message,
      );
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, []);
  return (
    <div>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-8 py-6 border-b border-outline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Danh sách phương tiện
            </h4>
            <p className="text-sm text-slate-500">
              Quản lý thông tin và trạng thái xe của bạn tại tòa nhà.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Đăng ký xe mới</span>
          </button>
        </div>
        <VehicleList data={vehicles} onDelete={handleDelete} />
      </div>
      {open && (
        <CreateVehicle open={open} onClose={onClose} onSubmit={onSubmit} />
      )}
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </div>
  );
};

export default VehiclePage;

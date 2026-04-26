import { useEffect, useState } from "react";
import ServiceTypeCard from "../../../components/resident/ServiceTypeCard";
import type {
  ServiceRegistration,
  ServiceType,
} from "../../../types/serviceRegistration";
import serviceRegistrationService from "../../../services/resident/serviceRegistrationSerivce";
import type { ServiceRegistrationCreateRequest } from "../../../types/serviceRegistration";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/ToastContainer";
import ServiceRegistrationList from "../../../components/resident/ServiceRegistrationList";

const ServiceRegistrationPage = () => {
  const [activeTab, setActiveTab] = useState<"SERVICE" | "MY_SERVICES">(
    "SERVICE",
  );
  const [dataService, setDataService] = useState<ServiceType[]>([]);
  const [dataMyService, setDataMyService] = useState<ServiceRegistration[]>([]);
  const toast = useToast();

  const handleCreate = async (
    newServiceData: ServiceRegistrationCreateRequest,
  ) => {
    try {
      await serviceRegistrationService.create(newServiceData);
      toast.success("Đăng ký dịch vụ thành công!");
      fetchData();
    } catch (error) {
      toast.error("Đăng ký dịch vụ thất bại!");
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await serviceRegistrationService.delete(id);
      toast.success("Hủy dịch vụ thành công!");
      fetchData();
    } catch (error) {
      toast.error("Hủy dịch vụ thất bại!");
    }
  };
  const fetchData = async () => {
    try {
      const res = await serviceRegistrationService.getAll();
      const resMyService = await serviceRegistrationService.getMyServices();
      setDataService(res);
      setDataMyService(resMyService);
      toast.success("Tải dịch vụ thành công!");
    } catch (error) {
      toast.error("Tải dịch vụ thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main>
      <header className="mb-10 ">
        <h1 className="text-[30px] font-bold text-slate-900 tracking-tight mb-2">
          Quản lý Dịch vụ
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Khám phá và đăng ký các tiện ích cao cấp dành riêng cho cư dân .
        </p>
      </header>

      <div className="flex items-center gap-2 p-1 bg-slate-50/50 w-fit rounded-xl border border-outline">
        <button
          className={`px-6 py-2 text-[13px] font-bold ${activeTab === "SERVICE" ? "text-primary bg-white rounded-lg active-tab-shadow" : "text-slate-500 hover:text-slate-800 transition-colors"}`}
          onClick={() => setActiveTab("SERVICE")}
        >
          Khám phá dịch vụ
        </button>
        <button
          className={`px-6 py-2 text-[13px] font-bold ${activeTab === "MY_SERVICES" ? "text-primary bg-white rounded-lg active-tab-shadow" : "text-slate-500 hover:text-slate-800 transition-colors"}`}
          onClick={() => setActiveTab("MY_SERVICES")}
        >
          Dịch vụ của tôi
        </button>
      </div>
      {activeTab === "SERVICE" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {dataService.map((service) => (
            <ServiceTypeCard
              key={service.id}
              data={service}
              createService={handleCreate}
            />
          ))}
        </div>
      )}
      {activeTab === "MY_SERVICES" && (
        <ServiceRegistrationList data={dataMyService} onDelete={handleDelete} />
      )}
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};
export default ServiceRegistrationPage;

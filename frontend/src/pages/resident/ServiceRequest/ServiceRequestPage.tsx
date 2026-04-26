import { useEffect, useState } from "react";
import type {
  ServiceRequest,
  ServiceRequestCreateRequest,
} from "../../../types/serviceRequest";
import ServiceRequestCard from "./ServiceRequestCard";
import CreateServiceRequest from "./CreateServiceRequest";
import { useToast } from "../../../hooks/useToast";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { serviceRequestService } from "../../../services/resident/ServiceRequestService";
import { usePagination } from "../../../hooks/usePagination";

const ServiceRequestPage = () => {
  const [data, setData] = useState<ServiceRequest[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const pag = usePagination();
  const onClose = () => {
    setOpenCreate(false);
  };
  const handleCreate = async (newcreate: ServiceRequestCreateRequest) => {
    try {
      await serviceRequestService.create(newcreate);
      toast.success("Tạo yêu cầu dịch vụ thành công!");
      await fetchData();
      return true;
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo yêu cầu dịch vụ!");
      return false;
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await serviceRequestService.getAll({
        page: pag.page,
        size: pag.size,
      });
      setData(res.content);
      toast.success("Tải yêu cầu dịch vụ thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải yêu cầu dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <header className="mb-10">
        <h1 className="text-[30px] font-bold text-slate-900 tracking-tight mb-2">
          Danh sách yêu cầu dịch vụ
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Quản lý và theo dõi các yêu cầu dịch vụ của bạn một cách dễ dàng và
          thuận tiện.
        </p>
      </header>
      <button
        className="mb-8 flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-all active:scale-95 text-sm"
        onClick={() => setOpenCreate(true)}
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Gửi yêu cầu mới
      </button>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-slate-400 text-[40px]">
            Đang tải
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <ServiceRequestCard key={item.id} data={item} />
          ))}
        </div>
      )}
      {openCreate && (
        <CreateServiceRequest onClose={onClose} handleCreate={handleCreate} />
      )}
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};

export default ServiceRequestPage;

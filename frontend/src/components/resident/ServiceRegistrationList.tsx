import ServiceRegistrationItem from "./ServiceRegistrationItem";
import { Link } from "react-router-dom";
import type { ServiceRegistration } from "../../types/serviceRegistration";
type Props = {
  data: ServiceRegistration[];
  onDelete: (id: number) => void;
};
const ServiceRegistrationList = ({ data, onDelete }: Props) => {
  return (
    <main>
      <div className="mt-10 grid gap-6">
        {data.map((item) => (
          <ServiceRegistrationItem
            key={item.id}
            data={item}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="mt-12 p-8 rounded-xl bg-primary-container/30 border border-primary/10 flex gap-6 items-start">
        <span
          className="material-symbols-outlined text-primary text-3xl"
          data-icon="info"
        >
          info
        </span>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-on-primary-container uppercase tracking-tight">
            Quy định dịch vụ
          </h4>
          <p className="text-sm text-on-primary-container/80 leading-relaxed">
            Quý cư dân có thể hủy các dịch vụ đang hoạt động trước 3 ngày kể từ
            kỳ thanh toán tiếp theo. Các yêu cầu đang chờ duyệt sẽ được Ban Quản
            Lý xử lý trong vòng 24h làm việc.
          </p>
          <p className="text-[11px] italic text-slate-500 font-medium">
            Lưu ý: Một số dịch vụ có thể áp dụng phí hoàn trả nếu hủy giữa kỳ.
          </p>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12 bg-[#e7f2ff] rounded-2xl p-8 flex flex-col justify-center border border-[#137fec]/10">
          <div className="text-primary mb-4">
            <span
              className="material-symbols-outlined text-4xl"
              data-icon="support_agent"
            >
              support_agent
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#004a99] mb-2">Hỗ trợ 24/7</h3>
          <p className="text-sm text-[#004a99]/70 mb-6">
            Bạn cần trợ giúp về dịch vụ? Đội ngũ quản lý luôn sẵn sàng.
          </p>
          <Link
            className="text-sm font-bold text-primary flex items-center gap-2 group"
            to="/resident/service-requests"
          >
            Gửi yêu cầu{" "}
            <span
              className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServiceRegistrationList;

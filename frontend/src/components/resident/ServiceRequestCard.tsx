import { Link } from "react-router-dom";
import type { ServiceRequest } from "../../types/serviceRequest";
import {
  REQUEST_STATUS_COLORS,
  REQUEST_STATUS_LABELS,
  REQUEST_TYPE_LABELS,
  REQUEST_PRIORITY_LABELS,
  REQUEST_PRIORITY_COLORS,
} from "../../utils/constants";
import { formatDate } from "../../utils/formatters";

type Props = {
  data: ServiceRequest;
};

const ServiceRequestCard = ({ data }: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-outline hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${data ? REQUEST_PRIORITY_COLORS[data.priority] : "bg-gray-100 text-gray-600"}`}
        >
          {data ? REQUEST_PRIORITY_LABELS[data.priority] : "—"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${data ? REQUEST_STATUS_COLORS[data.status] : "bg-gray-100 text-gray-600"}`}
        >
          {data ? REQUEST_STATUS_LABELS[data.status] : "—"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">
        {data?.title}
      </h3>
      <p className="text-sm text-slate-500 mb-6 flex-1">{data?.description}</p>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 italic ">
            {data ? REQUEST_TYPE_LABELS[data.requestType] : "—"}
          </span>
        </div>

        <span className="text-[11px] text-slate-400 italic">
          Ngày tạo: {formatDate(data?.createdAt)}
        </span>
        {data?.resolvedAt && (
          <span className="text-[11px] text-slate-400 italic">
            Ngày xử lý: {formatDate(data?.resolvedAt)}
          </span>
        )}
        <Link
          to={`/resident/service-requests/${data?.id}`}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
        >
          Xem chi tiết
          <span className="material-symbols-outlined text-[14px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceRequestCard;

import { useState } from "react";
import AttachmentUrl from "./AttachmentUrl";
import type { ServiceRequestCreateRequest } from "../../types/serviceRequest";
import type { RequestType, RequestPriority } from "../../types/common";

type Props = {
  onClose: () => void;
  handleCreate: (newcreate: ServiceRequestCreateRequest) => Promise<boolean>;
};
const CreateServiceRequest = ({ onClose, handleCreate }: Props) => {
  const [formData, setFormData] = useState<ServiceRequestCreateRequest>({
    requestType: "MAINTENANCE",
    title: "",
    description: "",
    priority: "MEDIUM",
    attachmentUrls: [],
  });
  const handleSubmit = async () => {
    let ok = await handleCreate(formData);
    if (!ok) return;
    setFormData({
      requestType: "MAINTENANCE",
      title: "",
      description: "",
      priority: "MEDIUM",
      attachmentUrls: [],
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
          <h3 className="text-xl font-bold text-slate-900">Gửi yêu cầu mới</h3>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="p-8 space-y-6 overflow-y-auto max-h-[819px]">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Loại yêu cầu
              </label>

              <select
                className="w-full h-12 pl-4 pr-10 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300focus:outline-none focus:ring-2 focus:ring-primary/30  focus:border-primary appearance-none cursor-pointer"
                value={formData.requestType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requestType: e.target.value as RequestType,
                  })
                }
              >
                <option value="MAINTENANCE">Bảo trì</option>
                <option value="COMPLAINT">Khiếu nại</option>
                <option value="INQUIRY">Hỏi đáp</option>
                <option value="AMENITY">Tiện nghi</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Mức độ ưu tiên
              </label>

              <select
                className="w-full h-12 pl-4 pr-10 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300focus:outline-none focus:ring-2 focus:ring-primary/30  focus:border-primary appearance-none cursor-pointer"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as RequestPriority,
                  })
                }
              >
                <option value="URGENT">Khẩn cấp</option>
                <option value="HIGH">Cao</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="LOW">Thấp </option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Tiêu đề yêu cầu
              </label>
              <span className="text-[10px] text-slate-400 italic">
                Tối đa 200 ký tự
              </span>
            </div>

            <input
              maxLength={200}
              placeholder="VD: Hỏng bóng đèn hành lang tầng 12"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              className="w-full h-12 pl-4 pr-10 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300focus:outline-none focus:ring-2 focus:ring-primary/30  focus:border-primary appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Mô tả chi tiết
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300focus:outline-none focus:ring-2 focus:ring-primary/30  focus:border-primary appearance-none cursor-pointer"
              placeholder="Mô tả cụ thể vấn đề của bạn để ban quản lý có thể hỗ trợ nhanh nhất..."
              rows={4}
            />
          </div>

          <AttachmentUrl
            attachmentUrls={formData.attachmentUrls ?? []}
            onChange={(urls) =>
              setFormData({
                ...formData,
                attachmentUrls: urls,
              })
            }
          />
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSubmit}
              type="button"
              className="flex-[2] h-12 rounded-lg bg-primary text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95"
            >
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServiceRequest;

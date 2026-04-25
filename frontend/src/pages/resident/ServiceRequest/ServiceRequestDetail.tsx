import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { serviceRequestService } from "../../../services/resident/ServiceRequestService";
import type { ServiceRequest } from "../../../types/serviceRequest";
import { useToast } from "../../../hooks/useToast";

const ServiceRequestDetail = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ServiceRequest>();
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [isRated, setIsRated] = useState(false);

  const handleSubmitRating = async () => {
    try {
      const res = await serviceRequestService.rating(
        Number(id),
        rating,
        comment,
      );
      toast.success("Gửi đánh giá thành công!");
      setIsRated(true);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá!");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await serviceRequestService.getById(Number(id));
      setData(res);
      setRating(res?.rating || 0);
      setComment(res?.comment || "");
      setIsRated(!!res?.rating);
      toast.success("Tải chi tiết yêu cầu dịch vụ thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải chi tiết yêu cầu dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <main>
      <div
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Quay lại</span>
      </div>
      {loading ? (
        <div className="text-center py-20">Đang tải...</div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-[30px] font-bold">{data?.title}</h1>

              <div className="flex gap-3 mt-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {data?.status}
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  {data?.priority}
                </span>
              </div>
            </div>

            <div className="text-right text-sm">
              <p>Mã yêu cầu: {data?.id}</p>
              <p>
                {data?.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              <section className="p-6 border rounded-xl">
                <h3 className="font-bold mb-3">Nội dung chi tiết</h3>

                <p className="text-sm text-slate-600 mb-4">
                  {data?.description}
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {data?.attachmentUrls?.map((url, index) => (
                    <img key={index} src={url} className="rounded-lg" />
                  ))}
                </div>
              </section>
              {data?.resolvedAt && (
                <section className="p-6 border rounded-xl">
                  <h3 className="font-bold mb-3">Kết quả xử lý</h3>

                  <p className="text-sm text-slate-600 mb-4">
                    {data?.resolutionNotes ||
                      "Đã xử lý nhưng không có ghi chú nào được cung cấp."}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    Ngày tiếp nhận:{" "}
                    {data?.assignedAt
                      ? new Date(data.assignedAt).toLocaleDateString()
                      : "—"}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    Ngày xử lý:{" "}
                    {data?.resolvedAt
                      ? new Date(data.resolvedAt).toLocaleDateString()
                      : "—"}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    Người xử lý: {data?.assignedTo?.fullName}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">
                    Số điện thoại: {data?.assignedTo?.phone}
                  </p>
                </section>
              )}
              {data?.resolvedAt && (
                <section className="p-6 border rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="material-symbols-outlined text-primary text-[28px] filled-icon"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      grade
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Đánh giá chất lượng xử lý
                    </h3>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <select
                      value={rating}
                      disabled={isRated}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border p-3 rounded-lg"
                    >
                      <option value={1}>1 sao</option>
                      <option value={2}>2 sao</option>
                      <option value={3}>3 sao</option>
                      <option value={4}>4 sao</option>
                      <option value={5}>5 sao</option>
                    </select>
                  </div>

                  <textarea
                    className="w-full bg-surface-bright border border-outline rounded-lg p-4 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Nhập cảm nhận của bạn về thái độ và chất lượng sửa chữa..."
                    rows={5}
                    value={comment}
                    hidden={isRated}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleSubmitRating}
                    hidden={isRated}
                  >
                    Gửi
                  </button>
                </section>
              )}
            </div>

            <div className="space-y-8">
              <section className="p-6 rounded-xl bg-black text-white">
                <h4 className="font-bold mb-3">Hỗ trợ</h4>

                <p className="text-sm text-gray-400 mb-4">
                  Liên hệ nếu cần hỗ trợ thêm
                </p>

                <p className="text-sm">📞 1900 XX XX XX</p>
                <p className="text-sm">✉️ support@apartmentmgmt.com</p>
              </section>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};

export default ServiceRequestDetail;

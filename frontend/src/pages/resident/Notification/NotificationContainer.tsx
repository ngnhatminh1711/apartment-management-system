import { useEffect, useState } from "react";
import type { Notification } from "../../../types/notification";
import NotificationList from "./NotificationList";
import { Pagination } from "../../../components/common/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { notificationService } from "../../../services/resident/notificationService";
import { useToast } from "../../../hooks/useToast";

const NotificationContainer = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const pag = usePagination();
  const [activeTab, setActiveTab] = useState<"PERSONAL" | "ANNOUNCEMENT">(
    "PERSONAL",
  );
  const toast = useToast();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll({
        page: pag.page,
        size: pag.size,
      });

      setData(res.content);
      setTotal(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pag.page, pag.size]);

  const handleItemClick = async (item: Notification) => {
    if (!item.isRead) await notificationService.markAsRead(item.id);
    setData((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );
  };
  const handleAllRead = async () => {
    await notificationService.markAllAsRead();
    setData((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight text-slate-900 leading-none mb-2">
            Thông báo
          </h1>
          <p className="text-slate-500 text-sm">
            Cập nhật tin tức và hóa đơn mới nhất từ tòa nhà của bạn.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline text-primary text-[13px] font-semibold rounded-lg hover:bg-primary-container transition-all active:scale-95"
          onClick={handleAllRead}
        >
          <span className="material-symbols-outlined text-[18px]">
            done_all
          </span>
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      {/* <!-- Notification Layout --> */}
      <div className="grid grid-cols-1 gap-6">
        {/* <!-- Filters & Tabs --> */}
        <div className="flex items-center gap-2 p-1 bg-surface-variant/50 w-fit rounded-xl border border-outline">
          <button
            className={`px-6 py-2 text-[13px] font-bold ${activeTab === "PERSONAL" ? "text-primary bg-white rounded-lg active-tab-shadow" : "text-slate-500 hover:text-slate-800 transition-colors"}`}
            onClick={() => setActiveTab("PERSONAL")}
          >
            Tất cả
          </button>
          <button
            className={`px-6 py-2 text-[13px] font-semibold ${activeTab === "ANNOUNCEMENT" ? "text-primary bg-white rounded-lg active-tab-shadow" : "text-slate-500 hover:text-slate-800 transition-colors"}`}
            onClick={() => setActiveTab("ANNOUNCEMENT")}
          >
            Ban Quản Lý
          </button>
        </div>
        {/* <!-- Notification List --> */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <NotificationList data={data} onItemClick={handleItemClick} />
          )}
        </div>
        {/* <!-- Pagination --> */}
        <Pagination
          currentPage={pag.page}
          totalPages={totalPages}
          totalElements={total}
          pageSize={pag.size}
          onPageChange={pag.setPage}
        />
      </div>
    </>
  );
};

export default NotificationContainer;

import { useEffect, useState } from "react";

import { Pagination } from "../../../components/common/Pagination";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import BillService from "../../../services/resident/BillService";
import type { Bill, BillSummary } from "../../../types/bill";
import BillList from "../../../components/resident/BillList";
import { formatCurrency } from "../../../utils/formatters";
const BillPage = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState<BillSummary>({
    overdueCount: 0,
    totalOutstanding: 0,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pag = usePagination();
  const toast = useToast();

  const fetchBills = async () => {
    try {
      setLoading(true);

      const response = await BillService.getBills({
        page: pag.page,
        size: pag.size,
      });

      setBills(response.content ?? []);
      setTotal(response.totalElements ?? 0);
      setTotalPages(response.totalPages ?? 0);
      setSummary((prev) => ({
        ...prev,
        ...(response.summary ?? {}),
      }));
      toast.success("Tải danh sách hóa đơn thành công!");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.code ||
        e?.message ||
        "Không thể tải danh sách hóa đơn";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [pag.page, pag.size]);

  return (
    <div className="p-6 space-y-6">
      {summary?.overdueCount && summary.overdueCount > 0 && (
        <div className="bg-red-100 border border-red-300 p-4 rounded-xl flex justify-between items-center">
          <span className="font-semibold text-red-700">
            Bạn có {summary.overdueCount} hóa đơn quá hạn chưa được thanh toán!
          </span>
          <div className="text-red-600 font-bold text-sm">Thanh toán ngay</div>
        </div>
      )}

      <div>
        <div className="col-span-2 bg-white p-6 rounded-xl border">
          <p className="text-sm text-gray-500">
            Tổng số tiền còn phải thanh toán{" "}
          </p>
          <h2 className="text-3xl font-bold text-red-600">
            {formatCurrency(summary.totalOutstanding ?? 0)}
          </h2>
          <p className="text-slate-600 text-sm mt-4 flex items-center gap-1 italic">
            <span className="material-symbols-outlined text-sm">info</span>
            Bao gồm phí quản lý, điện, nước và các dịch vụ khác.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : (
        <BillList bills={bills} />
      )}

      <Pagination
        currentPage={pag.page}
        totalPages={totalPages}
        totalElements={total}
        pageSize={pag.size}
        onPageChange={pag.setPage}
        name="Hóa đơn"
      />

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </div>
  );
};

export default BillPage;

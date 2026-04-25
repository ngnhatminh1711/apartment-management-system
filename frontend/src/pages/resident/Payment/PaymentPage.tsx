import { useEffect, useState } from "react";
import { Pagination } from "../../../components/common/Pagination";

import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import PaymentService from "../../../services/resident/PaymentService";
import type { Payment } from "../../../types/payment";
import PaymentItem from "./PaymentItem";

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pag = usePagination();
  const toast = useToast();

  const fetchPayments = async () => {
    try {
      const res = await PaymentService.getPayments({
        page: pag.page,
        size: pag.size,
      });
      setPayments(res.content ?? []);
      setTotal(res.totalElements ?? 0);
      setTotalPages(res.totalPages ?? 0);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.code ||
        e?.message ||
        "Không thể tải lịch sử giao dịch";
      toast.error(msg);
    } finally {
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [pag.page, pag.size]);
  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-6 text-center text-slate-500">
        Chưa có giao dịch nào
      </div>
    );
  }
  return (
    <main>
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-background mb-2">
              Lịch sử giao dịch
            </h2>
            <p className="text-slate-500 max-w-lg">
              Xem và quản lý tất cả các khoản thanh toán từ cư dân...
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-outline overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-outline">
                  <th className="px-8 py-4 text-[11px]">ID Giao dịch</th>
                  <th className="px-8 py-4 text-[11px]">Ngày thanh toán</th>
                  <th className="px-8 py-4 text-[11px]">
                    Căn hộ/hóa đơn tháng
                  </th>
                  <th className="px-8 py-4 text-[11px]">Phương thức</th>
                  <th className="px-8 py-4 text-[11px]">Số tiền</th>
                  <th className="px-8 py-4 text-[11px]">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {payments.map((item) => (
                  <PaymentItem key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={pag.page}
          totalPages={totalPages}
          totalElements={total}
          pageSize={pag.size}
          onPageChange={pag.setPage}
          name="Giao dịch"
        />
        {/* <StatsGrid /> */}
      </div>
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </main>
  );
};

export default PaymentPage;

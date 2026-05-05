import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../components/common/Badge";
import { EmptyState } from "../../../components/common/EmptyState";
import { Modal } from "../../../components/common/Modal";
import { Pagination } from "../../../components/common/Pagination";
import { SearchInput } from "../../../components/common/SearchInput";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import { managerVehicleService } from "../../../services/manager/vehicleService";
import type { VehicleStatus, VehicleType } from "../../../types/common";
import type { ManagerVehicle } from "../../../types/manager";
import { VEHICLE_STATUS_COLORS, VEHICLE_STATUS_LABELS, VEHICLE_TYPE_LABELS } from "../../../utils/constants";
import { formatDateTime } from "../../../utils/formatters";

export function ManagerVehicleListPage() {
    const [vehicles, setVehicles] = useState<ManagerVehicle[]>([]);
    const [pending, setPending] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<VehicleStatus | "">("");
    const [filterType, setFilterType] = useState<VehicleType | "">("");

    // Modal states
    const [approveId, setApproveId] = useState<number | null>(null);
    const [rejectId, setRejectId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const toast = useToast();
    const pag = usePagination("registeredAt,desc");

    const {
        register: regApprove,
        handleSubmit: hsApprove,
        reset: resetApprove,
    } = useForm<{ notes: string; expiredAt: string }>();
    const {
        register: regReject,
        handleSubmit: hsReject,
        reset: resetReject,
        formState: { errors: errReject },
    } = useForm<{ rejectionReason: string }>();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await managerVehicleService.getAll({
                page: pag.page,
                size: pag.size,
                search: pag.search || undefined,
                status: filterStatus || undefined,
                vehicleType: filterType || undefined,
            });
            setVehicles(data.vehicles.content);
            setPending(data.pendingCount);
            setTotal(data.vehicles.totalElements);
            setPages(data.vehicles.totalPages);
        } catch {
            toast.error("Không thể tải danh sách xe");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pag.page, pag.size, pag.search, filterStatus, filterType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onApprove = async (data: { notes: string; expiredAt: string }) => {
        if (!approveId) return;
        setSubmitting(true);
        try {
            await managerVehicleService.approve(approveId, data.notes, data.expiredAt || undefined);
            toast.success("Đã duyệt đăng ký xe!");
            setApproveId(null);
            resetApprove();
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const onReject = async (data: { rejectionReason: string }) => {
        if (!rejectId) return;
        setSubmitting(true);
        try {
            await managerVehicleService.reject(rejectId, data.rejectionReason);
            toast.success("Đã từ chối đăng ký xe");
            setRejectId(null);
            resetReject();
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>Quản lý Xe cư dân</h1>
                {pending > 0 && (
                    <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-medium">
                        ⏳ {pending} xe chờ duyệt
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="card py-3 flex gap-3 flex-wrap">
                <div className="flex-1 min-w-50">
                    <SearchInput placeholder="Tìm theo biển số, tên chủ xe..." onSearch={pag.setSearch} />
                </div>
                <select
                    className="input-field w-44"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value as VehicleStatus | "");
                        pag.setPage(0);
                    }}
                >
                    <option value="">Tất cả trạng thái</option>
                    {(Object.keys(VEHICLE_STATUS_LABELS) as VehicleStatus[]).map((k) => (
                        <option key={k} value={k}>
                            {VEHICLE_STATUS_LABELS[k]}
                        </option>
                    ))}
                </select>
                <select
                    className="input-field w-36"
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value as VehicleType | "");
                        pag.setPage(0);
                    }}
                >
                    <option value="">Tất cả loại xe</option>
                    {(Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((k) => (
                        <option key={k} value={k}>
                            {VEHICLE_TYPE_LABELS[k]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : vehicles.length === 0 ? (
                    <EmptyState icon="🚗" title="Không có xe nào" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-200">
                                <thead>
                                    <tr>
                                        {["Chủ xe", "Căn hộ", "Loại", "Biển số", "Xe", "Đăng ký lúc", "Trạng thái", ""].map(
                                            (h) => (
                                                <th key={h} className="table-header text-left">
                                                    {h}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((v) => (
                                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="table-cell">
                                                <p className="font-medium text-sm">{v.owner.fullName}</p>
                                                <p className="text-xs text-gray-400">{v.owner.phone ?? "—"}</p>
                                            </td>
                                            <td className="table-cell font-medium text-primary">{v.apartmentNumber}</td>
                                            <td className="table-cell text-sm text-gray-500">
                                                {VEHICLE_TYPE_LABELS[v.vehicleType]}
                                            </td>
                                            <td className="table-cell font-mono font-medium">{v.licensePlate}</td>
                                            <td className="table-cell text-sm text-gray-500">
                                                {[v.brand, v.model, v.color].filter(Boolean).join(" · ") || "—"}
                                            </td>
                                            <td className="table-cell text-xs text-gray-400">{formatDateTime(v.registeredAt)}</td>
                                            <td className="table-cell">
                                                <Badge
                                                    label={VEHICLE_STATUS_LABELS[v.status]}
                                                    className={VEHICLE_STATUS_COLORS[v.status]}
                                                />
                                            </td>
                                            <td className="table-cell">
                                                {v.status === "PENDING_APPROVAL" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setApproveId(v.id)}
                                                            className="group text-xs text-success font-medium flex items-center"
                                                        >
                                                            <span className="material-symbols-outlined">check</span>
                                                            <span className="group-hover:underline">Duyệt</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectId(v.id)}
                                                            className="group text-xs text-danger flex items-center"
                                                        >
                                                            <span className="material-symbols-outlined">cancel</span>
                                                            <span className="group-hover:underline">Từ chối</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={pag.page}
                            totalPages={totalPages}
                            totalElements={total}
                            name="Phương tiện"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            {/* Approve Modal */}
            <Modal
                isOpen={!!approveId}
                onClose={() => {
                    setApproveId(null);
                    resetApprove();
                }}
                title="✅ Duyệt đăng ký xe"
                size="sm"
            >
                <form onSubmit={hsApprove(onApprove)} className="space-y-4">
                    <div>
                        <label className="label">Ngày hết hạn thẻ xe</label>
                        <input type="date" className="input-field" {...regApprove("expiredAt")} />
                        <p className="text-xs text-gray-400 mt-1">Để trống nếu không có ngày hết hạn</p>
                    </div>
                    <div>
                        <label className="label">Ghi chú</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            placeholder="Đã kiểm tra xe hợp lệ..."
                            {...regApprove("notes")}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setApproveId(null);
                                resetApprove();
                            }}
                            className="btn-secondary flex-1"
                        >
                            Huỷ
                        </button>
                        <button type="submit" disabled={submitting} className="btn-primary flex-1">
                            {submitting ? "Đang duyệt..." : "✅ Xác nhận duyệt"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Reject Modal */}
            <Modal
                isOpen={!!rejectId}
                onClose={() => {
                    setRejectId(null);
                    resetReject();
                }}
                title="❌ Từ chối đăng ký xe"
                size="sm"
            >
                <form onSubmit={hsReject(onReject)} className="space-y-4">
                    <div>
                        <label className="label">
                            Lý do từ chối <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            className="input-field"
                            rows={3}
                            placeholder="Biển số không khớp, giấy tờ không hợp lệ..."
                            {...regReject("rejectionReason", { required: "Lý do là bắt buộc" })}
                        />
                        {errReject.rejectionReason && (
                            <p className="text-red-500 text-xs mt-1">{errReject.rejectionReason.message}</p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setRejectId(null);
                                resetReject();
                            }}
                            className="btn-secondary flex-1"
                        >
                            Huỷ
                        </button>
                        <button type="submit" disabled={submitting} className="btn-danger flex-1">
                            {submitting ? "Đang xử lý..." : "❌ Từ chối"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

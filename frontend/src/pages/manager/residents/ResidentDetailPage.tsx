import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { managerResidentService } from "../../../services/manager/residentService";
import type { ResidentDetail } from "../../../types/manager";
import { REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS } from "../../../utils/constants";
import { formatCurrency, formatDate, formatPhone } from "../../../utils/formatters";

export function ResidentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const [resident, setResident] = useState<ResidentDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        managerResidentService
            .getById(Number(id))
            .then(setResident)
            .catch(() => toast.error("Không tải được thông tin"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spinner fullPage />;
    if (!resident) return <p className="text-red-500">Không tìm thấy cư dân.</p>;
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-gray-700 text-2xl leading-none material-symbols-outlined"
                >
                    chevron_left
                </button>
                <div className="flex-1">
                    <h1>{resident.fullName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{resident.email}</p>
                </div>
                <Link to={`/manager/apartments/${resident.apartment.id}`} className="btn-secondary text-sm flex items-center">
                    <span className="material-symbols-outlined pr-1">house</span>Xem căn hộ
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Profile */}
                <div className="card space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-manager/10 flex items-center justify-center text-manager font-bold text-2xl">
                            {resident.fullName[0]}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{resident.fullName}</p>
                            <p className="text-sm text-gray-500">{resident.email}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                        {[
                            { label: "SĐT", val: formatPhone(resident.phone) },
                            { label: "CCCD", val: resident.idCard ?? "—" },
                            { label: "Ngày sinh", val: formatDate(resident.dateOfBirth) },
                            { label: "Căn hộ", val: `${resident.apartment.apartmentNumber} – Tầng ${resident.apartment.floor}` },
                            { label: "Vai trò", val: resident.apartment.isPrimary ? "Chủ hộ" : "Thành viên" },
                            { label: "Ngày vào", val: formatDate(resident.apartment.moveInDate) },
                        ].map(({ label, val }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-gray-400">{label}</span>
                                <span className="font-medium">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bill summary */}
                <div className="card space-y-3">
                    <h3>Tổng quan hóa đơn</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Tổng HĐ", val: resident.billSummary.totalBills, color: "text-gray-700" },
                            { label: "Đã TT", val: resident.billSummary.paidBills, color: "text-success" },
                            { label: "Chờ TT", val: resident.billSummary.pendingBills, color: "text-warning" },
                            {
                                label: "Công nợ",
                                val: formatCurrency(resident.billSummary.outstandingAmount),
                                color: "text-danger",
                            },
                        ].map(({ label, val, color }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-xs text-gray-400 mb-1">{label}</p>
                                <p className={`font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Vehicles */}
                    {resident.vehicles.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <span className="material-symbols-outlined pr-1">garage</span>Xe đã đăng ký (
                                {resident.vehicles.length})
                            </p>
                            {resident.vehicles.map((v) => (
                                <div key={v.id} className="flex justify-between text-sm py-1">
                                    <span className="font-medium">{v.licensePlate}</span>
                                    <span className="text-gray-400">{v.vehicleType}</span>
                                    <span className={`text-xs ${v.status === "ACTIVE" ? "text-success" : "text-gray-400"}`}>
                                        {v.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Service regs */}
                    {resident.serviceRegistrations.length > 0 && (
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">🛎️ Dịch vụ đang sử dụng</p>
                            {resident.serviceRegistrations.map((s) => (
                                <div key={s.id} className="flex justify-between text-sm py-1">
                                    <span>{s.serviceName}</span>
                                    <span className="text-success text-xs">{s.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent requests */}
            {resident.recentRequests.length > 0 && (
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined pr-1">build</span>Yêu cầu gần đây
                    </h3>
                    <div className="space-y-2">
                        {resident.recentRequests.map((r) => (
                            <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{r.title}</p>
                                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                                </div>
                                <Badge
                                    label={REQUEST_STATUS_LABELS[r.status as keyof typeof REQUEST_STATUS_LABELS] ?? r.status}
                                    className={
                                        REQUEST_STATUS_COLORS[r.status as keyof typeof REQUEST_STATUS_COLORS] ??
                                        "bg-gray-100 text-gray-600"
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

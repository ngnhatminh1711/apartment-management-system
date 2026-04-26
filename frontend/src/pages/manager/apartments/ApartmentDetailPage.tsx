import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { Modal } from "../../../components/common/Modal";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { managerApartmentService } from "../../../services/manager/apartmentService";
import { managerResidentService } from "../../../services/manager/residentService";
import type { AssignResidentRequest, ManagerApartmentDetail, MoveOutRequest } from "../../../types/manager";
import { APARTMENT_STATUS_COLORS, APARTMENT_STATUS_LABELS, VEHICLE_STATUS_LABELS } from "../../../utils/constants";
import { formatBillingMonth, formatCurrency, formatDate } from "../../../utils/formatters";

export function ApartmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [apt, setApt] = useState<ManagerApartmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [assignOpen, setAssignOpen] = useState(false);
    const [moveOutId, setMoveOutId] = useState<number | null>(null);
    const [moveOutName, setMoveOutName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [userSearch, setUserSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [candidates, setCandidates] = useState<{ id: number; fullName: string; email: string }[]>([]);

    const {
        register: regAssign,
        handleSubmit: hsAssign,
        reset: resetAssign,
        formState: { errors: errAssign },
    } = useForm<AssignResidentRequest>();
    const { register: regMoveOut, handleSubmit: hsMoveOut, reset: resetMoveOut } = useForm<MoveOutRequest>();

    const loadApt = () => {
        if (!id) {
            return;
        }

        managerApartmentService
            .getById(Number(id))
            .then(setApt)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadApt();
    }, [id]);

    const handleUserSearch = async () => {
        if (!userSearch.trim()) {
            return;
        }
        setSearchLoading(true);
        try {
            const res = await managerResidentService.getAll({ search: userSearch, size: 5 });

            setCandidates(res.content.map((r) => ({ id: r.id, fullName: r.fullName, email: r.email })));
        } catch {
            toast.error("Không thể tìm kiếm cư dân");
        } finally {
            setSearchLoading(false);
        }
    };

    const onAssign = async (data: AssignResidentRequest) => {
        setSubmitting(true);
        try {
            await managerApartmentService.assignResident(Number(id), data);
            toast.success("Gán cư dân vào căn hộ thành công!");
            setAssignOpen(false);
            resetAssign();
            setLoading(true);
            loadApt();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const onMoveOut = async (data: MoveOutRequest) => {
        if (!moveOutId) {
            return;
        }

        setSubmitting(true);

        try {
            await managerApartmentService.moveOut(Number(id), moveOutId, data);
            toast.success("Ghi nhận chuyển đi thành công!");
            setMoveOutId(null);
            resetMoveOut();
            setLoading(true);
            loadApt();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }
    if (!apt) return <p className="text-red-500">Không tìm thấy căn hộ.</p>;

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
                    <div className="flex items-center gap-3">
                        <h1>Căn hộ {apt.apartmentNumber}</h1>
                        <Badge label={APARTMENT_STATUS_LABELS[apt.status]} className={APARTMENT_STATUS_COLORS[apt.status]} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Tầng {apt.floor} - {apt.areaM2} m² - {apt.numBedrooms}PN / {apt.numBathrooms}WC
                    </p>
                </div>

                {(apt.status === "AVAILABLE" || apt.status === "OCCUPIED") && (
                    <button onClick={() => setAssignOpen(true)} className="btn-primary text-sm flex items-center">
                        <span className="material-symbols-outlined pr-0.5">add</span> Gán cư dân
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Current residents */}
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined pr-1">group</span> Cư dân đang sinh sống
                    </h3>
                    {apt.currentResidents.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">Căn hộ đang trống</p>
                    ) : (
                        <div className="space-y-3">
                            {apt.currentResidents.map((r) => (
                                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                    <div className="h-10 w-10 rounded-full bg-manager/10 flex items-center justify-center text-manager font-bold shrink-0">
                                        {r.fullName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm text-gray-800 truncate">{r.fullName}</p>
                                            {r.isPrimary && (
                                                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                    Chủ hộ
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{r.phone ?? "-"}</p>
                                        <p className="text-xs text-gray-400">Vào: {formatDate(r.moveInDate)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setMoveOutId(r.id);
                                            setMoveOutName(r.fullName);
                                        }}
                                        className="text-xs text-red-500 hover:underline whitespace-nowrap"
                                    >
                                        Chuyển đi
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="card space-y-3">
                    <h3 className="flex items-center">
                        <span className="material-symbols-outlined pr-1">info</span>
                        Thông tin
                    </h3>
                    <div className="space-y-2 text-sm">
                        {[
                            { label: "Hướng", val: apt.direction || "-" },
                            { label: "Ghi chú", val: apt.notes || "-" },
                        ].map(({ label, val }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium text-right">{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* Vehicles */}
                    {apt.vehicles.length > 0 && (
                        <>
                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <span className="material-symbols-outlined pr-1">garage</span>
                                    Xe đang đăng ký
                                </p>
                                <div className="space-y-1.5">
                                    {apt.vehicles.map((v) => (
                                        <div key={v.id} className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{v.licensePlate}</span>
                                            <span className="text-xs text-gray-500">{v.brand ?? v.vehicleType}</span>
                                            <Badge
                                                label={VEHICLE_STATUS_LABELS[v.status]}
                                                className={`text-xs ${v.status === "ACTIVE" ? "bg-green-100 text-gray-700" : "bg-gray-100 text-gray-500"}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Bills */}
            {apt.recentBills.length > 0 && (
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined pr-1">receipt_long</span>Hóa đơn gần đây
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                {["Tháng", "Tổng tiền", "Trạng thái", "Hạn TT"].map((h) => (
                                    <th key={h} className="table-header text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {apt.recentBills.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50">
                                    <td className="table-cell font-medium">{formatBillingMonth(b.billingMonth + "-01")}</td>
                                    <td className="table-cell">{formatCurrency(b.totalAmount)}</td>
                                    <td className="table-cell">
                                        <Badge label={b.status} className="bg-gray-100 text-gray-600 text-xs" />
                                    </td>
                                    <td className="table-cell">{formatDate(b.dueDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Residence history */}
            {apt.residenceHistory.length > 0 && (
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined pr-1">timeline</span>
                        Lịch sử cư trú
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                {["Họ tên", "Ngày vào", "Ngày ra"].map((h) => (
                                    <th key={h} className="table-header text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {apt.residenceHistory.map((h) => (
                                <tr key={h.userId} className="hover:bg-gray-50">
                                    <td className="table-cell">{h.fullName}</td>
                                    <td className="table-cell">{formatDate(h.moveInDate)}</td>
                                    <td className="table-cell">{formatDate(h.moveOutDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Assign Resident Modal */}
            <Modal
                isOpen={assignOpen}
                onClose={() => {
                    setAssignOpen(false);
                    resetAssign();
                }}
                title="Gán cư dân vào căn hộ"
                size="md"
            >
                <form onSubmit={hsAssign(onAssign)} className="space-y-4">
                    <div>
                        <label className="label">
                            ID cư dân <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-400 mb-1">Nhập ID của cư dân có ROLE_RESIDENT và chưa có căn hộ</p>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="25"
                            {...regAssign("userId", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 1, message: "ID không hợp lệ" },
                            })}
                        />
                        {errAssign.userId && <p className="text-red-500 text-xs mt-1">{errAssign.userId.message}</p>}
                    </div>

                    <div>
                        <label className="label">
                            Ngày vào <span className="text-red-500">*</span>
                        </label>
                        <input type="date" className="input-field" {...regAssign("moveInDate", { required: "Bắt buộc" })} />
                        {errAssign.moveInDate && <p className="text-red-500 text-xs mt-1">{errAssign.moveInDate.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded" {...regAssign("isPrimary")} />
                            <div>
                                <p className="text-sm font-medium">Chủ hộ (isPrimary)</p>
                                <p className="text-xs text-gray-400">Sẽ tự động bỏ chủ hộ cũ nếu có</p>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="label">Ghi chú</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            placeholder="Hợp đồng thuê, ghi chú thêm..."
                            {...regAssign("notes")}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setAssignOpen(false);
                                resetAssign();
                            }}
                            className="btn-secondary flex-1"
                        >
                            Hủy
                        </button>
                        <button type="submit" disabled={submitting} className="btn-primary flex-1">
                            {submitting ? "Đang xử lý..." : "Gán vào căn hộ"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Move Out Modal */}
            <Modal
                isOpen={!!moveOutId}
                onClose={() => {
                    setMoveOutId(null);
                    resetMoveOut();
                }}
                title="Ghi nhận cư dân chuyển đi"
                size="sm"
            >
                <form onSubmit={hsMoveOut(onMoveOut)} className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Xác nhận <strong>{moveOutName}</strong> chuyển ra khỏi căn hộ.
                    </p>
                    <div className="bg-yellow-50 text-yellow-700 text-xs px-3 py-2 rounded-lg flex items-center">
                        <span className="material-symbols-outlined pr-2">warning</span>Tất cả xe ACTIVE của cư dân này tại căn hộ
                        sẽ bị đặt về INACTIVE.
                    </div>
                    <div>
                        <label className="label">
                            Ngày chuyển đi <span className="text-red-500">*</span>
                        </label>
                        <input type="date" className="input-field" {...regMoveOut("moveOutDate", { required: "Bắt buộc" })} />
                    </div>
                    <div>
                        <label className="label">Ghi chú</label>
                        <input className="input-field" placeholder="Hết hợp đồng, tự nguyện chuyển..." {...regMoveOut("notes")} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMoveOutId(null);
                                resetMoveOut();
                            }}
                            className="btn-secondary flex-1"
                        >
                            Huỷ
                        </button>
                        <button type="submit" disabled={submitting} className="btn-danger flex-1">
                            {submitting ? "Đang xử lý..." : "Xác nhận chuyển đi"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

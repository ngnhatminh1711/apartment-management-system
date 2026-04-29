import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { Modal } from "../../../components/common/Modal";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminApartmentService } from "../../../services/admin/apartmentService";
import type { Apartment } from "../../../types/admin";
import type { ApartmentStatus } from "../../../types/common";
import { APARTMENT_STATUS_COLORS, APARTMENT_STATUS_LABELS } from "../../../utils/constants";
import { formatDate } from "../../../utils/formatters";

const STATUS_OPTIONS: { value: ApartmentStatus; label: string }[] = [
    { value: "AVAILABLE", label: "Trống – sẵn sàng cho cư dân mới" },
    { value: "MAINTENANCE", label: "Bảo trì – đang sửa chữa" },
    { value: "RESERVED", label: "Đã đặt cọc – chờ cư dân vào" },
];

export function ApartmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [apt, setApt] = useState<Apartment | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusOpen, setStatusOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<ApartmentStatus>("AVAILABLE");
    const [notes, setNotes] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        adminApartmentService
            .getById(Number(id))
            .then(setApt)
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = async () => {
        setUpdating(true);
        try {
            const updated = await adminApartmentService.updateStatus(Number(id), newStatus, notes);
            setApt(updated);
            toast.success("Cập nhật trạng thái thành công!");
            setStatusOpen(false);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Spinner fullPage />;
    if (!apt) return <p className="text-red-500">Không tìm thấy căn hộ.</p>;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                    ←
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1>Căn hộ {apt.apartmentNumber}</h1>
                        <Badge label={APARTMENT_STATUS_LABELS[apt.status]} className={APARTMENT_STATUS_COLORS[apt.status]} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {apt.buildingName} – Tầng {apt.floor}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setNewStatus(apt.status);
                            setStatusOpen(true);
                        }}
                        className="btn-secondary text-sm"
                    >
                        🔄 Đổi trạng thái
                    </button>
                    <Link to="edit" className="btn-primary text-sm">
                        ✏️ Chỉnh sửa
                    </Link>
                </div>
            </div>

            {/* Apartment info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="card space-y-3">
                    <h3>📋 Thông tin căn hộ</h3>
                    <div className="space-y-2 text-sm">
                        {[
                            { label: "Diện tích", val: `${apt.areaM2} m²` },
                            { label: "Phòng ngủ", val: `${apt.numBedrooms} phòng` },
                            { label: "Phòng tắm", val: `${apt.numBathrooms} phòng` },
                            { label: "Hướng", val: apt.direction || "—" },
                            { label: "Ghi chú", val: apt.notes || "—" },
                        ].map(({ label, val }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current residents */}
                <div className="card">
                    <h3 className="mb-3">Cư dân hiện tại</h3>
                    {apt.currentResidents && apt.currentResidents.length > 0 ? (
                        <div className="space-y-3">
                            {apt.currentResidents.map((r) => (
                                <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                        {r.fullName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm text-gray-800 truncate">{r.fullName}</p>
                                            {r.isPrimary && (
                                                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                                    Chủ hộ
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{r.phone ?? r.email ?? "—"}</p>
                                        <p className="text-xs text-gray-400">Vào: {formatDate(r.moveInDate)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-4">Căn hộ đang trống</p>
                    )}
                </div>
            </div>

            {/* Residence history */}
            {apt.residenceHistory && apt.residenceHistory.length > 0 && (
                <div className="card">
                    <h3 className="mb-4">Lịch sử cư trú</h3>
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

            {/* Change Status Modal */}
            <Modal isOpen={statusOpen} onClose={() => setStatusOpen(false)} title="Thay đổi trạng thái căn hộ" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Trạng thái hiện tại:{" "}
                        <Badge label={APARTMENT_STATUS_LABELS[apt.status]} className={APARTMENT_STATUS_COLORS[apt.status]} />
                    </p>
                    <div>
                        <label className="label">Trạng thái mới</label>
                        <select
                            className="input-field"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as ApartmentStatus)}
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Ghi chú</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Lý do thay đổi trạng thái..."
                        />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setStatusOpen(false)} className="btn-secondary flex-1">
                            Huỷ
                        </button>
                        <button onClick={handleStatusChange} disabled={updating} className="btn-primary flex-1">
                            {updating ? "Đang cập nhật..." : "Xác nhận"}
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

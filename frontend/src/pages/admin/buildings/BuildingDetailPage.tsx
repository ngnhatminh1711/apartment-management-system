import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { Modal } from "../../../components/common/Modal";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminUserService } from "../../../services/admin/userService";
import type { Building, User } from "../../../types/admin";
import { formatPercent } from "../../../utils/formatters";

export function BuildingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [building, setBuilding] = useState<Building | null>(null);
    const [loading, setLoading] = useState(true);
    const [assignOpen, setAssignOpen] = useState(false);
    const [managers, setManagers] = useState<User[]>([]);
    const [selectedMgr, setSelectedMgr] = useState<number | "">("");
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        adminBuildingService
            .getById(Number(id))
            .then(setBuilding)
            .finally(() => setLoading(false));
        adminUserService.getAll({ role: "ROLE_MANAGER", isActive: true, size: 100 }).then((d) => setManagers(d.content));
    }, [id]);

    const handleAssign = async () => {
        if (!selectedMgr) return;
        setAssigning(true);
        try {
            const updated = await adminBuildingService.assignManager(Number(id), selectedMgr);
            setBuilding(updated);
            toast.success("Gán Manager thành công!");
            setAssignOpen(false);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <Spinner fullPage />;
    if (!building) return <p className="text-red-500">Không tìm thấy tòa nhà.</p>;

    const occ =
        building.stats.totalApartments > 0 ? (building.stats.occupiedApartments / building.stats.totalApartments) * 100 : 0;

    return (
        <div className="space-y-5">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                    ←
                </button>
                <div className="flex-1">
                    <h1>{building.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{building.address}</p>
                </div>
                <Link to="edit" className="btn-secondary">
                    ✏️ Chỉnh sửa
                </Link>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Tổng căn hộ", val: building.stats.totalApartments, color: "text-gray-800" },
                    { label: "Đang có cư dân", val: building.stats.occupiedApartments, color: "text-primary" },
                    { label: "Còn trống", val: building.stats.availableApartments, color: "text-success" },
                    { label: "Đang bảo trì", val: building.stats.maintenanceApartments, color: "text-warning" },
                ].map(({ label, val, color }) => (
                    <div key={label} className="card text-center p-4">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className={`text-3xl font-bold ${color}`}>{val}</p>
                    </div>
                ))}
            </div>

            {/* Occupancy bar */}
            <div className="card">
                <div className="flex items-center justify-between mb-3">
                    <h3>📊 Tỷ lệ lấp đầy</h3>
                    <span className="text-2xl font-bold text-primary">{formatPercent(occ)}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${occ}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>{building.stats.occupiedApartments} đang ở</span>
                    <span>{building.stats.availableApartments} trống</span>
                </div>
            </div>

            {/* Info + Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Building info */}
                <div className="card space-y-3">
                    <h3>ℹ️ Thông tin tòa nhà</h3>
                    <div className="space-y-2 text-sm">
                        {[
                            { label: "Số tầng", val: `${building.numFloors} tầng` },
                            { label: "Tổng căn hộ", val: `${building.numApartments} căn` },
                            {
                                label: "Trạng thái",
                                val: (
                                    <Badge
                                        label={building.isActive ? "Đang hoạt động" : "Đã vô hiệu"}
                                        className={
                                            building.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                        }
                                    />
                                ),
                            },
                            { label: "Mô tả", val: building.description || "—" },
                        ].map(({ label, val }) => (
                            <div key={label} className="flex justify-between gap-4">
                                <span className="text-gray-500">{label}</span>
                                <span className="font-medium text-right">{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manager */}
                <div className="card space-y-3">
                    <div className="flex items-center justify-between">
                        <h3>👤 Ban Quản Lý phụ trách</h3>
                        <button onClick={() => setAssignOpen(true)} className="text-sm text-primary hover:underline">
                            {building.manager ? "Thay đổi" : "Gán Manager"}
                        </button>
                    </div>
                    {building.manager ? (
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-manager/10 flex items-center justify-center text-manager font-bold">
                                    {building.manager.fullName[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{building.manager.fullName}</p>
                                    <p className="text-gray-500 text-xs">{building.manager.email}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-400 text-sm">Chưa có Manager phụ trách</p>
                            <button onClick={() => setAssignOpen(true)} className="btn-primary mt-3 text-sm">
                                + Gán Manager
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign Manager Modal */}
            <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Gán Manager phụ trách" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Chọn Manager để phụ trách tòa nhà <strong>{building.name}</strong>
                    </p>
                    <select
                        className="input-field"
                        value={selectedMgr}
                        onChange={(e) => setSelectedMgr(e.target.value ? Number(e.target.value) : "")}
                    >
                        <option value="">-- Chọn Manager --</option>
                        {managers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.fullName} ({m.email})
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-3">
                        <button onClick={() => setAssignOpen(false)} className="btn-secondary flex-1">
                            Huỷ
                        </button>
                        <button onClick={handleAssign} disabled={!selectedMgr || assigning} className="btn-primary flex-1">
                            {assigning ? "Đang gán..." : "Xác nhận"}
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

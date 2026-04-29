import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { EmptyState } from "../../../components/common/EmptyState";
import { Pagination } from "../../../components/common/Pagination";
import { SearchInput } from "../../../components/common/SearchInput";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import { adminApartmentService } from "../../../services/admin/apartmentService";
import { adminBuildingService } from "../../../services/admin/buildingService";
import type { Apartment, Building } from "../../../types/admin";
import type { ApartmentStatus } from "../../../types/common";
import { APARTMENT_STATUS_COLORS, APARTMENT_STATUS_LABELS } from "../../../utils/constants";

export function ApartmentListPage() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [filterBuilding, setFilterBuilding] = useState<number | undefined>();
    const [filterStatus, setFilterStatus] = useState<ApartmentStatus | "">("");
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const toast = useToast();
    const pag = usePagination("floor,asc");

    useEffect(() => {
        adminBuildingService.getAll({ size: 100 }).then((d) => setBuildings(d.content));
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminApartmentService.getAll({
                page: pag.page,
                size: pag.size,
                sort: pag.sort,
                search: pag.search || undefined,
                buildingId: filterBuilding,
                status: filterStatus || undefined,
            });
            setApartments(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách căn hộ");
        } finally {
            setLoading(false);
        }
    }, [pag.page, pag.size, pag.sort, pag.search, filterBuilding, filterStatus]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await adminApartmentService.delete(deleteId);
            toast.success("Đã xóa căn hộ");
            setDeleteId(null);
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>Quản lý Căn hộ</h1>
                <Link to="new" className="btn-primary">
                    + Thêm căn hộ
                </Link>
            </div>

            {/* Filters */}
            <div className="card py-3 flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <SearchInput placeholder="Tìm theo số căn hộ..." onSearch={pag.setSearch} />
                </div>
                <select
                    className="input-field w-52"
                    value={filterBuilding ?? ""}
                    onChange={(e) => {
                        setFilterBuilding(e.target.value ? Number(e.target.value) : undefined);
                        pag.setPage(0);
                    }}
                >
                    <option value="">Tất cả tòa nhà</option>
                    {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <select
                    className="input-field w-44"
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value as ApartmentStatus | "");
                        pag.setPage(0);
                    }}
                >
                    <option value="">Tất cả trạng thái</option>
                    {(Object.keys(APARTMENT_STATUS_LABELS) as ApartmentStatus[]).map((k) => (
                        <option key={k} value={k}>
                            {APARTMENT_STATUS_LABELS[k]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : apartments.length === 0 ? (
                    <EmptyState icon="" title="Không có căn hộ nào" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead>
                                    <tr>
                                        {["Căn hộ", "Tòa nhà", "Tầng", "Diện tích", "Phòng", "Chủ hộ", "Trạng thái", ""].map(
                                            (h) => (
                                                <th key={h} className="table-header text-left">
                                                    {h}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {apartments.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="table-cell">
                                                <Link to={`${a.id}`} className="font-medium text-primary hover:underline">
                                                    {a.apartmentNumber}
                                                </Link>
                                            </td>
                                            <td className="table-cell text-gray-500 text-sm">{a.buildingName}</td>
                                            <td className="table-cell">{a.floor}</td>
                                            <td className="table-cell">{a.areaM2} m²</td>
                                            <td className="table-cell text-sm">
                                                {a.numBedrooms}PN / {a.numBathrooms}WC
                                            </td>
                                            <td className="table-cell">
                                                {a.currentResidents?.[0] ? (
                                                    <span className="text-sm">{a.currentResidents?.[0].fullName}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">—</span>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                <Badge
                                                    label={APARTMENT_STATUS_LABELS[a.status]}
                                                    className={APARTMENT_STATUS_COLORS[a.status]}
                                                />
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex gap-3">
                                                    <Link to={`${a.id}/edit`} className="text-xs text-primary hover:underline">
                                                        Sửa
                                                    </Link>
                                                    {a.status === "AVAILABLE" && (
                                                        <button
                                                            onClick={() => setDeleteId(a.id)}
                                                            className="text-xs text-red-500 hover:underline"
                                                        >
                                                            Xóa
                                                        </button>
                                                    )}
                                                </div>
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
                            name="Căn hộ"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Xóa căn hộ"
                message="Bạn có chắc muốn xóa căn hộ này? Chỉ có thể xóa căn hộ đang trống."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                confirmLabel="Xóa"
                danger
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

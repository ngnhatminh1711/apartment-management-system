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
import { adminBuildingService } from "../../../services/admin/buildingService";
import type { Building } from "../../../types/admin";

export function BuildingListPage() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const toast = useToast();
    const pag = usePagination();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminBuildingService.getAll({
                page: pag.page,
                size: pag.size,
                sort: pag.sort,
                search: pag.search || undefined,
                isActive: filterActive,
            });
            setBuildings(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách tòa nhà");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pag.page, pag.size, pag.sort, pag.search, filterActive]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeactivate = async () => {
        if (!deleteId) return;
        try {
            await adminBuildingService.deactivate(deleteId);
            toast.success("Đã vô hiệu hóa tòa nhà");
            setDeleteId(null);
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
            setDeleteId(null);
        }
    };
    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1>🏢 Quản lý Tòa nhà</h1>
                <Link to="new" className="btn-primary">
                    + Thêm tòa nhà
                </Link>
            </div>

            {/* Toolbar */}
            <div className="card py-3 flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <SearchInput placeholder="Tìm theo tên, địa chỉ..." onSearch={pag.setSearch} />
                </div>
                <select
                    className="input-field w-44"
                    value={filterActive === undefined ? "" : String(filterActive)}
                    onChange={(e) => setFilterActive(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã vô hiệu</option>
                </select>
            </div>

            {/* Table */}
            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : buildings.length === 0 ? (
                    <EmptyState
                        icon=""
                        title="Chưa có tòa nhà nào"
                        action={
                            <Link to="new" className="btn-primary">
                                + Thêm tòa nhà
                            </Link>
                        }
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr>
                                        {["Tên tòa nhà", "Địa chỉ", "Tầng", "Căn hộ", "Lấp đầy", "Ban QL", "Trạng thái", ""].map(
                                            (h) => (
                                                <th key={h} className="table-header text-left">
                                                    {h}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {buildings.map((b) => {
                                        const occupiedPct =
                                            b.stats.totalApartments > 0
                                                ? Math.round((b.stats.occupiedApartments / b.stats.totalApartments) * 100)
                                                : 0;
                                        return (
                                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="table-cell">
                                                    <Link to={`${b.id}`} className="font-medium text-primary hover:underline">
                                                        {b.name}
                                                    </Link>
                                                </td>
                                                <td className="table-cell text-gray-500 max-w-[200px] truncate">{b.address}</td>
                                                <td className="table-cell text-center">{b.numFloors}</td>
                                                <td className="table-cell text-center">
                                                    <span className="font-medium">{b.stats.occupiedApartments}</span>
                                                    <span className="text-gray-400"> / {b.stats.totalApartments}</span>
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary rounded-full"
                                                                style={{ width: `${occupiedPct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-500 w-8">{occupiedPct}%</span>
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    {b.manager ? (
                                                        <span className="text-sm">{b.manager.fullName}</span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Chưa gán</span>
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    <Badge
                                                        label={b.isActive ? "Hoạt động" : "Vô hiệu"}
                                                        className={
                                                            b.isActive
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-500"
                                                        }
                                                    />
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex gap-3">
                                                        <Link
                                                            to={`${b.id}/edit`}
                                                            className="text-xs text-primary hover:underline"
                                                        >
                                                            Sửa
                                                        </Link>
                                                        {b.isActive && (
                                                            <button
                                                                onClick={() => setDeleteId(b.id)}
                                                                className="text-xs text-red-500 hover:underline"
                                                            >
                                                                Vô hiệu
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={pag.page}
                            totalPages={totalPages}
                            totalElements={total}
                            name="Tòa nhà"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Vô hiệu hóa tòa nhà"
                message="Bạn có chắc muốn vô hiệu hóa tòa nhà này? Thao tác có thể khôi phục bằng cách cập nhật lại."
                onConfirm={handleDeactivate}
                onCancel={() => setDeleteId(null)}
                confirmLabel="Vô hiệu hóa"
                danger
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

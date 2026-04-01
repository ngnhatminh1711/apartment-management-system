import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { buildingService } from "../../../services/admin/buildingService";
import { Pagination } from "../../../components/common/Pagination";
import { SearchInput } from "../../../components/common/SearchInput";
import { EmptyState } from "../../../components/common/EmptyState";
import { Spinner } from "../../../components/common/Spinner";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { useToast } from "../../../hooks/useToast";
import { usePagination } from "../../../hooks/usePagination";
import { ToastContainer } from "../../../components/common/ToastContainer";
import type { Building } from "../../../types/building";

export function BuildingListPage() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const toast = useToast();
    const pag = usePagination();

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await buildingService.getAll({
                page: pag.page,
                size: pag.size,
                search: pag.search,
                sort: pag.sort,
            });
            setBuildings(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách tòa nhà");
        } finally {
            setLoading(false);
        }
    }, [pag.page, pag.size, pag.search, pag.sort]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetch();
    }, [fetch]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await buildingService.deactivate(deleteId);
            toast.success("Đã vô hiệu hóa tòa nhà");
            setDeleteId(null);
            fetch();
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Có lỗi xảy ra";
            toast.error(msg);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-1">Tòa nhà</h1>
                    <p className="text-sm font-medium">
                        Quản lý danh sách các tòa nhà cao cấp trên toàn TP. Hồ Chí Minh.
                    </p>
                </div>

                <Link to="new" className="btn-primary">
                    + Thêm tòa nhà
                </Link>
            </div>

            {/* Toolbar */}
            <div className="card py-3">
                <SearchInput placeholder="Tìm theo tên, địa chỉ..." onSearch={pag.setSearch} />
            </div>

            {/* Table */}
            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : buildings.length === 0 ? (
                    <EmptyState icon="🏢" title="Chưa có tòa nhà nào" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {[
                                        "Tên tòa nhà",
                                        "Địa chỉ",
                                        "Số tầng",
                                        "Căn hộ",
                                        "Ban quản lý",
                                        "Trạng thái",
                                        "",
                                    ].map((h) => (
                                        <th key={h} className="table-header text-left">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {buildings.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="table-cell font-medium text-gray-900">
                                            {b.name}
                                        </td>
                                        <td className="table-cell text-black/50 max-w-50 truncate">
                                            {b.address}
                                        </td>
                                        <td className="table-cell">{b.numFloors}</td>
                                        <td className="table-cell">
                                            {b.stats?.totalApartments ?? b.numApartments}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    alt="Manager"
                                                    className="w-7 h-7 rounded-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6HirtKU7xaZGomed1uFArIoMfuwxb86pPX6g486HRtksDf4A9rRgiE3hXAkLSDQatypigpaK6FLUNwrrh9enjW1lQZKpsEw9BMQE7O7yLsLiyLUbzSwINFPpPrfeGnnvj9MyiHYjh0kjQVUwudIissAQzsEm3YUp95L_Ivw4swLwaUUW5eZlAWiUynnWcRYj3cPVC7IYHf7GOOO6LkYya7lr0bDk_aNcZg-qgOIN6p_8-m82GWxdqJ0H4k-RFkJgYs73k-TbH3BY"
                                                ></img>
                                                <div className="text-sm font-medium">
                                                    {b.manager?.fullName ?? "—"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span
                                                className={`inline-flex items-center rounded-full text-sm px-2.5 py-0.5 font-medium
                                        ${b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                            >
                                                {b.isActive ? "Hoạt động" : "Vô hiệu"}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`${b.id}/edit`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(b.id)}
                                                    className="text-xs text-red-500 hover:underline"
                                                    disabled={!b.isActive}
                                                >
                                                    Vô hiệu
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={pag.page}
                            totalPages={totalPages}
                            totalElements={total}
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Vô hiệu hóa tòa nhà"
                message="Bạn có chắc muốn vô hiệu hóa tòa nhà này? Thao tác này có thể khôi phục sau."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                confirmLabel="Vô hiệu hóa"
                danger
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

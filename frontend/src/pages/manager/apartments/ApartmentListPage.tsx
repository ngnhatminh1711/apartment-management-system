import { useCallback, useEffect, useState } from "react";
import type { Apartment } from "../../../types/apartment";
import { usePagination } from "../../../hooks/usePagination";
import { apartmentService } from "../../../services/manager/apartmentService";
import { useToast } from "../../../hooks/useToast";
import { Link } from "react-router-dom";
import { SearchInput } from "../../../components/common/SearchInput";
import { Spinner } from "../../../components/common/Spinner";
import { EmptyState } from "../../../components/common/EmptyState";
import { Pagination } from "../../../components/common/Pagination";
import { Badge } from "../../../components/common/Badge";
import { APARTMENT_STATUS_COLORS, APARTMENT_STATUS_LABELS } from "../../../utils/constants";

export function ApartmentListPage() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const pag = usePagination();

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apartmentService.getAll({
                page: pag.page,
                size: pag.size,
                search: pag.search,
                sort: pag.sort,
            });
            setApartments(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách căn hộ");
        } finally {
            setLoading(false);
        }
    }, [pag.page, pag.size, pag.search, pag.sort]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetch();
    }, [fetch]);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-1">Căn hộ</h1>
                    <p className="text-sm font-medium">
                        Quản lý căn hộ, tình trạng sử dụng và thông tin chi tiết trong toàn bộ hệ
                        thống tại TP.HCM.
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
                ) : apartments.length === 0 ? (
                    <EmptyState icon="🏢" title="Chưa có căn hộ nào" />
                ) : (
                    <>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {[
                                        "Số căn hộ",
                                        "Tầng",
                                        "Diện tích (m²)",
                                        "Chi tiết",
                                        "Trạng thái",
                                        "Chủ hộ",
                                        "",
                                    ].map((h) => (
                                        <th key={h} className="table-header text-left">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {apartments.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="table-cell font-bold text-slate-900 py-5">
                                            {p.apartmentNumber}
                                        </td>
                                        <td className="table-cell text-slate-600">{p.floor}</td>
                                        <td className="table-cell text-slate-600">{p.areaM2}</td>
                                        <td className="table-cell">
                                            <div className="flex gap-3 text-slate-400 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined">
                                                        bed
                                                    </span>
                                                    {p.numBedrooms}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined">
                                                        bathtub
                                                    </span>
                                                    {p.numBathrooms}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined">
                                                        explore
                                                    </span>
                                                    {p.direction}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <Badge
                                                label={APARTMENT_STATUS_LABELS[p.status]}
                                                className={APARTMENT_STATUS_COLORS[p.status]}
                                            />
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                {p.currentResidents?.[0] ? (
                                                    <img
                                                        alt="Manager"
                                                        className="w-7 h-7 rounded-full object-cover"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6HirtKU7xaZGomed1uFArIoMfuwxb86pPX6g486HRtksDf4A9rRgiE3hXAkLSDQatypigpaK6FLUNwrrh9enjW1lQZKpsEw9BMQE7O7yLsLiyLUbzSwINFPpPrfeGnnvj9MyiHYjh0kjQVUwudIissAQzsEm3YUp95L_Ivw4swLwaUUW5eZlAWiUynnWcRYj3cPVC7IYHf7GOOO6LkYya7lr0bDk_aNcZg-qgOIN6p_8-m82GWxdqJ0H4k-RFkJgYs73k-TbH3BY"
                                                    ></img>
                                                ) : (
                                                    ""
                                                )}

                                                <div className="text-sm font-medium text-slate-700">
                                                    {p.currentResidents?.[0]?.fullName ?? ""}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="table-cell">
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`${p.id}/edit`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Sửa
                                                </Link>
                                                <button className="text-xs text-red-500 hover:underline">
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
                            name="Căn hộ"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

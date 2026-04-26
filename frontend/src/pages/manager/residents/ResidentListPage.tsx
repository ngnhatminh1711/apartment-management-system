import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../../../components/common/EmptyState";
import { Pagination } from "../../../components/common/Pagination";
import { SearchInput } from "../../../components/common/SearchInput";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import { managerResidentService } from "../../../services/manager/residentService";
import type { Resident } from "../../../types/manager";
import { formatCurrency, formatDate, formatPhone } from "../../../utils/formatters";

export function ResidentListPage() {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const toast = useToast();
    const pag = usePagination();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await managerResidentService.getAll({
                page: pag.page,
                size: pag.size,
                sort: pag.sort,
                search: pag.search || undefined,
            });
            setResidents(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách căn hộ");
        } finally {
            setLoading(false);
        }
    }, [pag.page, pag.size, pag.sort, pag.search]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-5">
            <h1>Danh sách Cư dân</h1>

            <div className="card py-3">
                <SearchInput placeholder="Tìm theo tên, email, SĐT, CCCD..." onSearch={pag.setSearch} />
            </div>

            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : residents.length === 0 ? (
                    <EmptyState icon="👥" title="Không tìm thấy cư dân" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-175">
                                <thead>
                                    <tr>
                                        {["Cư dân", "Căn hộ", "SĐT", "Vai trò", "Công nợ", "Vào ngày", ""].map((h) => (
                                            <th key={h} className="table-header text-left">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {residents.map((r) => (
                                        <tr
                                            key={r.id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/manager/residents/${r.id}`)}
                                        >
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-manager/10 flex items-center justify-center text-manager font-bold text-sm flex-shrink-0">
                                                        {r.fullName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-gray-800">{r.fullName}</p>
                                                        <p className="text-xs text-gray-400">{r.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-cell">
                                                <p className="font-medium text-sm">{r.apartment.apartmentNumber}</p>
                                                <p className="text-xs text-gray-400">Tầng {r.apartment.floor}</p>
                                            </td>
                                            <td className="table-cell text-sm text-gray-600">{formatPhone(r.phone)}</td>
                                            <td className="table-cell">
                                                {r.isPrimary ? (
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                        Chủ hộ
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Thành viên</span>
                                                )}
                                            </td>
                                            <td className="table-cell">
                                                {r.outstandingDebt > 0 ? (
                                                    <span className="text-danger font-medium text-sm">
                                                        {formatCurrency(r.outstandingDebt)}
                                                    </span>
                                                ) : (
                                                    <span className="text-success text-sm">✓ Không nợ</span>
                                                )}
                                            </td>
                                            <td className="table-cell text-sm text-gray-500">{formatDate(r.moveInDate)}</td>
                                            <td className="table-cell">
                                                <span className="text-gray-400 text-sm material-symbols-outlined">
                                                    chevron_right
                                                </span>
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
                            name="Cư dân"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

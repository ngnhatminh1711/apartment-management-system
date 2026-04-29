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
import { adminUserService } from "../../../services/admin/userService";
import type { User } from "../../../types/admin";
import type { UserRole } from "../../../types/common";
import { ROLE_LABELS, ROLE_OPTIONS } from "../../../utils/constants";
import { formatDate } from "../../../utils/formatters";

export function UserListPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState<UserRole | "">("");
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [toggleId, setToggleId] = useState<number | null>(null);

    const toast = useToast();
    const pag = usePagination();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminUserService.getAll({
                page: pag.page,
                size: pag.size,
                sort: pag.sort,
                search: pag.search || undefined,
                role: filterRole || undefined,
                isActive: filterActive,
            });
            setUsers(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pag.page, pag.size, pag.sort, pag.search, filterRole, filterActive]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = async () => {
        if (!toggleId) return;
        try {
            const result = await adminUserService.toggleActive(toggleId);
            toast.success(result.isActive ? "Đã kích hoạt tài khoản" : "Đã vô hiệu hóa tài khoản");
            setToggleId(null);
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
            setToggleId(null);
        }
    };

    const handleResetPwd = async (userId: number, name: string) => {
        try {
            await adminUserService.resetPassword(userId);
            toast.success(`Đã reset mật khẩu cho ${name}. Email thông báo đã được gửi.`);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        }
    };

    const toggledUser = users.find((u) => u.id === toggleId);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>👥 Quản lý Người dùng</h1>
                <Link to="new" className="btn-primary">
                    + Tạo tài khoản
                </Link>
            </div>

            {/* Filters */}
            <div className="card py-3 flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <SearchInput placeholder="Tìm theo tên, email, SĐT, CCCD..." onSearch={pag.setSearch} />
                </div>
                <select
                    className="input-field w-44"
                    value={filterRole}
                    onChange={(e) => {
                        setFilterRole(e.target.value as UserRole | "");
                        pag.setPage(0);
                    }}
                >
                    {ROLE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <select
                    className="input-field w-44"
                    value={filterActive === undefined ? "" : String(filterActive)}
                    onChange={(e) => {
                        setFilterActive(e.target.value === "" ? undefined : e.target.value === "true");
                        pag.setPage(0);
                    }}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã vô hiệu</option>
                </select>
            </div>

            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : users.length === 0 ? (
                    <EmptyState icon="" title="Không tìm thấy người dùng" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-225">
                                <thead>
                                    <tr>
                                        {["Người dùng", "Email", "SĐT", "Vai trò", "Căn hộ", "Ngày tạo", "Trạng thái", ""].map(
                                            (h) => (
                                                <th key={h} className="table-header text-left">
                                                    {h}
                                                </th>
                                            ),
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                                                        {u.fullName[0]}
                                                    </div>
                                                    <Link
                                                        to={`${u.id}`}
                                                        className="font-medium text-gray-800 hover:text-primary hover:underline"
                                                    >
                                                        {u.fullName}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="table-cell text-gray-500 text-sm">{u.email}</td>
                                            <td className="table-cell text-gray-500 text-sm">{u.phone ?? "—"}</td>
                                            <td className="table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {u.roles.map((r) => (
                                                        <Badge
                                                            key={r}
                                                            label={ROLE_LABELS[r]}
                                                            className={
                                                                r === "ROLE_ADMIN"
                                                                    ? "bg-purple-100 text-purple-700"
                                                                    : r === "ROLE_MANAGER"
                                                                      ? "bg-green-100 text-green-700"
                                                                      : "bg-orange-100 text-orange-700"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="table-cell text-sm">
                                                {u.currentApartment ? (
                                                    <span>
                                                        {u.currentApartment.apartmentNumber} – {u.currentApartment.buildingName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="table-cell text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                                            <td className="table-cell">
                                                <Badge
                                                    label={u.isActive ? "Hoạt động" : "Vô hiệu"}
                                                    className={
                                                        u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                                    }
                                                />
                                            </td>
                                            <td className="table-cell">
                                                <div className="flex gap-2 flex-nowrap">
                                                    <Link to={`${u.id}/edit`} className="text-xs text-primary hover:underline">
                                                        Sửa
                                                    </Link>
                                                    <button
                                                        onClick={() => setToggleId(u.id)}
                                                        className={`text-xs hover:underline ${u.isActive ? "text-red-500" : "text-green-600"}`}
                                                    >
                                                        {u.isActive ? "Vô hiệu" : "Kích hoạt"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPwd(u.id, u.fullName)}
                                                        className="text-xs text-orange-500 hover:underline"
                                                    >
                                                        Reset MK
                                                    </button>
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
                            name="Người dùng"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!toggleId}
                title={toggledUser?.isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
                message={
                    toggledUser?.isActive
                        ? `Tài khoản "${toggledUser?.fullName}" sẽ bị vô hiệu hóa và không thể đăng nhập.`
                        : `Tài khoản "${toggledUser?.fullName}" sẽ được kích hoạt lại.`
                }
                onConfirm={handleToggle}
                onCancel={() => setToggleId(null)}
                confirmLabel={toggledUser?.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                danger={toggledUser?.isActive}
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

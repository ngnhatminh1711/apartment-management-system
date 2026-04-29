import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminUserService } from "../../../services/admin/userService";
import type { User } from "../../../types/admin";
import { ROLE_LABELS } from "../../../utils/constants";
import { formatDate } from "../../../utils/formatters";

export function UserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmReset, setConfirmReset] = useState(false);
    const [confirmToggle, setConfirmToggle] = useState(false);

    useEffect(() => {
        adminUserService
            .getById(Number(id))
            .then(setUser)
            .finally(() => setLoading(false));
    }, [id]);

    const handleReset = async () => {
        try {
            await adminUserService.resetPassword(Number(id));
            toast.success("Đã reset mật khẩu. Email đã được gửi.");
            setConfirmReset(false);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        }
    };

    const handleToggle = async () => {
        try {
            const result = await adminUserService.toggleActive(Number(id));
            setUser((prev) => (prev ? { ...prev, isActive: result.isActive } : null));
            toast.success(result.isActive ? "Tài khoản đã được kích hoạt" : "Tài khoản đã bị vô hiệu");
            setConfirmToggle(false);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        }
    };

    if (loading) return <Spinner fullPage />;
    if (!user) return <p className="text-red-500">Không tìm thấy người dùng.</p>;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                    ←
                </button>
                <div className="flex-1">
                    <h1>{user.fullName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setConfirmReset(true)} className="btn-secondary text-sm">
                        🔑 Reset MK
                    </button>
                    <button
                        onClick={() => setConfirmToggle(true)}
                        className={`text-sm ${user.isActive ? "btn-danger" : "btn-secondary"}`}
                    >
                        {user.isActive ? "🚫 Vô hiệu" : "✅ Kích hoạt"}
                    </button>
                    <Link to="edit" className="btn-primary text-sm">
                        ✏️ Chỉnh sửa
                    </Link>
                </div>
            </div>

            {/* Profile card */}
            <div className="card">
                <div className="flex items-start gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl flex-shrink-0">
                        {user.fullName[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h2>{user.fullName}</h2>
                            <Badge
                                label={user.isActive ? "Hoạt động" : "Vô hiệu"}
                                className={user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {user.roles.map((r) => (
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
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            {[
                                { label: "Email", val: user.email },
                                { label: "SĐT", val: user.phone ?? "—" },
                                { label: "CCCD/CMND", val: user.idCard ?? "—" },
                                { label: "Ngày sinh", val: formatDate(user.dateOfBirth ?? null) },
                                { label: "Ngày tạo TK", val: formatDate(user.createdAt) },
                                {
                                    label: "Căn hộ",
                                    val: user.currentApartment
                                        ? `${user.currentApartment.apartmentNumber} – ${user.currentApartment.buildingName}`
                                        : "Chưa có căn hộ",
                                },
                            ].map(({ label, val }) => (
                                <div key={label}>
                                    <span className="text-gray-400">{label}: </span>
                                    <span className="font-medium text-gray-700">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={confirmReset}
                title="Reset mật khẩu"
                message={`Mật khẩu mới sẽ được gửi qua email ${user.email}. Tiếp tục?`}
                onConfirm={handleReset}
                onCancel={() => setConfirmReset(false)}
                confirmLabel="Reset mật khẩu"
            />
            <ConfirmDialog
                isOpen={confirmToggle}
                title={user.isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
                message={
                    user.isActive
                        ? `Tài khoản "${user.fullName}" sẽ không thể đăng nhập sau khi vô hiệu.`
                        : `Tài khoản "${user.fullName}" sẽ được phép đăng nhập lại.`
                }
                onConfirm={handleToggle}
                onCancel={() => setConfirmToggle(false)}
                confirmLabel={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                danger={user.isActive}
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminUserService } from "../../../services/admin/userService";
import type { UserCreateFormData, UserUpdateFormData } from "../../../types/admin";
import { ALL_ROLES, ROLE_LABELS } from "../../../utils/constants";

export function UserFormPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [initLoad, setInitLoad] = useState(isEdit);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<UserCreateFormData>();

    useEffect(() => {
        if (!isEdit) return;
        adminUserService.getById(Number(id)).then((u) => {
            reset({
                fullName: u.fullName,
                email: u.email,
                phone: u.phone ?? "",
                idCard: u.idCard ?? "",
                dateOfBirth: u.dateOfBirth ?? "",
                roles: u.roles,
            });
            setInitLoad(false);
        });
    }, [id, isEdit, reset]);

    const onSubmit = async (data: UserCreateFormData) => {
        setLoading(true);
        try {
            if (isEdit) {
                const updateData: UserUpdateFormData = {
                    fullName: data.fullName,
                    phone: data.phone,
                    dateOfBirth: data.dateOfBirth,
                };
                await adminUserService.update(Number(id), updateData);
                toast.success("Cập nhật thông tin thành công!");
            } else {
                await adminUserService.create(data);
                toast.success("Tạo tài khoản thành công! Email đã được gửi đến người dùng.");
            }
            setTimeout(() => navigate("/admin/users"), 1200);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (initLoad) return <Spinner fullPage />;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                    ←
                </button>
                <div>
                    <h1>{isEdit ? "✏️ Chỉnh sửa người dùng" : "👤 Tạo tài khoản mới"}</h1>
                    {!isEdit && (
                        <p className="text-sm text-gray-500 mt-0.5">Mật khẩu ngẫu nhiên sẽ được gửi qua email sau khi tạo.</p>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
                {/* Họ tên */}
                <div>
                    <label className="label">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="input-field"
                        placeholder="Nguyễn Văn A"
                        {...register("fullName", {
                            required: "Họ tên là bắt buộc",
                            maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                        })}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email (chỉ khi tạo mới) */}
                {!isEdit && (
                    <div>
                        <label className="label">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="user@example.com"
                            {...register("email", {
                                required: "Email là bắt buộc",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ" },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Số điện thoại */}
                    <div>
                        <label className="label">Số điện thoại</label>
                        <input
                            className="input-field"
                            placeholder="09xxxxxxxx"
                            {...register("phone", {
                                pattern: { value: /^0[3-9]\d{8}$/, message: "SĐT không hợp lệ (10 số, bắt đầu bằng 03-09)" },
                            })}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label className="label">Ngày sinh</label>
                        <input type="date" className="input-field" {...register("dateOfBirth")} />
                    </div>
                </div>

                {/* CCCD (chỉ khi tạo mới) */}
                {!isEdit && (
                    <div>
                        <label className="label">CCCD / CMND</label>
                        <input
                            className="input-field"
                            placeholder="012345678901 (9 hoặc 12 số)"
                            {...register("idCard", {
                                pattern: { value: /^\d{9}$|^\d{12}$/, message: "CCCD phải có 9 hoặc 12 số" },
                            })}
                        />
                        {errors.idCard && <p className="text-red-500 text-xs mt-1">{errors.idCard.message}</p>}
                    </div>
                )}

                {/* Roles (chỉ khi tạo mới) */}
                {!isEdit && (
                    <div>
                        <label className="label">
                            Vai trò <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            <Controller
                                name="roles"
                                control={control}
                                rules={{ validate: (v) => (v && v.length > 0) || "Phải chọn ít nhất 1 vai trò" }}
                                defaultValue={["ROLE_RESIDENT"]}
                                render={({ field }) => (
                                    <>
                                        {ALL_ROLES.map((role) => (
                                            <label
                                                key={role}
                                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={field.value?.includes(role) ?? false}
                                                    onChange={(e) => {
                                                        const current = field.value ?? [];
                                                        field.onChange(
                                                            e.target.checked
                                                                ? [...current, role]
                                                                : current.filter((r) => r !== role),
                                                        );
                                                    }}
                                                    className="rounded"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">{ROLE_LABELS[role]}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {role === "ROLE_ADMIN"
                                                            ? "Quyền quản trị toàn hệ thống"
                                                            : role === "ROLE_MANAGER"
                                                              ? "Quản lý tòa nhà được giao"
                                                              : "Cư dân sinh sống trong tòa nhà"}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </>
                                )}
                            />
                        </div>
                        {errors.roles && <p className="text-red-500 text-xs mt-1">{errors.roles.message}</p>}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                        Huỷ
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? "Đang lưu..." : isEdit ? "💾 Lưu thay đổi" : "👤 Tạo tài khoản"}
                    </button>
                </div>
            </form>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

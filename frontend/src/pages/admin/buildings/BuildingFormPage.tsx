import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminUserService } from "../../../services/admin/userService";
import type { BuildingFormData, User } from "../../../types/admin";

export function BuildingFormPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [initLoad, setInitLoad] = useState(isEdit);
    const [managers, setManagers] = useState<User[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BuildingFormData>();

    // Load managers list
    useEffect(() => {
        adminUserService.getAll({ role: "ROLE_MANAGER", isActive: true, size: 100 }).then((d) => setManagers(d.content));
    }, []);

    // Load building data khi edit
    useEffect(() => {
        if (!isEdit) return;
        adminBuildingService.getById(Number(id)).then((b) => {
            reset({
                name: b.name,
                address: b.address,
                numFloors: b.numFloors,
                numApartments: b.numApartments,
                description: b.description ?? "",
                managerId: b.manager?.id ?? null,
            });
            setInitLoad(false);
        });
    }, [id, isEdit, reset]);

    const onSubmit = async (data: BuildingFormData) => {
        setLoading(true);
        try {
            if (isEdit) {
                await adminBuildingService.update(Number(id), data);
                toast.success("Cập nhật tòa nhà thành công!");
            } else {
                await adminBuildingService.create(data);
                toast.success("Tạo tòa nhà thành công!");
            }
            setTimeout(() => navigate("/admin/buildings"), 1200);
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (initLoad) return <Spinner fullPage />;
    return (
        <div className="space-y-5">
            {/* Back + Title */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">
                    ←
                </button>
                <div>
                    <h1>{isEdit ? "✏️ Chỉnh sửa tòa nhà" : "🏢 Thêm tòa nhà mới"}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isEdit ? "Cập nhật thông tin tòa nhà" : "Điền thông tin để tạo tòa nhà mới"}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
                {/* Tên tòa nhà */}
                <div>
                    <label className="label">
                        Tên tòa nhà <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="input-field"
                        placeholder="VD: Sunrise Tower, Happy Home..."
                        {...register("name", {
                            required: "Tên tòa nhà là bắt buộc",
                            maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                        })}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Địa chỉ */}
                <div>
                    <label className="label">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="input-field"
                        rows={2}
                        placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                        {...register("address", { required: "Địa chỉ là bắt buộc" })}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                {/* Số tầng & căn hộ */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            Số tầng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            {...register("numFloors", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 1, message: "Tối thiểu 1 tầng" },
                                max: { value: 200, message: "Tối đa 200 tầng" },
                            })}
                        />
                        {errors.numFloors && <p className="text-red-500 text-xs mt-1">{errors.numFloors.message}</p>}
                    </div>
                    <div>
                        <label className="label">
                            Số căn hộ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            {...register("numApartments", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 1, message: "Tối thiểu 1 căn" },
                            })}
                        />
                        {errors.numApartments && <p className="text-red-500 text-xs mt-1">{errors.numApartments.message}</p>}
                    </div>
                </div>

                {/* Ban quản lý */}
                <div>
                    <label className="label">Ban Quản Lý phụ trách</label>
                    <select className="input-field" {...register("managerId", { setValueAs: (v) => (v ? Number(v) : null) })}>
                        <option value="">-- Chưa gán manager --</option>
                        {managers.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.fullName} ({m.email})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Có thể gán sau khi tạo tòa nhà</p>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="label">Mô tả</label>
                    <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Thông tin thêm về tòa nhà (tiện ích, vị trí...)"
                        {...register("description")}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                        Huỷ
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? "Đang lưu..." : isEdit ? "💾 Lưu thay đổi" : "🏢 Tạo tòa nhà"}
                    </button>
                </div>
            </form>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

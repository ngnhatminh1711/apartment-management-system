import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../components/common/Badge";
import { EmptyState } from "../../../components/common/EmptyState";
import { Modal } from "../../../components/common/Modal";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminServiceTypeService } from "../../../services/admin/serviceTypeService";
import type { ServiceType, ServiceTypeFormData } from "../../../types/admin";
import { formatCurrency } from "../../../utils/formatters";

export function ServiceTypePage() {
    const [services, setServices] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ServiceType | null>(null);
    const [saving, setSaving] = useState(false);

    const toast = useToast();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ServiceTypeFormData>();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminServiceTypeService.getAll({ isActive: filterActive, size: 50 });
            setServices(data.content);
        } catch {
            toast.error("Không thể tải danh sách dịch vụ");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterActive]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openEdit = (item: ServiceType) => {
        setEditItem(item);
        reset({ name: item.name, description: item.description ?? "", monthlyFee: item.monthlyFee, iconUrl: item.iconUrl ?? "" });
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditItem(null);
        reset({ name: "", description: "", monthlyFee: 0, iconUrl: "" });
        setModalOpen(true);
    };

    const onSubmit = async (data: ServiceTypeFormData) => {
        setSaving(true);
        try {
            if (editItem) {
                await adminServiceTypeService.update(editItem.id, data);
                toast.success("Cập nhật dịch vụ thành công!");
            } else {
                await adminServiceTypeService.create(data);
                toast.success("Tạo dịch vụ thành công!");
            }
            setModalOpen(false);
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const result = await adminServiceTypeService.toggleActive(id);
            toast.success(result.isActive ? "Dịch vụ đã được bật" : "Dịch vụ đã được tắt");
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>🛎️ Danh mục Dịch vụ Tiện ích</h1>
                <button onClick={openCreate} className="btn-primary">
                    + Thêm dịch vụ
                </button>
            </div>

            {/* Filter */}
            <div className="card py-3">
                <select
                    className="input-field w-44"
                    value={filterActive === undefined ? "" : String(filterActive)}
                    onChange={(e) => setFilterActive(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">Tất cả</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Đã tắt</option>
                </select>
            </div>

            {/* Service cards */}
            {loading ? (
                <div className="py-16 flex justify-center">
                    <Spinner />
                </div>
            ) : services.length === 0 ? (
                <EmptyState
                    icon="🛎️"
                    title="Chưa có dịch vụ nào"
                    action={
                        <button onClick={openCreate} className="btn-primary">
                            + Thêm dịch vụ
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {services.map((s) => (
                        <div key={s.id} className="card flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{s.iconUrl || "🛎️"}</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{s.name}</p>
                                        <p className="text-xs text-gray-400">{s.totalRegistrations} đăng ký đang active</p>
                                    </div>
                                </div>
                                <Badge
                                    label={s.isActive ? "Đang hoạt động" : "Đã tắt"}
                                    className={s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}
                                />
                            </div>

                            {s.description && <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400">Phí hàng tháng</p>
                                    <p className="font-bold text-primary">
                                        {s.monthlyFee > 0 ? formatCurrency(s.monthlyFee) : "Miễn phí"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(s)} className="text-xs text-primary hover:underline">
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleToggle(s.id)}
                                        className={`text-xs hover:underline ${s.isActive ? "text-red-500" : "text-green-600"}`}
                                    >
                                        {s.isActive ? "Tắt" : "Bật"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? "✏️ Sửa dịch vụ" : "➕ Thêm dịch vụ mới"}
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="label">
                            Tên dịch vụ <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="input-field"
                            placeholder="VD: Thẻ Gym Tháng, Hồ Bơi..."
                            {...register("name", {
                                required: "Tên dịch vụ là bắt buộc",
                                maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                            })}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="label">Mô tả</label>
                        <textarea
                            className="input-field"
                            rows={2}
                            placeholder="Mô tả chi tiết về dịch vụ..."
                            {...register("description")}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">
                                Phí hàng tháng (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0 = miễn phí"
                                {...register("monthlyFee", {
                                    required: "Bắt buộc",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Không được âm" },
                                })}
                            />
                            {errors.monthlyFee && <p className="text-red-500 text-xs mt-1">{errors.monthlyFee.message}</p>}
                        </div>
                        <div>
                            <label className="label">Icon (emoji hoặc URL)</label>
                            <input className="input-field" placeholder="🏊 hoặc https://..." {...register("iconUrl")} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                            Huỷ
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? "Đang lưu..." : editItem ? "💾 Lưu thay đổi" : "➕ Tạo dịch vụ"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

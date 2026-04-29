import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../components/common/Badge";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { EmptyState } from "../../../components/common/EmptyState";
import { Modal } from "../../../components/common/Modal";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminFeeConfigService } from "../../../services/admin/feeConfigService";
import type { Building, CurrentFeeResponse, FeeConfig, FeeConfigFormData } from "../../../types/admin";
import type { FeeType } from "../../../types/common";
import { FEE_TYPE_LABELS, FEE_UNITS } from "../../../utils/constants";
import { formatCurrency, formatDate } from "../../../utils/formatters";

export function FeeConfigPage() {
    const [configs, setConfigs] = useState<FeeConfig[]>([]);
    const [current, setCurrent] = useState<CurrentFeeResponse | null>(null);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [buildingId, setBuildingId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [activeOnly, setActiveOnly] = useState(true);

    const toast = useToast();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FeeConfigFormData>();
    const watchFeeType = watch("feeType");

    // Auto-fill unit when feeType changes
    useEffect(() => {
        if (watchFeeType) setValue("unit", FEE_UNITS[watchFeeType as FeeType] ?? "");
    }, [watchFeeType, setValue]);

    useEffect(() => {
        adminBuildingService.getAll({ size: 100, isActive: true }).then((d) => {
            setBuildings(d.content);
            if (d.content.length > 0) setBuildingId(d.content[0].id);
        });
    }, []);

    const fetchData = useCallback(async () => {
        if (!buildingId) return;
        setLoading(true);
        try {
            const [cfgList, cfgCurrent] = await Promise.all([
                adminFeeConfigService.getAll({ buildingId, activeOnly }),
                adminFeeConfigService.getCurrent(buildingId),
            ]);
            setConfigs(cfgList);
            setCurrent(cfgCurrent);
        } catch {
            toast.error("Không thể tải cấu hình phí");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buildingId, activeOnly]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onSubmit = async (data: FeeConfigFormData) => {
        if (!buildingId) return;
        try {
            await adminFeeConfigService.create({ ...data, buildingId });
            toast.success("Tạo cấu hình phí thành công! Config cũ đã tự động đóng.");
            setAddOpen(false);
            reset();
            fetchData();
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await adminFeeConfigService.delete(deleteId);
            toast.success("Đã xóa cấu hình phí");
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
                <h1>💰 Cấu hình Bảng Giá</h1>
                <button onClick={() => setAddOpen(true)} className="btn-primary">
                    + Thêm giá mới
                </button>
            </div>

            {/* Filters */}
            <div className="card py-3 flex gap-3 items-center flex-wrap">
                <select
                    className="input-field w-60"
                    value={buildingId ?? ""}
                    onChange={(e) => setBuildingId(e.target.value ? Number(e.target.value) : undefined)}
                >
                    <option value="">-- Chọn tòa nhà --</option>
                    {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={activeOnly}
                        onChange={(e) => setActiveOnly(e.target.checked)}
                        className="rounded"
                    />
                    Chỉ hiển thị giá đang áp dụng
                </label>
            </div>

            {/* Current fee summary */}
            {current && (
                <div className="card">
                    <h3 className="mb-3">📋 Bảng giá đang áp dụng – {current.buildingName}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {(Object.entries(current.fees) as [FeeType, { unitPrice: number; unit: string }][]).map(([type, fee]) => (
                            <div key={type} className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">{FEE_TYPE_LABELS[type]}</p>
                                <p className="font-bold text-gray-900">{formatCurrency(fee.unitPrice)}</p>
                                <p className="text-xs text-gray-400">/ {fee.unit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Config list */}
            <div className="card p-0">
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : configs.length === 0 ? (
                    <EmptyState
                        icon=""
                        title="Chưa có cấu hình phí nào"
                        message="Hãy thêm bảng giá để hệ thống có thể tính hóa đơn tự động."
                    />
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                {["Loại phí", "Đơn giá", "Đơn vị", "Áp dụng từ", "Kết thúc", "Trạng thái", ""].map((h) => (
                                    <th key={h} className="table-header text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="table-cell font-medium">{FEE_TYPE_LABELS[c.feeType]}</td>
                                    <td className="table-cell font-semibold text-primary">{formatCurrency(c.unitPrice)}</td>
                                    <td className="table-cell text-gray-500">{c.unit}</td>
                                    <td className="table-cell">{formatDate(c.effectiveFrom)}</td>
                                    <td className="table-cell">{c.effectiveTo ? formatDate(c.effectiveTo) : "—"}</td>
                                    <td className="table-cell">
                                        <Badge
                                            label={c.effectiveTo ? "Đã đóng" : "Đang áp dụng"}
                                            className={
                                                c.effectiveTo ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                                            }
                                        />
                                    </td>
                                    <td className="table-cell">
                                        {!c.effectiveTo && (
                                            <button
                                                onClick={() => setDeleteId(c.id)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add fee config modal */}
            <Modal
                isOpen={addOpen}
                onClose={() => {
                    setAddOpen(false);
                    reset();
                }}
                title="➕ Thêm cấu hình giá mới"
                size="md"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-xl">
                        💡 Khi tạo giá mới, hệ thống sẽ tự động đóng giá cũ cùng loại. Giá mới sẽ áp dụng từ ngày bạn chọn.
                    </div>

                    <div>
                        <label className="label">
                            Loại phí <span className="text-red-500">*</span>
                        </label>
                        <select className="input-field" {...register("feeType", { required: "Vui lòng chọn loại phí" })}>
                            <option value="">-- Chọn loại phí --</option>
                            {(Object.keys(FEE_TYPE_LABELS) as FeeType[]).map((k) => (
                                <option key={k} value={k}>
                                    {FEE_TYPE_LABELS[k]}
                                </option>
                            ))}
                        </select>
                        {errors.feeType && <p className="text-red-500 text-xs mt-1">{errors.feeType.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">
                                Đơn giá (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="3500"
                                {...register("unitPrice", {
                                    required: "Bắt buộc",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Không được âm" },
                                })}
                            />
                            {errors.unitPrice && <p className="text-red-500 text-xs mt-1">{errors.unitPrice.message}</p>}
                        </div>
                        <div>
                            <label className="label">
                                Đơn vị <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="input-field"
                                placeholder="kWh, m3, tháng..."
                                {...register("unit", { required: "Bắt buộc" })}
                            />
                            {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="label">
                            Áp dụng từ ngày <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            min={new Date().toISOString().split("T")[0]}
                            {...register("effectiveFrom", { required: "Bắt buộc" })}
                        />
                        {errors.effectiveFrom && <p className="text-red-500 text-xs mt-1">{errors.effectiveFrom.message}</p>}
                    </div>

                    <div>
                        <label className="label">Ghi chú</label>
                        <input className="input-field" placeholder="Mô tả thêm về mức giá này..." {...register("description")} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setAddOpen(false);
                                reset();
                            }}
                            className="btn-secondary flex-1"
                        >
                            Huỷ
                        </button>
                        <button type="submit" className="btn-primary flex-1">
                            💾 Lưu cấu hình
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Xóa cấu hình phí"
                message="Bạn có chắc muốn xóa cấu hình phí này? Chỉ xóa được nếu chưa có hóa đơn nào dùng mức giá này."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                confirmLabel="Xóa"
                danger
            />
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

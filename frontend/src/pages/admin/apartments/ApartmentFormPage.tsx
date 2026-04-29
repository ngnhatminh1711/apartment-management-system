import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { adminApartmentService } from "../../../services/admin/apartmentService";
import { adminBuildingService } from "../../../services/admin/buildingService";
import type { ApartmentFormData, Building } from "../../../types/admin";
import { DIRECTIONS } from "../../../utils/constants";

export function ApartmentFormPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [initLoad, setInitLoad] = useState(isEdit);
    const [buildings, setBuildings] = useState<Building[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ApartmentFormData>();

    useEffect(() => {
        adminBuildingService.getAll({ size: 100, isActive: true }).then((d) => setBuildings(d.content));
    }, []);

    useEffect(() => {
        if (!isEdit) return;
        adminApartmentService.getById(Number(id)).then((a) => {
            reset({
                buildingId: a.buildingId,
                apartmentNumber: a.apartmentNumber,
                floor: a.floor,
                areaM2: a.areaM2,
                numBedrooms: a.numBedrooms,
                numBathrooms: a.numBathrooms,
                direction: a.direction ?? "",
                notes: a.notes ?? "",
            });
            setInitLoad(false);
        });
    }, [id, isEdit, reset]);

    const onSubmit = async (data: ApartmentFormData) => {
        setLoading(true);
        try {
            if (isEdit) {
                await adminApartmentService.update(Number(id), data);
                toast.success("Cập nhật căn hộ thành công!");
            } else {
                await adminApartmentService.create(data);
                toast.success("Tạo căn hộ thành công!");
            }
            setTimeout(() => navigate("/admin/apartments"), 1200);
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
                <h1>{isEdit ? "✏️ Sửa căn hộ" : "🏠 Thêm căn hộ mới"}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
                {/* Tòa nhà (chỉ khi tạo mới) */}
                {!isEdit && (
                    <div>
                        <label className="label">
                            Tòa nhà <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="input-field"
                            {...register("buildingId", { required: "Vui lòng chọn tòa nhà", valueAsNumber: true })}
                        >
                            <option value="">-- Chọn tòa nhà --</option>
                            {buildings.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                        {errors.buildingId && <p className="text-red-500 text-xs mt-1">{errors.buildingId.message}</p>}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {/* Số căn hộ */}
                    <div>
                        <label className="label">
                            Số căn hộ <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="input-field"
                            placeholder="A101, B203..."
                            {...register("apartmentNumber", {
                                required: "Số căn hộ là bắt buộc",
                                maxLength: { value: 10, message: "Tối đa 10 ký tự" },
                            })}
                        />
                        {errors.apartmentNumber && <p className="text-red-500 text-xs mt-1">{errors.apartmentNumber.message}</p>}
                    </div>

                    {/* Tầng */}
                    <div>
                        <label className="label">
                            Tầng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            {...register("floor", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 1, message: "Tối thiểu tầng 1" },
                            })}
                        />
                        {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Diện tích */}
                    <div>
                        <label className="label">
                            Diện tích (m²) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            {...register("areaM2", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 10, message: "Tối thiểu 10m²" },
                            })}
                        />
                        {errors.areaM2 && <p className="text-red-500 text-xs mt-1">{errors.areaM2.message}</p>}
                    </div>

                    {/* Phòng ngủ */}
                    <div>
                        <label className="label">
                            Phòng ngủ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            {...register("numBedrooms", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 0, message: "Tối thiểu 0" },
                            })}
                        />
                        {errors.numBedrooms && <p className="text-red-500 text-xs mt-1">{errors.numBedrooms.message}</p>}
                    </div>

                    {/* Phòng tắm */}
                    <div>
                        <label className="label">
                            Phòng tắm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            className="input-field"
                            {...register("numBathrooms", {
                                required: "Bắt buộc",
                                valueAsNumber: true,
                                min: { value: 0, message: "Tối thiểu 0" },
                            })}
                        />
                        {errors.numBathrooms && <p className="text-red-500 text-xs mt-1">{errors.numBathrooms.message}</p>}
                    </div>
                </div>

                {/* Hướng */}
                <div>
                    <label className="label">Hướng</label>
                    <select className="input-field" {...register("direction")}>
                        <option value="">-- Không xác định --</option>
                        {DIRECTIONS.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ghi chú */}
                <div>
                    <label className="label">Ghi chú</label>
                    <textarea className="input-field" rows={2} placeholder="Thông tin thêm về căn hộ..." {...register("notes")} />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                        Huỷ
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? "Đang lưu..." : isEdit ? "💾 Lưu thay đổi" : "🏠 Tạo căn hộ"}
                    </button>
                </div>
            </form>

            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

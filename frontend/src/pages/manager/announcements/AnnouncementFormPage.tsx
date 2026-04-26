import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { managerAnnouncementService } from "../../../services/manager/announcementService";
import type { AnnouncementFormData } from "../../../types/announcement";
import type { AnnouncementPriority } from "../../../types/common";
import { ANNOUNCEMENT_PRIORITY_LABELS } from "../../../utils/constants";

export function AnnouncementFormPage() {
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
        formState: { errors },
    } = useForm<AnnouncementFormData>({
        defaultValues: { priority: "NORMAL" },
    });

    useEffect(() => {
        if (!isEdit) return;
        managerAnnouncementService.getById(Number(id)).then((a) => {
            reset({
                title: a.title,
                content: a.content,
                priority: a.priority,
                expiresAt: a.expiresAt ? a.expiresAt.slice(0, 16) : "",
            });
            setInitLoad(false);
        });
    }, [id, isEdit, reset]);

    const onSubmit = async (data: AnnouncementFormData) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
            };

            if (isEdit) {
                await managerAnnouncementService.update(Number(id), payload);
                toast.success("Cập nhật thông báo thành công!");
            } else {
                await managerAnnouncementService.create(payload);
                toast.success("Tạo thông báo thành công!");
            }
        } catch (e: unknown) {
            toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (initLoad) {
        return <Spinner fullPage />;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-gray-700 text-2xl leading-none material-symbols-outlined"
                >
                    arrow_back
                </button>
                <h1>{isEdit ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
                {/* Title */}
                <div>
                    <label className="label">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="input-field"
                        placeholder="VD: Lịch cắt nước định kỳ tháng 7"
                        {...register("title", {
                            required: "Tiêu đề là bắt buộc",
                            maxLength: { value: 200, message: "Tối đa 200 ký tự" },
                        })}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Content */}
                <div>
                    <label className="label">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="input-field"
                        rows={8}
                        placeholder="Thông báo đến toàn thể cư dân..."
                        {...register("content", { required: "Nội dung là bắt buộc" })}
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div>
                        <label className="label">
                            Mức độ <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {(Object.keys(ANNOUNCEMENT_PRIORITY_LABELS) as AnnouncementPriority[]).map((k) => (
                                <label key={k} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        value={k}
                                        {...register("priority", { required: "Bắt buộc" })}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{ANNOUNCEMENT_PRIORITY_LABELS[k]}</p>
                                        <p className="text-xs text-gray-400">
                                            {k === "NORMAL"
                                                ? "Thông tin thông thường"
                                                : k === "IMPORTANT"
                                                  ? "Cần chú ý"
                                                  : "Yêu cầu xử lý ngay"}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Expires */}
                    <div>
                        <label className="label">Thời gian hết hạn</label>
                        <input type="datetime-local" className="input-field" {...register("expiresAt")} />
                        <p className="text-xs text-gray-400 mt-1">Để trống nếu thông báo không hết hạn</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                        Hủy
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                        {loading ? "Đang lưu" : isEdit ? "Lưu thay đổi" : "Đăng thông báo"}
                    </button>
                </div>
            </form>
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

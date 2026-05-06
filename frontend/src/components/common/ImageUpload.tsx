import { useCallback, useRef, useState } from "react";
import { uploadService, type UploadFolder } from "../../services/uploadService";

interface Props {
    /** URL ảnh hiện tại (nếu có) */
    currentUrl?: string | null;
    /** Folder Cloudinary */
    folder?: UploadFolder;
    /** Callback khi upload xong – trả về URL mới */
    onUpload: (url: string) => void;
    /** Label hiển thị */
    label?: string;
    /** Shape: circle (avatar) hoặc square (icon) */
    shape?: "circle" | "square";
    /** Kích thước preview (px) */
    size?: number;
    /** Có cho phép xóa ảnh không */
    allowRemove?: boolean;
    /** Callback khi xóa ảnh */
    onRemove?: () => void;
}

const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif";

export function ImageUpload({
    currentUrl,
    folder = "general",
    onUpload,
    label = "Ảnh",
    shape = "square",
    size = 96,
    allowRemove = false,
    onRemove,
}: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const displayUrl = preview ?? currentUrl ?? null;
    const isCircle = shape === "circle";

    const handleFile = useCallback(
        async (file: File) => {
            setError(null);

            // Client-side validation
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`Ảnh không được vượt quá ${MAX_SIZE_MB}MB`);
                return;
            }
            if (!file.type.startsWith("image/")) {
                setError("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)");
                return;
            }

            // Show local preview ngay lập tức
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload lên server
            setUploading(true);
            try {
                const result = await uploadService.uploadImage(file, folder);
                onUpload(result.url);
                // Dọn dẹp object URL sau khi đã có URL thật
                URL.revokeObjectURL(objectUrl);
                setPreview(result.url);
            } catch {
                setError("Upload thất bại, vui lòng thử lại");
                setPreview(null);
                URL.revokeObjectURL(objectUrl);
            } finally {
                setUploading(false);
            }
        },
        [folder, onUpload],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        // Reset input để có thể chọn lại cùng file
        e.target.value = "";
    };

    // Drag & drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

            <div className="flex flex-col items-start gap-4">
                {/* Preview / Placeholder */}
                <div
                    style={{ width: size, height: size }}
                    className={`
            relative shrink-0 overflow-hidden border-2 border-dashed border-gray-300
            hover:border-primary transition-colors cursor-pointer bg-gray-50
            ${isCircle ? "rounded-full" : "rounded-xl"}
          `}
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {displayUrl ? (
                        <img src={displayUrl} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 px-2">
                            <span className="text-xs text-center mt-1">Click hoặc kéo ảnh vào đây</span>
                        </div>
                    )}

                    {/* Loading overlay */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Camera icon khi hover (nếu đã có ảnh) */}
                    {displayUrl && !uploading && (
                        <div
                            className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors
                            flex items-center justify-center opacity-0 hover:opacity-100"
                        ></div>
                    )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 space-y-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="btn-secondary text-sm w-full"
                    >
                        {uploading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <span className="w-4 h-4 border-2 border-gray-400 border-t-primary rounded-full animate-spin" />
                                Đang tải lên...
                            </span>
                        ) : displayUrl ? (
                            "Thay đổi ảnh"
                        ) : (
                            "Chọn ảnh"
                        )}
                    </button>

                    {allowRemove && displayUrl && !uploading && (
                        <button
                            type="button"
                            onClick={() => {
                                setPreview(null);
                                onRemove?.();
                            }}
                            className="group text-xs text-red-500 w-full text-center flex items-center"
                        >
                            <span className="material-symbols-outlined">delete</span>
                            <span className="group-hover:underline">Xóa ảnh</span>
                        </button>
                    )}

                    <p className="text-xs text-gray-400">JPG, PNG, WEBP, GIF · Tối đa {MAX_SIZE_MB}MB</p>

                    {error && <p className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-lg">{error}</p>}
                </div>
            </div>

            <input ref={inputRef} type="file" accept={ACCEPT} onChange={handleChange} className="hidden" />
        </div>
    );
}

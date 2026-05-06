import { useCallback, useRef, useState } from "react";
import { uploadService, type UploadFolder } from "../../services/uploadService";

interface ImageItem {
    id: string; // uuid tạm thời
    file?: File; // chỉ có khi mới chọn
    url: string; // preview URL hoặc Cloudinary URL
    publicId?: string; // chỉ có sau khi upload xong
    uploading: boolean;
    error?: string;
}

interface Props {
    /** Danh sách URL ảnh hiện có */
    initialUrls?: string[];
    /** Folder Cloudinary */
    folder?: UploadFolder;
    /** Số ảnh tối đa */
    maxImages?: number;
    /** Callback mỗi khi danh sách URL thay đổi */
    onChange: (urls: string[]) => void;
    /** Label */
    label?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif";

let idCounter = 0;
const genId = () => `img-${++idCounter}-${Date.now()}`;

export function MultiImageUpload({
    initialUrls = [],
    folder = "general",
    maxImages = 5,
    onChange,
    label = "Ảnh đính kèm",
}: Props) {
    const [images, setImages] = useState<ImageItem[]>(() =>
        initialUrls.map((url) => ({
            id: genId(),
            url,
            uploading: false,
        })),
    );

    const inputRef = useRef<HTMLInputElement>(null);

    // Thông báo ra ngoài khi danh sách thay đổi
    const notifyChange = useCallback(
        (items: ImageItem[]) => {
            const urls = items.filter((img) => !img.uploading && !img.error).map((img) => img.url);
            onChange(urls);
        },
        [onChange],
    );

    const handleFiles = useCallback(
        async (files: FileList) => {
            const remaining = maxImages - images.length;
            if (remaining <= 0) return;

            const toProcess = Array.from(files).slice(0, remaining);

            // Tạo placeholders ngay lập tức để show preview
            const newItems: ImageItem[] = toProcess.map((file) => ({
                id: genId(),
                file,
                url: URL.createObjectURL(file),
                uploading: true,
            }));

            const updatedImages = [...images, ...newItems];
            setImages(updatedImages);

            // Upload song song
            const uploadPromises = newItems.map(async (item) => {
                // Validate
                if (!item.file) return item;
                if (item.file.size > MAX_SIZE_MB * 1024 * 1024) {
                    URL.revokeObjectURL(item.url);
                    return { ...item, uploading: false, error: `Ảnh vượt quá ${MAX_SIZE_MB}MB` };
                }
                if (!item.file.type.startsWith("image/")) {
                    URL.revokeObjectURL(item.url);
                    return { ...item, uploading: false, error: "Không phải file ảnh" };
                }

                try {
                    const result = await uploadService.uploadImage(item.file, folder);
                    URL.revokeObjectURL(item.url);
                    return {
                        ...item,
                        url: result.url,
                        publicId: result.publicId,
                        uploading: false,
                        file: undefined,
                    };
                } catch {
                    URL.revokeObjectURL(item.url);
                    return { ...item, uploading: false, error: "Upload thất bại, thử lại" };
                }
            });

            const results = await Promise.all(uploadPromises);

            setImages((prev) => {
                // Thay thế placeholder bằng kết quả thật
                const map = new Map(results.map((r) => [r.id, r]));
                const next = prev.map((img) => map.get(img.id) ?? img);
                notifyChange(next);
                return next;
            });
        },
        [images, folder, maxImages, notifyChange],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
        e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const removeImage = (id: string) => {
        setImages((prev) => {
            const next = prev.filter((img) => img.id !== id);
            notifyChange(next);
            return next;
        });
    };

    const retryUpload = async (id: string) => {
        const item = images.find((img) => img.id === id);
        if (!item?.file) return;

        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, uploading: true, error: undefined } : img)));

        try {
            const newUrl = URL.createObjectURL(item.file);
            const result = await uploadService.uploadImage(item.file, folder);
            URL.revokeObjectURL(newUrl);

            setImages((prev) => {
                const next = prev.map((img) =>
                    img.id === id
                        ? { ...img, url: result.url, publicId: result.publicId, uploading: false, file: undefined }
                        : img,
                );
                notifyChange(next);
                return next;
            });
        } catch {
            setImages((prev) =>
                prev.map((img) => (img.id === id ? { ...img, uploading: false, error: "Upload thất bại, thử lại" } : img)),
            );
        }
    };

    const canAddMore = images.length < maxImages;
    const anyUploading = images.some((img) => img.uploading);

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <span className="text-xs text-gray-400">
                        {images.length}/{maxImages} ảnh
                    </span>
                </div>
            )}

            {/* Grid ảnh + nút thêm */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {/* Ảnh đã thêm */}
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative aspect-square rounded-xl overflow-hidden
                                        bg-gray-100 group border border-gray-200"
                    >
                        {/* Preview ảnh */}
                        <img
                            src={img.url}
                            alt=""
                            className={`w-full h-full object-cover transition-opacity
                          ${img.uploading || img.error ? "opacity-40" : "opacity-100"}`}
                        />

                        {/* Loading spinner */}
                        {img.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Error state */}
                        {img.error && !img.uploading && (
                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center
                              bg-red-50/80 p-1"
                            >
                                <span className="text-xs text-red-600 text-center leading-tight mb-1">{img.error}</span>
                                {img.file && (
                                    <button
                                        type="button"
                                        onClick={() => retryUpload(img.id)}
                                        className="text-xs text-blue-600 underline"
                                    >
                                        Thử lại
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Remove button (hiện khi hover, không hiện khi đang upload) */}
                        {!img.uploading && (
                            <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                           text-xs flex items-center justify-center opacity-0 group-hover:opacity-100
                           transition-opacity hover:bg-red-600 material-symbols-outlined"
                                title="Xóa ảnh"
                            >
                                cancel
                            </button>
                        )}
                    </div>
                ))}

                {/* Nút thêm ảnh */}
                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        disabled={anyUploading}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300
                       hover:border-primary hover:bg-primary/5 transition-colors
                       flex flex-col items-center justify-center text-gray-400
                       disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <span className="text-xl">+</span>
                        <span className="text-xs mt-0.5">Thêm ảnh</span>
                    </button>
                )}
            </div>

            <p className="text-xs text-gray-400">
                JPG, PNG, WEBP, GIF · Tối đa {MAX_SIZE_MB}MB / ảnh · Tối đa {maxImages} ảnh
            </p>

            <input ref={inputRef} type="file" accept={ACCEPT} multiple onChange={handleChange} className="hidden" />
        </div>
    );
}

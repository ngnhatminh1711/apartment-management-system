import { useState } from "react";
import type { ExportFormat } from "../../services/exportService";
import { Spinner } from "./Spinner";

interface ExportButtonProps {
    /** Callback gọi khi user chọn format và click export */
    onExport: (format: ExportFormat) => void;
    /** Loading state từ useExport hook */
    loading?: boolean;
    /** Label hiển thị trên button (mặc định: "Xuất file") */
    label?: string;
    /** CSS class bổ sung */
    className?: string;
    /** Chỉ cho phép CSV (không có Excel), dùng khi data lớn */
    csvOnly?: boolean;
    /** Chỉ cho phép Excel */
    excelOnly?: boolean;
}

/**
 * Dropdown button cho phép chọn format trước khi export.
 *
 * Cách dùng:
 *   const { exporting, handleExport } = useExport();
 *
 *   <ExportButton
 *     loading={exporting}
 *     onExport={(fmt) => handleExport(() => exportService.exportUsers(fmt))}
 *   />
 */
export function ExportButton({
    onExport,
    loading = false,
    label = "Xuất file",
    className = "",
    csvOnly = false,
    excelOnly = false,
}: ExportButtonProps) {
    const [open, setOpen] = useState(false);

    const handleClick = (format: ExportFormat) => {
        setOpen(false);
        onExport(format);
    };

    // Nếu chỉ có 1 option, không cần dropdown
    if (csvOnly) {
        return (
            <button
                onClick={() => handleClick("csv")}
                disabled={loading}
                className={`btn-secondary flex items-center gap-2 text-sm ${className}`}
            >
                {loading ? <span className="animate-spin text-base">⏳</span> : <span>📄</span>}
                {loading ? "Đang xuất..." : `${label} CSV`}
            </button>
        );
    }

    if (excelOnly) {
        return (
            <button
                onClick={() => handleClick("excel")}
                disabled={loading}
                className={`btn-secondary flex items-center gap-2 text-sm ${className}`}
            >
                {loading ? <span className="animate-spin text-base">⏳</span> : <span>📊</span>}
                {loading ? "Đang xuất..." : `${label} Excel`}
            </button>
        );
    }

    // Dropdown với cả 2 option
    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen((o) => !o)}
                disabled={loading}
                className={`btn-secondary flex items-center gap-2 text-sm ${className}`}
            >
                {loading ? <Spinner size="sm" /> : <span className="material-symbols-outlined">download</span>}
                {loading ? "Đang xuất..." : label}
                {!loading && (
                    <span className={`material-symbols-outlined ml-1 text-xs transition-transform ${open ? "rotate-180" : ""}`}>
                        arrow_drop_down
                    </span>
                )}
            </button>

            {/* Dropdown menu */}
            {open && !loading && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                        <button
                            onClick={() => handleClick("excel")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-xl material-symbols-outlined">table_view</span>
                            <div className="text-left">
                                <p className="font-medium">Excel (.xlsx)</p>
                                <p className="text-xs text-gray-400">Bảng tính có định dạng màu sắc</p>
                            </div>
                        </button>
                        <div className="border-t border-gray-100" />
                        <button
                            onClick={() => handleClick("csv")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-xl material-symbols-outlined">description</span>
                            <div className="text-left">
                                <p className="font-medium">CSV (.csv)</p>
                                <p className="text-xs text-gray-400">Dùng để import vào hệ thống khác</p>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

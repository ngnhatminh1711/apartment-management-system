import { useCallback, useState } from "react";

/**
 * Hook quản lý trạng thái loading khi export.
 *
 * Dùng:
 *   const { exporting, handleExport } = useExport();
 *
 *   <button onClick={() => handleExport(() => exportService.exportUsers('excel'))}>
 *     Export Excel
 *   </button>
 */
export function useExport() {
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = useCallback(async (exportFn: () => Promise<void>) => {
        setExporting(true);
        setError(null);
        try {
            await exportFn();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Xuất file thất bại. Vui lòng thử lại.";
            setError(msg);
            // Auto clear error sau 4 giây
            setTimeout(() => setError(null), 4000);
        } finally {
            setExporting(false);
        }
    }, []);

    return { exporting, error, handleExport };
}

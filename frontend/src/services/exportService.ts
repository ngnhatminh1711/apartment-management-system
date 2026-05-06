import axiosInstance from "./axiosInstance";

/**
 * Service download file (Excel/CSV) từ backend.
 *
 * Dùng Axios với responseType: 'blob' để nhận binary data,
 * sau đó tạo link ảo và click để download.
 */

export type ExportFormat = "excel" | "csv";

/**
 * Core download function.
 * @param url      endpoint trả về file
 * @param params   query params (bao gồm format)
 * @param filename tên file gợi ý (browser có thể dùng filename từ Content-Disposition)
 */
async function downloadFile(
    url: string,
    params: Record<string, string | number | boolean | undefined>,
    filename?: string,
): Promise<void> {
    const response = await axiosInstance.get(url, {
        params,
        responseType: "blob",
    });

    // Lấy filename từ Content-Disposition header nếu có
    const disposition = response.headers["content-disposition"] as string | undefined;
    let downloadName = filename ?? "export";

    if (disposition) {
        // Ưu tiên filename* (UTF-8 encoded)
        const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
        if (utf8Match) {
            downloadName = decodeURIComponent(utf8Match[1]);
        } else {
            const plain = disposition.match(/filename="?([^";]+)"?/i);
            if (plain) downloadName = plain[1];
        }
    }

    // Tạo Blob URL và click
    const blob = new Blob([response.data], { type: response.headers["content-type"] as string });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
    }, 100);
}

// ── ADMIN EXPORTS ──────────────────────────────────────────────────────────

export const exportService = {
    // Users
    exportUsers: (format: ExportFormat = "excel") => downloadFile("/admin/export/users", { format }, "users"),

    // Buildings
    exportBuildings: (format: ExportFormat = "excel") => downloadFile("/admin/export/buildings", { format }, "buildings"),

    // Apartments
    exportApartments: (
        params: {
            buildingId?: number;
            status?: string;
            format?: ExportFormat;
        } = {},
    ) => {
        const { format = "excel", ...rest } = params;
        return downloadFile("/admin/export/apartments", { ...rest, format }, `apartments_status-${params.status}`);
    },

    // Bills (Admin)
    exportBills: (
        params: {
            buildingId?: number;
            status?: string;
            fromMonth?: string; // YYYY-MM-DD (ngày 1 của tháng)
            toMonth?: string;
            format?: ExportFormat;
        } = {},
    ) => {
        const { format = "excel", ...rest } = params;
        return downloadFile("/admin/export/bills", { ...rest, format }, `bills_status-${params.status}`);
    },

    // Payments
    exportPayments: (
        params: {
            buildingId?: number;
            format?: ExportFormat;
        } = {},
    ) => {
        const { format = "excel", ...rest } = params;
        return downloadFile("/admin/export/payments", { ...rest, format }, "payments");
    },

    // Vehicles (Admin)
    exportVehicles: (
        params: {
            buildingId?: number;
            status?: string;
            format?: ExportFormat;
        } = {},
    ) => {
        const { format = "excel", ...rest } = params;
        return downloadFile("/admin/export/vehicles", { ...rest, format }, "vehicles");
    },

    // Fee Configs
    exportFeeConfigs: (
        params: {
            buildingId?: number;
            format?: ExportFormat;
        } = {},
    ) => {
        const { format = "excel", ...rest } = params;
        return downloadFile("/admin/export/fee-configs", { ...rest, format }, "fee-configs");
    },
};

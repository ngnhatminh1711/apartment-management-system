import { useEffect, useState } from "react";
import { EmptyState } from "../../../components/common/EmptyState";
import { ExportButton } from "../../../components/common/ExportButton";
import { Spinner } from "../../../components/common/Spinner";
import { useExport } from "../../../hooks/useExport";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminReportService } from "../../../services/admin/reportService";
import { exportService } from "../../../services/exportService";
import type { Building, Debtor, DebtReport } from "../../../types/admin";
import { formatCurrency, formatDate } from "../../../utils/formatters";

export function DebtPage() {
    const [report, setReport] = useState<DebtReport | null>(null);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [buildingId, setBuildingId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState<number | null>(null);
    const { exporting, error: exportError, handleExport } = useExport();

    useEffect(() => {
        adminBuildingService.getAll({ size: 100 }).then((d) => setBuildings(d.content));
    }, []);

    useEffect(() => {
        setLoading(true);
        adminReportService
            .getDebt(buildingId)
            .then(setReport)
            .finally(() => setLoading(false));
    }, [buildingId]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>Báo cáo Công nợ</h1>
                <div className="flex gap-2">
                    <ExportButton
                        loading={exporting}
                        label="Xuất báo cáo"
                        onExport={(fmt) => {
                            handleExport(() =>
                                exportService.exportBills({
                                    buildingId: buildingId,
                                    status: "PENDING", // chỉ xuất các hóa đơn chưa thanh toán
                                    format: fmt,
                                }),
                            );
                            handleExport(() =>
                                exportService.exportBills({
                                    buildingId: buildingId,
                                    status: "PARTIALLY_PAID", // chỉ xuất các hóa đơn chưa thanh toán
                                    format: fmt,
                                }),
                            );
                        }}
                    />
                    <select
                        className="input-field w-52"
                        value={buildingId ?? ""}
                        onChange={(e) => setBuildingId(e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">Tất cả tòa nhà</option>
                        {buildings.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {exportError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{exportError}</div>
            )}

            {loading ? (
                <div className="py-16 flex justify-center">
                    <Spinner />
                </div>
            ) : report ? (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-1">Số căn hộ đang nợ</p>
                            <p className="text-3xl font-bold text-danger">{report.summary.totalDebtors}</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-1">Tổng nợ</p>
                            <p className="text-3xl font-bold text-danger">{formatCurrency(report.summary.totalDebtAmount)}</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-1">Quá hạn thanh toán</p>
                            <p className="text-3xl font-bold text-danger">{report.summary.overdueCount} HĐ</p>
                        </div>
                    </div>

                    {/* Debtor list */}
                    {report.debtors.length === 0 ? (
                        <EmptyState icon="✅" title="Không có công nợ" message="Tất cả hóa đơn đã được thanh toán đầy đủ." />
                    ) : (
                        <div className="card p-0">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3>Danh sách căn hộ đang nợ</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {report.debtors.map((d: Debtor) => (
                                    <div key={d.apartmentId}>
                                        {/* Summary row */}
                                        <div
                                            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setExpanded(expanded === d.apartmentId ? null : d.apartmentId)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-800">{d.apartmentNumber}</span>
                                                    <span className="text-gray-400 text-sm">–</span>
                                                    <span className="text-sm text-gray-500">{d.buildingName}</span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-0.5">
                                                    {d.residentName} · {d.residentPhone}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-danger">{formatCurrency(d.totalDebt)}</p>
                                                <p className="text-xs text-gray-400">{d.outstandingBills.length} hóa đơn</p>
                                            </div>
                                            <span className="text-gray-400 ml-2">{expanded === d.apartmentId ? "▾" : "▸"}</span>
                                        </div>

                                        {/* Expanded bills */}
                                        {expanded === d.apartmentId && (
                                            <div className="bg-gray-50 px-8 pb-4">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr>
                                                            {[
                                                                "Tháng HĐ",
                                                                "Tổng tiền",
                                                                "Đã trả",
                                                                "Còn lại",
                                                                "Hạn TT",
                                                                "Quá hạn",
                                                            ].map((h) => (
                                                                <th
                                                                    key={h}
                                                                    className="text-left py-2 text-xs text-gray-500 font-medium"
                                                                >
                                                                    {h}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {d.outstandingBills.map((b) => (
                                                            <tr key={b.billId}>
                                                                <td className="py-1.5 font-medium">{b.billingMonth}</td>
                                                                <td className="py-1.5">{formatCurrency(b.totalAmount)}</td>
                                                                <td className="py-1.5 text-success">
                                                                    {formatCurrency(b.paidAmount)}
                                                                </td>
                                                                <td className="py-1.5 text-danger font-medium">
                                                                    {formatCurrency(b.totalAmount - b.paidAmount)}
                                                                </td>
                                                                <td className="py-1.5">{formatDate(b.dueDate)}</td>
                                                                <td className="py-1.5">
                                                                    {b.daysOverdue > 0 ? (
                                                                        <span className="text-danger font-medium">
                                                                            {b.daysOverdue} ngày
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400">Chưa quá hạn</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
}

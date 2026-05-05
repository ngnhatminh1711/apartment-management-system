import { useEffect, useState } from "react";
import { RevenueBarChart } from "../../../components/charts/RevenueBarChart";
import { Spinner } from "../../../components/common/Spinner";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminReportService } from "../../../services/admin/reportService";
import type { Building, RevenuePeriod, RevenueReport } from "../../../types/admin";
import { formatCurrency, formatPercent } from "../../../utils/formatters";

export function RevenuePage() {
    const [report, setReport] = useState<RevenueReport | null>(null);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [buildingId, setBuildingId] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        adminBuildingService.getAll({ size: 100 }).then((d) => setBuildings(d.content));
    }, []);

    useEffect(() => {
        setLoading(true);
        adminReportService
            .getRevenue({ buildingId })
            .then(setReport)
            .finally(() => setLoading(false));
    }, [buildingId]);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1>📈 Báo cáo Doanh thu</h1>
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

            {loading ? (
                <div className="py-16 flex justify-center">
                    <Spinner />
                </div>
            ) : report ? (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Tổng đã lập HĐ", val: formatCurrency(report.summary.totalBilled), color: "text-gray-800" },
                            { label: "Tổng đã thu", val: formatCurrency(report.summary.totalCollected), color: "text-success" },
                            { label: "Còn tồn đọng", val: formatCurrency(report.summary.totalOutstanding), color: "text-danger" },
                            {
                                label: "Tỷ lệ thu thành",
                                val: formatPercent(report.summary.collectionRate),
                                color: "text-primary",
                            },
                        ].map(({ label, val, color }) => (
                            <div key={label} className="card text-center">
                                <p className="text-xs text-gray-500 mb-1">{label}</p>
                                <p className={`text-xl font-bold ${color}`}>{val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="card">
                        <h3 className="mb-4">📊 Biểu đồ doanh thu theo kỳ</h3>
                        <RevenueBarChart data={report.breakdown} />
                    </div>

                    {/* Table */}
                    <div className="card p-0">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3>📋 Chi tiết theo kỳ</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        {["Kỳ", "Đã lập HĐ", "Đã thu", "Còn lại", "Tỷ lệ thu"].map((h) => (
                                            <th key={h} className="table-header text-left">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.breakdown.map((p: RevenuePeriod) => (
                                        <tr key={p.period} className="hover:bg-gray-50">
                                            <td className="table-cell font-medium">{p.period}</td>
                                            <td className="table-cell">{formatCurrency(p.totalBilled)}</td>
                                            <td className="table-cell text-success font-medium">
                                                {formatCurrency(p.totalCollected)}
                                            </td>
                                            <td className="table-cell text-danger">{formatCurrency(p.outstanding)}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                                                        <div
                                                            className="h-full rounded-full bg-success"
                                                            style={{ width: `${p.collectionRate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium">{formatPercent(p.collectionRate)}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

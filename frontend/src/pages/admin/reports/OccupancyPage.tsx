import { useEffect, useState } from "react";
import { OccupancyPieChart } from "../../../components/charts/OccupancyPieChart";
import { Spinner } from "../../../components/common/Spinner";
import { adminBuildingService } from "../../../services/admin/buildingService";
import { adminReportService } from "../../../services/admin/reportService";
import type { Building, OccupancyReport } from "../../../types/admin";
import { formatPercent } from "../../../utils/formatters";

export function OccupancyPage() {
    const [report, setReport] = useState<OccupancyReport | null>(null);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [buildingId, setBuildingId] = useState<number | undefined>();
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        adminBuildingService.getAll({ size: 100 }).then((d) => setBuildings(d.content));
    }, []);

    useEffect(() => {
        setLoading(true);
        adminReportService
            .getOccupancy({ buildingId, month: month || undefined })
            .then(setReport)
            .finally(() => setLoading(false));
    }, [buildingId, month]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>🏠 Báo cáo Tỷ lệ Lấp đầy</h1>
                <div className="flex gap-3">
                    <input type="month" className="input-field w-40" value={month} onChange={(e) => setMonth(e.target.value)} />
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

            {loading ? (
                <div className="py-16 flex justify-center">
                    <Spinner />
                </div>
            ) : report ? (
                <>
                    {/* Overall */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-2">Tổng căn hộ</p>
                            <p className="text-4xl font-bold text-gray-800">{report.overall.totalApartments}</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-xs text-gray-500 mb-2">Tỷ lệ lấp đầy tổng thể</p>
                            <p className="text-4xl font-bold text-primary">{formatPercent(report.overall.occupancyRate)}</p>
                        </div>
                        <div className="card flex items-center justify-center">
                            <OccupancyPieChart
                                occupied={Math.round((report.overall.totalApartments * report.overall.occupancyRate) / 100)}
                                available={
                                    report.overall.totalApartments -
                                    Math.round((report.overall.totalApartments * report.overall.occupancyRate) / 100)
                                }
                                maintenance={0}
                            />
                        </div>
                    </div>

                    {/* Per building */}
                    <div className="card p-0">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3>📋 Chi tiết theo tòa nhà</h3>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {["Tòa nhà", "Tổng", "Đang ở", "Trống", "Bảo trì", "Tỷ lệ"].map((h) => (
                                        <th key={h} className="table-header text-left">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {report.buildings.map((b) => (
                                    <tr key={b.buildingId} className="hover:bg-gray-50">
                                        <td className="table-cell font-medium">{b.buildingName}</td>
                                        <td className="table-cell">{b.totalApartments}</td>
                                        <td className="table-cell text-primary font-medium">{b.occupied}</td>
                                        <td className="table-cell text-success">{b.available}</td>
                                        <td className="table-cell text-warning">{b.maintenance}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${b.occupancyRate}%`,
                                                            backgroundColor:
                                                                b.occupancyRate >= 80
                                                                    ? "#27AE60"
                                                                    : b.occupancyRate >= 50
                                                                      ? "#CA6F1E"
                                                                      : "#C0392B",
                                                        }}
                                                    />
                                                </div>
                                                <span className="font-medium text-sm w-12">{formatPercent(b.occupancyRate)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : null}
        </div>
    );
}

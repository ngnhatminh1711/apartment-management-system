import { useEffect, useState } from "react";
import { OccupancyPieChart } from "../../components/charts/OccupancyPieChart";
import { RevenueBarChart } from "../../components/charts/RevenueBarChart";
import { Spinner } from "../../components/common/Spinner";
import { StatCard } from "../../components/common/StatCard";
import { adminBuildingService } from "../../services/admin/buildingService";
import { adminReportService } from "../../services/admin/reportService";
import type { Building, DashboardStats } from "../../types/admin";
import { formatCurrency, formatPercent } from "../../utils/formatters";

export function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [buildingId, setBuildingId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    // Load danh sách tòa nhà cho filter
    useEffect(() => {
        adminBuildingService.getAll({ size: 100 }).then((d) => setBuildings(d.content));
    }, []);

    // Load stats khi buildingId thay đổi
    useEffect(() => {
        setLoading(true);
        adminReportService
            .getDashboard(buildingId)
            .then(setStats)
            .finally(() => setLoading(false));
    }, [buildingId]);

    if (loading) return <Spinner fullPage />;
    if (!stats) return <p className="text-red-500">Không tải được dữ liệu.</p>;

    const { overview, financials, operations, revenueChart, occupancyByBuilding } = stats;

    return (
        <div className="space-y-6">
            {/* Header + filter */}
            <div className="flex items-center justify-between">
                <h1>Dashboard Tổng Quan</h1>
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

            {/* Overview KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="domain" label="Tòa nhà đang hoạt động" value={overview.totalBuildings} />
                <StatCard icon="apartment" label="Tổng căn hộ" value={overview.totalApartments} />
                <StatCard icon="groups_2" label="Cư dân đang sinh sống" value={overview.totalResidents} />
                <StatCard
                    icon="bar_chart_4_bars"
                    label="Tỷ lệ lấp đầy"
                    value={formatPercent(overview.occupancyRate)}
                    color="text-success"
                />
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="description" label="Đã lập hợp đồng" value={formatCurrency(financials.currentMonthBilled)} />
                <StatCard
                    icon="payments"
                    label="Đã thu"
                    value={formatCurrency(financials.currentMonthCollected)}
                    color="text-success"
                    sub={`Tỷ lệ ${formatPercent(financials.currentMonthCollectionRate)}`}
                />
                <StatCard
                    icon="warning"
                    label="Tổng công nợ"
                    value={formatCurrency(financials.outstandingDebt)}
                    color="text-danger"
                    sub={`${financials.totalDebtors} căn hộ đang nợ`}
                />
                <StatCard
                    icon="support_agent"
                    label="Yêu cầu đang chờ"
                    value={operations.pendingServiceRequests + operations.inProgressServiceRequests}
                    sub={`${operations.pendingVehicleApprovals} xe · ${operations.pendingServiceRegistrations} dịch vụ chờ duyệt`}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue chart */}
                <div className="card lg:col-span-2">
                    <h3 className="mb-4">📈 Doanh thu 6 tháng gần nhất</h3>
                    <RevenueBarChart data={revenueChart} />
                </div>

                {/* Occupancy chart */}
                <div className="card">
                    <h3 className="mb-4">Tỷ lệ lấp đầy theo tòa</h3>
                    <div className="space-y-3">
                        {occupancyByBuilding.map((b) => (
                            <div key={b.buildingId}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{b.buildingName}</span>
                                    <span className="text-gray-500">{formatPercent(b.occupancyRate)}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${b.occupancyRate}%`,
                                            backgroundColor:
                                                b.occupancyRate >= 80 ? "#27AE60" : b.occupancyRate >= 50 ? "#CA6F1E" : "#C0392B",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Occupancy Pie (tổng hợp) */}
            {overview.totalApartments > 0 && (
                <div className="card max-w-full">
                    <h3 className="mb-4">Cơ cấu căn hộ</h3>
                    <OccupancyPieChart
                        occupied={overview.occupiedApartments}
                        available={overview.availableApartments}
                        maintenance={overview.maintenanceApartments}
                        reserved={overview.reservedApartments}
                    />
                </div>
            )}
        </div>
    );
}

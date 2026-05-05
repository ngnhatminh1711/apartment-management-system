import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../../components/common/Spinner";
import { StatCard } from "../../components/common/StatCard";
import { managerDashboardService } from "../../services/manager/dashboardService";
import type { ManagerDashboard } from "../../types/manager";
import { formatCurrency, formatDateTime, formatPercent } from "../../utils/formatters";

export function ManagerDashboardPage() {
    const [data, setData] = useState<ManagerDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        managerDashboardService
            .get()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner fullPage />;
    if (!data) return <p className="text-red-500">Không tải được dữ liệu.</p>;

    const { building, apartments, billing, requests, pendingApprovals, recentActivity } = data;

    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1>Tổng quan – {building.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">Ban quản lý tòa nhà</p>
            </div>

            {/* Apartment KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="apartment" label="Tổng căn hộ" value={apartments.total} />
                <StatCard icon="groups" label="Đang có cư dân" value={apartments.occupied} color="text-primary" />
                <StatCard icon="door_open" label="Còn trống" value={apartments.available} color="text-success" />
                <StatCard
                    icon="bar_chart_4_bars"
                    label="Tỷ lệ lấp đầy"
                    value={formatPercent(apartments.occupancyRate)}
                    color="text-primary"
                />
            </div>

            {/* Billing KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon="description"
                    // label={`Đã lập HĐ (${billing.currentMonth})`}
                    label="Đã lập hợp đồng"
                    value={formatCurrency(billing.totalBilled)}
                />
                <StatCard
                    icon="payments"
                    label="Đã thu được"
                    value={formatCurrency(billing.totalCollected)}
                    color="text-success"
                    sub={`Tỷ lệ ${formatPercent(billing.collectionRate)}`}
                />
                <StatCard
                    icon="hourglass_empty"
                    label="Chờ thanh toán"
                    value={`${billing.pendingCount} HĐ`}
                    color="text-warning"
                />
                <StatCard
                    icon="warning"
                    label="Quá hạn"
                    value={`${billing.overdueCount} HĐ`}
                    color="text-danger"
                    sub={formatCurrency(billing.overdueAmount)}
                />
            </div>

            {/* Operations + Approvals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Requests */}
                <div className="card">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="flex items-center">
                            <span className="material-symbols-outlined">support_agent</span> Yêu cầu cư dân
                        </h3>
                        <Link to="/manager/service-requests" className="text-xs text-primary hover:underline">
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: "Chờ tiếp nhận", val: requests.pendingCount, color: "text-warning", bg: "bg-yellow-50" },
                            { label: "Đang xử lý", val: requests.inProgressCount, color: "text-primary", bg: "bg-blue-50" },
                            {
                                label: "Giải quyết tuần này",
                                val: requests.resolvedThisWeek,
                                color: "text-success",
                                bg: "bg-green-50",
                            },
                        ].map(({ label, val, color, bg }) => (
                            <div key={label} className={`flex justify-between items-center px-3 py-2 rounded-lg ${bg}`}>
                                <span className="text-sm text-gray-600">{label}</span>
                                <span className={`text-xl font-bold ${color}`}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined">pending_actions</span> Chờ phê duyệt
                    </h3>
                    <div className="space-y-3">
                        <Link
                            to="/manager/vehicles?status=PENDING_APPROVAL"
                            className="flex items-center justify-between p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl material-symbols-outlined">directions_car</span>
                                <span className="text-sm font-medium">Đăng ký xe chờ duyệt</span>
                            </div>
                            <span className="text-xl font-bold text-orange-600">{pendingApprovals.vehicleCount}</span>
                        </Link>
                        <Link
                            to="/manager/service-registrations?status=PENDING"
                            className="flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl material-symbols-outlined">build</span>
                                <span className="text-sm font-medium">Đăng ký dịch vụ chờ duyệt</span>
                            </div>
                            <span className="text-xl font-bold text-purple-600">{pendingApprovals.serviceRegistrationCount}</span>
                        </Link>
                    </div>
                </div>

                {/* Occupancy visual */}
                <div className="card">
                    <h3 className="mb-3 flex items-center">
                        <span className="material-symbols-outlined">analytics</span> Tình trạng căn hộ
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: "Đang có cư dân", val: apartments.occupied, total: apartments.total, color: "bg-primary" },
                            { label: "Đã đặt", val: apartments.reserved, total: apartments.total, color: "bg-primary" },
                            { label: "Còn trống", val: apartments.available, total: apartments.total, color: "bg-success" },
                            { label: "Bảo trì", val: apartments.maintenance, total: apartments.total, color: "bg-warning" },
                        ].map(({ label, val, total, color }) => (
                            <div key={label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{label}</span>
                                    <span className="font-medium">
                                        {val} / {total}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${color}`}
                                        style={{ width: `${total > 0 ? (val / total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div className="card">
                    <h3 className="mb-4">🕐 Hoạt động gần đây</h3>
                    <div className="space-y-2 divide-y divide-gray-50">
                        {recentActivity.slice(0, 8).map((a, i) => (
                            <div key={i} className="flex items-start gap-3 py-2 first:pt-0">
                                <span className="text-lg">
                                    {a.type === "NEW_REQUEST" ? "🔧" : a.type === "PAYMENT" ? "💰" : "📋"}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">{a.message}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(a.time)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

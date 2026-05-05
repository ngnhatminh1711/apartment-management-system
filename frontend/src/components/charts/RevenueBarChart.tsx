import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardStats, RevenuePeriod } from "../../types/admin";
import { formatCurrency } from "../../utils/formatters";

type DashboardRevenuePoint = DashboardStats["revenueChart"][number];

type Props = {
    data: RevenuePeriod[] | DashboardRevenuePoint[];
};

const formatAxis = (value: number) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(0)}M` : `${value / 1_000}K`);

const toNumber = (value: unknown) => (typeof value === "number" ? value : Number(value ?? 0));

export function RevenueBarChart({ data }: Props) {
    const normalizedData = data.map((item) =>
        "period" in item
            ? item
            : {
                  period: item.month,
                  totalBilled: item.billed,
                  totalCollected: item.collected,
              },
    );

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={normalizedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatAxis} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(toNumber(value))} />
                <Legend />
                <Bar dataKey="totalBilled" name="Đã lập hóa đơn" fill="#2E75B6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalCollected" name="Đã thu" fill="#27AE60" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

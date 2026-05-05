import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
    occupied: number;
    available: number;
    maintenance: number;
    reserved?: number;
}

const COLORS = ["#2E75B6", "#27AE60", "#F39C12", "#8E44AD"];

export function OccupancyPieChart({ occupied, available, maintenance, reserved = 0 }: Props) {
    const data = [
        { name: "Đang ở", value: occupied },
        { name: "Trống", value: available },
        { name: "Bảo trì", value: maintenance },
        { name: "Giữ chỗ", value: reserved },
    ].filter((item) => item.value > 0);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}

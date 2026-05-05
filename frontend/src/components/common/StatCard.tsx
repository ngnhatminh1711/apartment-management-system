interface Props {
    icon: string;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
}

export function StatCard({ icon, label, value, sub, color = "text-primary" }: Props) {
    return (
        <div className="card flex items-center gap-4">
            <div className="text-3xl">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

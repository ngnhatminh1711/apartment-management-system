import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/constants";

interface Props {
    title?: string;
}

export function Header({ title }: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            {title && <h1 className="text-lg font-semibold text-gray-800">{title}</h1>}
            <div className="flex-1" />

            <div className="flex items-center gap-4">
                <button className="p-2 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="bg-black/30 w-px h-9"></div>
                {/* User info */}
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">
                        {user?.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                    </p>
                </div>

                {/* Avatar */}
                <div
                    className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center
                        text-primary font-semibold text-sm"
                >
                    {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                </div>
            </div>
        </header>
    );
}

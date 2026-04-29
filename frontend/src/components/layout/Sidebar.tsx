import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
    label: string;
    path: string;
    icon: string;
}

interface Props {
    title: string;
    nav: NavItem[];
    color?: string;
}

export function Sidebar({ title, nav, color = "bg-secondary" }: Props) {
    const { logout } = useAuth();

    return (
        <aside className={`w-1/7 min-w-fit min-h-screen flex flex-col ${color} text-white shadow-lg`}>
            {/* Logo / Title */}
            <div className="py-10 px-4">
                <h1 className="text-lg font-semibold leading-tight text-primary">{title}</h1>
                <p className="text-slate-500 text-sm">Hệ thống quản lý chung cư</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {nav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path.split("/").length === 2} // exact match cho root path
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white text-indigo-700 shadow-lg"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1 transition-transform duration-200",
                            )
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span className="font-semibold">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div>
                <button
                    onClick={logout}
                    className="flex w-full bg-primary-dark items-center gap-3 px-4 py-10 text-sm text-slate-500 font-medium hover:text-red-700 hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                    title="Đăng xuất"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}

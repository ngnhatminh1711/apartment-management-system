import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ADMIN_NAV } from "../../utils/constants";

export function AdminLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar title="Đại học Mở" nav={ADMIN_NAV} color="bg-primary-dark" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

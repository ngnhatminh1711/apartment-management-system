import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Auth
import { LoginPage } from "../pages/auth/LoginPage";

// Layouts
import { AdminLayout } from "../components/layout/AdminLayout";
import { ManagerLayout } from "../components/layout/ManagerLayout";
import { ResidentLayout } from "../components/layout/ResidentLayout";

// Guards
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";

// Admin pages
import { AdminDashboardPage } from "../pages/admin/DashboardPage";
import { BuildingListPage } from "../pages/admin/buildings/BuildingListPage";

// Manager pages
import { ManagerDashboardPage } from "../pages/manager/DashboardPage";
import { AnnouncementFormPage } from "../pages/manager/announcements/AnnouncementFormPage";
import { AnnouncementListPage } from "../pages/manager/announcements/AnnouncementListPage";
import { ApartmentDetailPage } from "../pages/manager/apartments/ApartmentDetailPage";
import { ApartmentListPage as ManagerApartmentList } from "../pages/manager/apartments/ApartmentListPage";
import { ResidentDetailPage } from "../pages/manager/residents/ResidentDetailPage";
import { ResidentListPage } from "../pages/manager/residents/ResidentListPage";

// Resident pages
import { BuildingFormPage } from "../pages/admin/buildings/BuildingFormPage";
import { ResidentDashboardPage } from "../pages/resident/DashboardPage";

const router = createBrowserRouter([
    // ── Public ──────────────────────────────────────────────────────────────
    { path: "/login", element: <LoginPage /> },
    {
        path: "/unauthorized",
        element: (
            <div className="flex h-screen items-center justify-center text-xl text-red-500">403 – Không có quyền truy cập</div>
        ),
    },

    // ── Admin ────────────────────────────────────────────────────────────────
    {
        path: "/admin",
        element: (
            <PrivateRoute>
                <RoleRoute allowedRoles={["ROLE_ADMIN"]}>
                    <AdminLayout />
                </RoleRoute>
            </PrivateRoute>
        ),
        children: [
            { index: true, element: <AdminDashboardPage /> },
            // Buildings
            { path: "buildings", element: <BuildingListPage /> },
            { path: "buildings/new", element: <BuildingFormPage /> },
            { path: "buildings/:id/edit", element: <BuildingFormPage /> },
        ],
    },

    // ── Manager ──────────────────────────────────────────────────────────────
    {
        path: "/manager",
        element: (
            <PrivateRoute>
                <RoleRoute allowedRoles={["ROLE_MANAGER"]}>
                    <ManagerLayout />
                </RoleRoute>
            </PrivateRoute>
        ),
        children: [
            { index: true, element: <ManagerDashboardPage /> },

            // Apartments
            { path: "apartments", element: <ManagerApartmentList /> },
            { path: "apartments/:id", element: <ApartmentDetailPage /> },

            // Residents
            { path: "residents", element: <ResidentListPage /> },
            { path: "residents/:id", element: <ResidentDetailPage /> },

            // Announcements
            { path: "announcements", element: <AnnouncementListPage /> },
            { path: "announcements/new", element: <AnnouncementFormPage /> },
            { path: "announcements/:id/edit", element: <AnnouncementFormPage /> },
        ],
    },

    // ── Resident ─────────────────────────────────────────────────────────────
    {
        path: "/resident",
        element: (
            <PrivateRoute>
                <RoleRoute allowedRoles={["ROLE_RESIDENT"]}>
                    <ResidentLayout />
                </RoleRoute>
            </PrivateRoute>
        ),
        children: [{ index: true, element: <ResidentDashboardPage /> }],
    },

    // ── Redirect root ────────────────────────────────────────────────────────
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "*", element: <Navigate to="/login" replace /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

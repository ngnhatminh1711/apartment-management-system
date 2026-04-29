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
import { ApartmentDetailPage as AdminApartmentDetailPage } from "../pages/admin/apartments/ApartmentDetailPage";
import { ApartmentFormPage } from "../pages/admin/apartments/ApartmentFormPage";
import { ApartmentListPage } from "../pages/admin/apartments/ApartmentListPage";
import { BuildingFormPage } from "../pages/admin/buildings/BuildingFormPage";
import { BuildingListPage } from "../pages/admin/buildings/BuildingListPage";
import { FeeConfigPage } from "../pages/admin/fee-configs/FeeConfigPage";
import { UserDetailPage } from "../pages/admin/users/UserDetailPage";
import { UserFormPage } from "../pages/admin/users/UserFormPage";
import { UserListPage } from "../pages/admin/users/UserListPage";

// Manager pages
import { ManagerDashboardPage } from "../pages/manager/DashboardPage";
import { AnnouncementFormPage } from "../pages/manager/announcements/AnnouncementFormPage";
import { AnnouncementListPage } from "../pages/manager/announcements/AnnouncementListPage";
import { ApartmentDetailPage } from "../pages/manager/apartments/ApartmentDetailPage";
import { ApartmentListPage as ManagerApartmentList } from "../pages/manager/apartments/ApartmentListPage";
import { ResidentDetailPage } from "../pages/manager/residents/ResidentDetailPage";
import { ResidentListPage } from "../pages/manager/residents/ResidentListPage";

// Resident pages
import BillDetailPage from "../pages/resident/Bill/BillDetailPage";
import BillPage from "../pages/resident/Bill/BillPage";
import { ResidentDashboardPage } from "../pages/resident/DashboardPage";
import NotificationPage from "../pages/resident/Notification/NotificationPage";
import PaymentBillPage from "../pages/resident/Payment/PaymentBillPage";
import PaymentPage from "../pages/resident/Payment/PaymentPage";
import ServiceRegistrationPage from "../pages/resident/ServiceRegistration/ServiceRegistrationPage";
import ServiceRequestDetailPage from "../pages/resident/ServiceRequest/ServiceRequestDetailPage";
import ServiceRequestPage from "../pages/resident/ServiceRequest/ServiceRequestPage";
import VehiclePage from "../pages/resident/Vehicle/VehiclePage";

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

            // Apartments
            { path: "apartments", element: <ApartmentListPage /> },
            { path: "apartments/new", element: <ApartmentFormPage /> },
            { path: "apartments/:id", element: <AdminApartmentDetailPage /> },
            { path: "apartments/:id/edit", element: <ApartmentFormPage /> },

            // Users
            { path: "users", element: <UserListPage /> },
            { path: "users/new", element: <UserFormPage /> },
            { path: "users/:id", element: <UserDetailPage /> },
            { path: "users/:id/edit", element: <UserFormPage /> },

            // Other
            { path: "fee-configs", element: <FeeConfigPage /> },
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
        children: [
            { index: true, element: <ResidentDashboardPage /> },
            { path: "bills", element: <BillPage /> },
            { path: "bills/:id", element: <BillDetailPage /> },
            { path: "bills/:id/payment", element: <PaymentBillPage /> },
            { path: "payments", element: <PaymentPage /> },
            { path: "notifications", element: <NotificationPage /> },
            { path: "vehicles", element: <VehiclePage /> },
            { path: "service-registrations", element: <ServiceRegistrationPage /> },
            { path: "service-requests", element: <ServiceRequestPage /> },
            { path: "service-requests/:id", element: <ServiceRequestDetailPage /> },
        ],
    },

    // ── Redirect root ────────────────────────────────────────────────────────
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "*", element: <Navigate to="/login" replace /> },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

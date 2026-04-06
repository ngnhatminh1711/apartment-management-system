import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/common";

interface Props {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function RoleRoute({ children, allowedRoles }: Props) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

    const hasRole = user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to="/unauthorized" replace />;

    return <>{children}</>;
}

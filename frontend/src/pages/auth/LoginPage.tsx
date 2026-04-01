import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import type { LoginRequest } from "../../types/auth";
import type { UserRole } from "../../types/common";

const ROLE_HOME: Record<UserRole, string> = {
    ROLE_ADMIN: "/admin",
    ROLE_MANAGER: "/manager",
    ROLE_RESIDENT: "/resident",
};

export function LoginPage() {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>();

    // Nếu đã login, redirect về home tương ứng
    if (isAuthenticated && user) {
        const home = ROLE_HOME[user.roles[0]] ?? "/";
        navigate(home, { replace: true });
        return null;
    }

    const onSubmit = async (data: LoginRequest) => {
        setError("");
        setLoading(true);
        try {
            const res = await login(data);
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
            const home = from ?? ROLE_HOME[res.user.roles[0]] ?? "/";
            navigate(home, { replace: true });
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-primary-dark to-primary
                    flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🏢</div>
                    <h1 className="text-2xl font-bold text-gray-900">Apartment Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Đăng nhập để tiếp tục</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            placeholder="admin@apartment.com"
                            className="input-field"
                            {...register("email", {
                                required: "Email là bắt buộc",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Email không hợp lệ",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="label">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input-field"
                            {...register("password", { required: "Mật khẩu là bắt buộc" })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="bg-red-50 border border-red-200 text-red-700 text-sm
                            rounded-lg px-4 py-3"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-base"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                {/* Demo hint */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
                    <p className="font-medium text-gray-600">Tài khoản demo:</p>
                    <p>
                        Admin: <code>admin@apartment.com</code> / <code>Admin@123456</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

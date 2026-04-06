import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { storage } from "../utils/storage";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: gắn JWT ──────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (err) => Promise.reject(err),
);

// ── Response interceptor: xử lý lỗi chung ────────────────────────────────
axiosInstance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const status = error.response?.status;

        // 401 → thử refresh token
        if (status === 401) {
            const refreshToken = storage.getRefreshToken();
            if (refreshToken) {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
                        { refreshToken },
                    );
                    const { accessToken } = res.data.data;
                    storage.setToken(accessToken);
                    // Retry original request
                    if (error.config) {
                        error.config.headers.Authorization = `Bearer ${accessToken}`;
                        return axiosInstance(error.config);
                    }
                } catch {
                    storage.clear();
                    window.location.href = "/login";
                }
            } else {
                storage.clear();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;

import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";

// ── Tiền tệ ────────────────────────────────────────────────────────────────
export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export const formatNumber = (n: number): string => new Intl.NumberFormat("vi-VN").format(n);

// ── Ngày tháng ────────────────────────────────────────────────────────────
export const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "—";
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, "dd/MM/yyyy", { locale: vi }) : "—";
};

export const formatDateTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "—";
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, "HH:mm dd/MM/yyyy", { locale: vi }) : "—";
};

export const formatBillingMonth = (dateStr: string): string => {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, "MM/yyyy") : dateStr;
};

// ── Số điện thoại ─────────────────────────────────────────────────────────
export const formatPhone = (phone: string | null | undefined): string => {
    if (!phone) return "—";
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
};

// ── Diện tích ─────────────────────────────────────────────────────────────
export const formatArea = (m2: number): string => `${m2} m²`;

// ── Phần trăm ─────────────────────────────────────────────────────────────
export const formatPercent = (value: number, decimals = 1): string => `${value.toFixed(decimals)}%`;

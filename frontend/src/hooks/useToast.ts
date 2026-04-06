import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

let nextId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const show = useCallback((message: string, type: ToastType = "info") => {
        const id = ++nextId;
        setToasts((t) => [...t, { id, type, message }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    }, []);

    const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

    return {
        toasts,
        success: (msg: string) => show(msg, "success"),
        error: (msg: string) => show(msg, "error"),
        warning: (msg: string) => show(msg, "warning"),
        info: (msg: string) => show(msg, "info"),
        dismiss,
    };
}

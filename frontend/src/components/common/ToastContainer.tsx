import clsx from "clsx";
import type { Toast } from "../../hooks/useToast";

const COLORS = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
};

const ICONS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };

interface Props {
    toasts: Toast[];
    dismiss: (id: number) => void;
}

export function ToastContainer({ toasts, dismiss }: Props) {
    return (
        <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={clsx(
                        "flex items-start gap-3 min-w-70 max-w-sm px-4 py-3",
                        "rounded-xl border shadow-lg animate-slide-in",
                        COLORS[t.type],
                    )}
                >
                    <span>{ICONS[t.type]}</span>
                    <p className="text-sm flex-1">{t.message}</p>
                    <button
                        onClick={() => dismiss(t.id)}
                        className="opacity-60 hover:opacity-100 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

import { useCallback, useEffect, useRef, useState } from "react";
import PaymentService from "../../services/resident/PaymentService";
import type { PaymentQrData } from "../../types/payment";
import { formatCurrency } from "../../utils/formatters";
import { Modal } from "../common/Modal";
import { Spinner } from "../common/Spinner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    billId: number;
    amount?: number;
    onSuccess: () => void; // Callback khi thanh toán thành công
}

type StepState = "loading" | "qr" | "success" | "error" | "expired";

const POLL_INTERVAL_MS = 3000; // 3 giây
const MAX_POLL_COUNT = 300; // 15 phút / 3s = 300 lần

export function SepayQrModal({ isOpen, onClose, billId, amount, onSuccess }: Props) {
    const [step, setStep] = useState<StepState>("loading");
    const [qrData, setQrData] = useState<PaymentQrData | null>(null);
    const [error, setError] = useState("");
    const [countdown, setCd] = useState(0);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollCountRef = useRef(0);

    // ── Cleanup polling khi đóng modal ───────────────────────────────────────
    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    // ── Bắt đầu polling status ────────────────────────────────────────────────
    const startPolling = useCallback(
        (paymentId: number) => {
            pollCountRef.current = 0;
            pollRef.current = setInterval(async () => {
                pollCountRef.current += 1;

                if (pollCountRef.current >= MAX_POLL_COUNT) {
                    stopPolling();
                    setStep("expired");
                    return;
                }

                try {
                    const statusData = await PaymentService.checkPaymentStatus(paymentId);
                    if (statusData.status === "SUCCESS") {
                        stopPolling();
                        setStep("success");
                        setTimeout(onSuccess, 2000);
                    } else if (statusData.status === "FAILED") {
                        stopPolling();
                        setStep("error");
                        setError("Giao dịch thất bại.");
                    }
                } catch {
                    // Bỏ qua lỗi mạng tạm thời khi polling
                }
            }, POLL_INTERVAL_MS);
        },
        [stopPolling, onSuccess],
    );

    // ── Khởi tạo QR khi mở modal ─────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) {
            stopPolling();
            setStep("loading");
            setQrData(null);
            return;
        }

        (async () => {
            try {
                const data = await PaymentService.initSepayPayment({ billId, amount });
                setQrData(data);
                setStep("qr");

                // Tính countdown
                const msLeft = new Date(data.expiredAt).getTime() - Date.now();
                setCd(Math.floor(msLeft / 1000));

                startPolling(data.paymentId);
            } catch (e: unknown) {
                const msg =
                    (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                    "Không thể tạo QR thanh toán";
                setError(msg);
                setStep("error");
            }
        })();

        return () => stopPolling();
    }, [isOpen, billId, amount, startPolling, stopPolling]);

    // ── Countdown timer ───────────────────────────────────────────────────────
    useEffect(() => {
        if (step !== "qr" || countdown <= 0) return;
        const t = setInterval(
            () =>
                setCd((c) => {
                    if (c <= 1) {
                        clearInterval(t);
                        setStep("expired");
                        stopPolling();
                        return 0;
                    }
                    return c - 1;
                }),
            1000,
        );
        return () => clearInterval(t);
    }, [step, countdown, stopPolling]);

    // ── Format countdown mm:ss ────────────────────────────────────────────────
    const fmtCountdown = (secs: number) => {
        const m = Math.floor(secs / 60)
            .toString()
            .padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                stopPolling();
                onClose();
            }}
            title="Thanh toán qua Chuyển khoản"
            size="lg"
        >
            {/* Loading */}
            {step === "loading" && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <Spinner size="lg" />
                    <p className="text-gray-500 text-sm">Đang tạo QR thanh toán...</p>
                </div>
            )}

            {/* QR Code */}
            {step === "qr" && qrData && (
                <div className="space-y-4">
                    {/* Số tiền */}
                    <div className="bg-primary/5 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">Số tiền cần chuyển khoản</p>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(qrData.amount)}</p>
                    </div>

                    {/* QR Image */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="border-4 border-primary/20 rounded-2xl p-2 bg-white shadow-sm">
                            <img
                                src={qrData.qrImageUrl}
                                alt="QR Code thanh toán"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.transferContent)}`;
                                }}
                            />
                        </div>
                        {/* Countdown */}
                        <div
                            className={`flex items-center gap-2 text-sm font-medium ${countdown < 60 ? "text-danger" : "text-gray-500"}`}
                        >
                            <span className="material-symbols-outlined">timelapse</span>
                            <span>QR hết hạn sau {fmtCountdown(countdown)}</span>
                        </div>
                    </div>

                    {/* Thông tin chuyển khoản */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <p className="font-semibold text-gray-700 mb-3">📋 Thông tin chuyển khoản</p>
                        {[
                            { label: "Ngân hàng", value: qrData.bankCode },
                            { label: "Số TK", value: qrData.accountNumber },
                            { label: "Chủ TK", value: qrData.accountName },
                            { label: "Số tiền", value: formatCurrency(qrData.amount) },
                            { label: "Nội dung", value: qrData.transferContent },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center">
                                <span className="text-gray-500">{label}:</span>
                                <span
                                    className="font-medium text-gray-800 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => navigator.clipboard?.writeText(value)}
                                    title="Click để copy"
                                >
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Hướng dẫn */}
                    <div className="bg-blue-50 text-blue-700 text-xs px-4 py-3 rounded-xl leading-relaxed flex items-center flex-wrap whitespace-pre-wrap">
                        <span className="material-symbols-outlined">info</span> <strong>Lưu ý quan trọng: </strong> Nhập đúng{" "}
                        <strong>nội dung chuyển khoản</strong>{" "}
                        <code className="bg-blue-100 px-1 rounded">{qrData.transferContent}</code> để hệ thống tự động xác nhận.
                        Trang sẽ tự cập nhật khi nhận được thanh toán.
                    </div>

                    {/* Indicator đang chờ */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-green-400 inline-block" />
                        Đang chờ xác nhận giao dịch...
                    </div>
                </div>
            )}

            {/* Success */}
            {step === "success" && (
                <div className="flex flex-col items-center gap-4 py-10">
                    <div className="text-6xl animate-bounce material-symbols-outlined">check_circle</div>
                    <h3 className="text-xl font-bold text-success">Thanh toán thành công!</h3>
                    <p className="text-gray-500 text-sm text-center">
                        Giao dịch đã được xác nhận. Hóa đơn của bạn đã được cập nhật.
                    </p>
                </div>
            )}

            {/* Expired */}
            {step === "expired" && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-5xl material-symbols-outlined">timer_off</div>
                    <h3 className="text-lg font-bold text-warning">QR đã hết hạn</h3>
                    <p className="text-gray-500 text-sm text-center">
                        Mã QR đã hết hiệu lực sau 15 phút. Vui lòng tạo lại để tiếp tục thanh toán.
                    </p>
                    <button
                        onClick={() => {
                            setStep("loading");
                            setQrData(null);
                        }}
                        className="btn-primary flex items-center"
                    >
                        <span className="material-symbols-outlined">refresh</span> Tạo lại QR
                    </button>
                </div>
            )}

            {/* Error */}
            {step === "error" && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-5xl material-symbols-outlined">cancel</div>
                    <h3 className="text-lg font-bold text-danger">Có lỗi xảy ra</h3>
                    <p className="text-gray-500 text-sm text-center">{error}</p>
                    <button onClick={onClose} className="btn-secondary">
                        Đóng
                    </button>
                </div>
            )}
        </Modal>
    );
}

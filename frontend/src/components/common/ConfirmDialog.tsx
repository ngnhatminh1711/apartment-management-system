import { Modal } from "./Modal";

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    danger?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "Xác nhận",
    danger = false,
}: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="btn-secondary">
                    Huỷ
                </button>
                <button onClick={onConfirm} className={danger ? "btn-danger" : "btn-primary"}>
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    );
}

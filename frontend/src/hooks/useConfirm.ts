import { useState, useCallback } from "react";

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

const INITIAL: ConfirmState = {
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
};

export function useConfirm() {
    const [state, setState] = useState<ConfirmState>(INITIAL);

    const confirm = useCallback(
        (title: string, message: string): Promise<boolean> =>
            new Promise((resolve) => {
                setState({
                    isOpen: true,
                    title,
                    message,
                    onConfirm: () => {
                        setState(INITIAL);
                        resolve(true);
                    },
                });
            }),
        [],
    );

    const cancel = useCallback(() => setState(INITIAL), []);

    return { confirmState: state, confirm, cancel };
}

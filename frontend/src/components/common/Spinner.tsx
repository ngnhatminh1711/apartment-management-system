import clsx from "clsx";

interface Props {
    size?: "sm" | "md" | "lg";
    fullPage?: boolean;
}

const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function Spinner({ size = "md", fullPage }: Props) {
    const spinner = (
        <div
            className={clsx(
                "animate-spin rounded-full border-2 border-gray-200 border-t-primary",
                sizes[size],
            )}
        />
    );

    if (fullPage) {
        return <div className="flex h-screen items-center justify-center">{spinner}</div>;
    }

    return spinner;
}

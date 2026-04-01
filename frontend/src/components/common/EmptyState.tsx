interface Props {
    icon?: string;
    title: string;
    message?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon = "📭", title, message, action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            {message && <p className="text-sm text-gray-500 mb-4">{message}</p>}
            {action}
        </div>
    );
}

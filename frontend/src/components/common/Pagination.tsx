interface Props {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    name: string;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    totalElements,
    name,
    pageSize,
    onPageChange,
}: Props) {
    if (totalPages <= 1) return null;

    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
                Hiển thị{" "}
                <strong>
                    {start}–{end}
                </strong>{" "}
                / {totalElements} {name}
            </p>
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40
                     hover:bg-gray-50 transition-colors"
                >
                    ‹ Trước
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i;
                    return (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors
                ${
                    p === currentPage
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 hover:bg-gray-50"
                }`}
                        >
                            {p + 1}
                        </button>
                    );
                })}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40
                     hover:bg-gray-50 transition-colors"
                >
                    Sau ›
                </button>
            </div>
        </div>
    );
}

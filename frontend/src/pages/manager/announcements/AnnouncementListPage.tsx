import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/common/Badge";
import { EmptyState } from "../../../components/common/EmptyState";
import { Pagination } from "../../../components/common/Pagination";
import { Spinner } from "../../../components/common/Spinner";
import { ToastContainer } from "../../../components/common/ToastContainer";
import { usePagination } from "../../../hooks/usePagination";
import { useToast } from "../../../hooks/useToast";
import { managerAnnouncementService } from "../../../services/manager/announcementService";
import type { Announcement } from "../../../types/announcement";
import { ANNOUNCEMENT_PRIORITY_COLORS, ANNOUNCEMENT_PRIORITY_LABELS } from "../../../utils/constants";
import { formatDateTime } from "../../../utils/formatters";

export function AnnouncementListPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterPublished, setFilterPublished] = useState<boolean | undefined>(undefined);

    const toast = useToast();
    const pag = usePagination("publishedAt,desc");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await managerAnnouncementService.getAll({
                page: pag.page,
                size: pag.size,
                search: pag.search || undefined,
                isPublished: filterPublished,
            });
            setAnnouncements(data.content);
            setTotal(data.totalElements);
            setPages(data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách thông báo");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pag.page, pag.size, pag.search, filterPublished]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = async (id: number, currentState: boolean) => {
        try {
            await managerAnnouncementService.togglePublish(id);
            toast.success(currentState ? "Đã ẩn thông báo" : "Đã hiển thị thông báo");
            fetchData();
        } catch {
            toast.error("Có lỗi xảy ra");
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h1>Thông báo Tòa nhà</h1>
                <Link to="/manager/announcements/new" className="btn-primary">
                    + Tạo thông báo
                </Link>
            </div>

            {/* Filter */}
            <div className="card py-3 flex gap-3">
                <select
                    className="input-field w-48"
                    value={filterPublished === undefined ? "" : String(filterPublished)}
                    onChange={(e) => setFilterPublished(e.target.value === "" ? undefined : e.target.value === "true")}
                >
                    <option value="">Tất cả</option>
                    <option value="true">Đang hiển thị</option>
                    <option value="false">Đã ẩn</option>
                </select>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="py-16 flex justify-center">
                    <Spinner />
                </div>
            ) : announcements.length === 0 ? (
                <EmptyState
                    title="Chưa có thông báo nào"
                    action={
                        <Link to="/manager/announcements/new" className="btn-primary">
                            + Tạo thông báo
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="space-y-3">
                        {announcements.map((a) => (
                            <div key={a.id} className="card hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4">
                                    <Link to={`/manager/announcements/${a.id}/edit`}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <Badge
                                                    label={ANNOUNCEMENT_PRIORITY_LABELS[a.priority]}
                                                    className={ANNOUNCEMENT_PRIORITY_COLORS[a.priority]}
                                                />
                                                <Badge
                                                    label={a.isPublished ? "Đang hiển thị" : "Đã ẩn"}
                                                    className={
                                                        a.isPublished
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }
                                                />
                                            </div>
                                            <h3 className="text-gray-900 font-semibold leading-snug">{a.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                                <span>{formatDateTime(a.publishedAt)}</span>
                                                {a.expiresAt && <span>Hết hạn: {formatDateTime(a.expiresAt)}</span>}
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex gap-2 shrink-0">
                                        {/* <Link
                                            to={`/manager/announcements/${a.id}/edit`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Sửa
                                        </Link> */}
                                        <button
                                            onClick={() => handleToggle(a.id, a.isPublished)}
                                            className={`text-sm hover:underline ${a.isPublished ? "text-gray-500" : "text-green-600"}`}
                                        >
                                            {a.isPublished ? "Ẩn" : "Hiển thị"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card p-0">
                        <Pagination
                            currentPage={pag.page}
                            totalPages={totalPages}
                            totalElements={total}
                            name="Thông báo"
                            pageSize={pag.size}
                            onPageChange={pag.setPage}
                        />
                    </div>
                </>
            )}
            <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
        </div>
    );
}

import type { Notification } from "../../../types/notification";

type Props = {
  data: Notification;
  onClick?: (item: Notification) => void;
};

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Hôm nay" : `${days} ngày trước`;
}

const NotificationItem = ({ data, onClick }: Props) => {
  return (
    <div
      onClick={() => onClick?.(data)}
      className={`p-6 rounded-xl shadow-sm border flex gap-4 cursor-pointer transition
        ${data.isRead ? "bg-white opacity-70" : "bg-blue-50"}
      `}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-slate-400">
          ANNOUNCEMENT
        </span>
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[11px] text-slate-400 italic">
            {new Date(data.createdAt).toLocaleDateString()} :{" "}
            {formatTime(data.createdAt)}
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-slate-700 mb-1">
          {data.title}
        </h3>

        {data.content && (
          <p className="text-sm text-slate-500 leading-relaxed italic">
            {data.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;

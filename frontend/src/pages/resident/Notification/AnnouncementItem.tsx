import { useState } from "react";
import type { Announcement } from "../../../types/notification";

type Props = {
  data: Announcement;
};

function formatTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days === 0 ? "Hôm nay" : `${days} ngày trước`;
}

const AnnouncementItem = ({ data }: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="p-6 rounded-xl shadow-sm border flex gap-4 cursor-pointer transition bg-blue-50 hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-slate-400">
          campaign
        </span>
      </div>

      <div className="grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[11px] text-slate-400 italic">
            {new Date(data.publishedAt).toLocaleDateString()} :{" "}
            {formatTime(data.publishedAt)}
          </span>
        </div>

        <h3 className="text-[15px] font-bold text-slate-700 mb-1">
          {data.title}
        </h3>

        <p
          className={`text-sm text-slate-500 leading-relaxed italic whitespace-pre-line ${expanded ? "" : "line-clamp-3"}`}
        >
          {data.content}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementItem;

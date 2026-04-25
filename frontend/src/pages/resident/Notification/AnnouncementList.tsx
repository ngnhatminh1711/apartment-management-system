import type { Announcement } from "../../../types/notification";
import AnnouncementItem from "./AnnouncementItem";

type Props = {
  data: Announcement[];
};

const AnnouncementList = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-400 italic">
        Không có thông báo nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <AnnouncementItem key={item.id} data={item} />
      ))}
    </div>
  );
};

export default AnnouncementList;

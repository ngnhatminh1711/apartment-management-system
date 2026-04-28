import type { Notification } from "../../types/notification";
import NotificationItem from "./NotificationItem";

type Props = {
  data: Notification[];
  onItemClick: (item: Notification) => void;
};

const NotificationPage = ({ data, onItemClick }: Props) => {
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
        <NotificationItem
          key={item.id}
          data={item}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
};

export default NotificationPage;

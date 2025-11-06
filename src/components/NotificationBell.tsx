import React from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  count: number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
      aria-label={`Notifications (${count} unread)`}
    >
      <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />

      {count > 0 && (
        <>
          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
            {count > 99 ? "99+" : count}
          </span>

          {/* Pulse effect */}
          <span className="absolute -top-1 -right-1 bg-red-400 rounded-full w-5 h-5 animate-ping opacity-75"></span>
        </>
      )}
    </button>
  );
};

export default NotificationBell;

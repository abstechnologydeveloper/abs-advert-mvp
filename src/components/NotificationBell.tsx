// components/NotificationBell.tsx
import React from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, onClick }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;

import React from "react";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";
import NotificationBell from "../components/NotificationBell";
import { useGetUnreadCountQuery } from "../redux/notifications/notification-apis";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetStudentDetailsQuery();
  const { data: unreadData } = useGetUnreadCountQuery({});
  const notificationCount = unreadData?.data?.unreadCount || 0;

  if (isLoading) return <div className="p-4 text-gray-600">Loading student info...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load profile</div>;

  const student = data?.data;
  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

    const handleProfileClick = () => {
      navigate("/dashboard/settings");
    };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Profile Info */}
      <div className="flex items-center space-x-3">
        <img
          src={student?.profilePicture?.profilePicture || student?.avatar || "/default-avatar.png"}
          alt={student?.firstName || "Student"}
          className="w-12 h-12 rounded-full object-cover border border-gray-300"
        />
        <div className="leading-tight">
          <h1 className="text-lg font-semibold text-gray-800">
            {student?.firstName} {student?.lastName}
          </h1>
          <p className="text-sm text-gray-500">
            Hi, {student?.userName}! Ready to learn something new today?
          </p>
        </div>
      </div>

      {/* Right: Notifications */}
      <div className="flex items-center space-x-4">
        <NotificationBell count={notificationCount} onClick={handleNotificationClick} />
        <button
          className="hidden md:block text-sm text-gray-800 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition cursor-pointer"
          onClick={handleProfileClick}
        >
          View Profile
        </button>
      </div>
    </header>
  );
};

export default Header;

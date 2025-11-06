import React from "react";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";
import NotificationBell from "../components/NotificationBell";
import { useGetUnreadCountQuery } from "../redux/notifications/notification-apis";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentDetailsQuery();
  const { data: unreadData } = useGetUnreadCountQuery({});
  const notificationCount = unreadData?.data?.unreadCount || 0;

  const student = data?.data;
  console.log(data);

  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

  const handleProfileClick = () => {
    navigate("/dashboard/settings");
  };

  // Avatar Component (shared logic)
  const Avatar = () => {
    if (isLoading) {
      return <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />;
    }

    const profilePic = student?.profilePicture?.profilePicture || student?.avatar;
    const initials =
      `${student?.firstName?.[0] || ""}${student?.lastName?.[0] || ""}`.toUpperCase() || "U";

    return (
      <div
        className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white cursor-pointer hover:ring-blue-500 transition-all"
        onClick={handleProfileClick}
        title="View Profile"
      >
        {profilePic ? (
          <>
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                if (fallback) fallback.classList.remove("hidden");
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              {initials}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {initials}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Profile Info */}
        <div className="flex items-center space-x-4">
          <Avatar />

          {/* Greeting Text */}
          <div className="hidden sm:block">
            {isLoading ? (
              <>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-900">
                  {student?.firstName} {student?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Hi, {student?.userName}! Ready to learn something new today?
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="flex items-center space-x-3">
          <NotificationBell count={notificationCount} onClick={handleNotificationClick} />
          <button
            onClick={handleProfileClick}
            className="hidden md:block text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            View Profile
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

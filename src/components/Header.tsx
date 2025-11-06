import React from "react";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";
import { useGetUnreadCountQuery } from "../redux/notifications/notification-apis";
import { useNavigate } from "react-router-dom";
import { Bell, User, TrendingUp } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentDetailsQuery();
  const { data: unreadData } = useGetUnreadCountQuery({});
  const notificationCount = unreadData?.data?.unreadCount || 0;

  const student = data?.data;

  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

  const handleProfileClick = () => {
    navigate("/dashboard/settings");
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Avatar Component
  const Avatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };

    if (isLoading) {
      return <div className={`${sizes[size]} rounded-full bg-gray-200 animate-pulse`} />;
    }

    const profilePic = student?.profilePicture?.profilePicture || student?.avatar;
    const initials =
      `${student?.firstName?.[0] || ""}${student?.lastName?.[0] || ""}`.toUpperCase() || "U";

    return (
      <div
        className={`${sizes[size]} rounded-full overflow-hidden ring-2 ring-white shadow-lg cursor-pointer hover:ring-blue-500 transition-all group relative`}
        onClick={handleProfileClick}
        title="View Profile"
      >
        {profilePic ? (
          <>
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const fallback = (e.target as HTMLImageElement).nextElementSibling;
                if (fallback) fallback.classList.remove("hidden");
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {initials}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {initials}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-lg bg-white/95">
      <div className="px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Profile Info */}
          <div className="flex items-center space-x-4">
            <Avatar size="lg" />

            {/* Greeting & Stats */}
            <div className="hidden md:block">
              {isLoading ? (
                <>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <h1 className="text-lg font-bold text-gray-900">
                    {getGreeting()}, {student?.firstName || "User"}!
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Ready to boost your campaigns</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
              aria-label={`Notifications (${notificationCount} unread)`}
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* View Profile Button (Desktop) */}
            <button
              onClick={handleProfileClick}
              className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </button>

            {/* Mobile Profile Button */}
            <button
              onClick={handleProfileClick}
              className="lg:hidden p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Greeting */}
        <div className="md:hidden mt-3">
          {isLoading ? (
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <h2 className="text-base font-semibold text-gray-900">
              {getGreeting()}, {student?.firstName || "User"}!
            </h2>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

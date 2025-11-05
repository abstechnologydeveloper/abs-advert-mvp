/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AuthStorage } from "../utils/authStorage";
import { Bell } from "lucide-react";
import { useGetUnreadCountQuery } from "../redux/notifications/notification-apis";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const { data: unreadData } = useGetUnreadCountQuery({});
  const { data: userData, isLoading: userLoading } = useGetStudentDetailsQuery();
  const notificationCount = unreadData?.data?.unreadCount || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const student = userData?.data;

  useEffect(() => {
    const storedUser = AuthStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
      setTimeout(() => setIsLoading(false), 800);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-600 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const MenuIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

  // Avatar Component (used in mobile)
  const Avatar = () => {
    if (userLoading) {
      return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
    }

    const profilePic = student?.profilePicture?.profilePicture || student?.avatar;
    const initials =
      `${student?.firstName?.[0] || ""}${student?.lastName?.[0] || ""}`.toUpperCase() || "U";

    return profilePic ? (
      <img
        src={profilePic}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling!.classList.remove("hidden");
        }}
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white">
        {initials}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        onNavigate={(path) => navigate(`/dashboard/${path}`)}
        onLogout={onLogout}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="text-gray-600 hover:text-gray-800 transition"
              aria-label="Open menu"
            >
              {MenuIcon}
            </button>

            {/* Right Side: Notification + Profile */}
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <div
                className="relative cursor-pointer"
                onClick={handleNotificationClick}
                aria-label={`Notifications (${notificationCount} unread)`}
              >
                <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1 hover:bg-gray-50 rounded-lg p-1 transition"
                  aria-label="Profile menu"
                >
                  <Avatar />
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Avatar />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email || "User"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/dashboard/settings");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        AuthStorage.clearAuth();
                        onLogout();
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

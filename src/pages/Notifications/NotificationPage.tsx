/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Search,
  Calendar,
  AlertCircle,
  Clock,
  Send,
  XCircle,
  Ban,
  Loader2,
  RefreshCw,
  Filter,
  Zap,
} from "lucide-react";
import {
  useDeleteNotificationMutation,
  useDeleteReadNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useUpdateNotificationPreferencesMutation,
} from "../../redux/notifications/notification-apis";
import { AdsNotificationType } from "../../types/models";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | AdsNotificationType>("all");
  const [showPreferences, setShowPreferences] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // API Hooks
  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useGetNotificationsQuery({ page, limit, search: searchTerm });
  const { data: statsData } = useGetNotificationStatsQuery({});
  const { data: preferencesData } = useGetNotificationPreferencesQuery({});

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteReadNotifications] = useDeleteReadNotificationsMutation();
  const [updatePreferences] = useUpdateNotificationPreferencesMutation();

  const notifications = notificationsData?.data || [];
  const stats = statsData?.data;
  const preferences = preferencesData?.data;
  const pagination = notificationsData?.pagination;

  // Filter notifications
  const filteredNotifications =
    filterType === "all" ? notifications : notifications.filter((n) => n.type === filterType);

  const getNotificationIcon = (type: AdsNotificationType) => {
    switch (type) {
      case "SENT":
        return <Send className="w-5 h-5" />;
      case "SCHEDULED":
        return <Clock className="w-5 h-5" />;
      case "CREATED":
        return <Zap className="w-5 h-5" />;
      case "FAILED":
        return <XCircle className="w-5 h-5" />;
      case "APPROVED":
        return <CheckCheck className="w-5 h-5" />;
      case "CANCELLED":
        return <Ban className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationStyle = (type: AdsNotificationType) => {
    switch (type) {
      case "SENT":
        return {
          gradient: "from-green-500 to-emerald-500",
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          ring: "ring-green-500/20",
        };
      case "SCHEDULED":
        return {
          gradient: "from-blue-500 to-indigo-500",
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          ring: "ring-blue-500/20",
        };
      case "CREATED":
        return {
          gradient: "from-purple-500 to-pink-500",
          bg: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          ring: "ring-purple-500/20",
        };
      case "FAILED":
        return {
          gradient: "from-red-500 to-rose-500",
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          ring: "ring-red-500/20",
        };
      case "APPROVED":
        return {
          gradient: "from-teal-500 to-cyan-500",
          bg: "bg-teal-50",
          border: "border-teal-200",
          text: "text-teal-700",
          ring: "ring-teal-500/20",
        };
      case "CANCELLED":
        return {
          gradient: "from-gray-500 to-slate-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          ring: "ring-gray-500/20",
        };
      default:
        return {
          gradient: "from-gray-500 to-slate-500",
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          ring: "ring-gray-500/20",
        };
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({}).unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteNotification(id).unwrap();
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    }
  };

  const handleDeleteRead = async () => {
    if (window.confirm("Delete all read notifications?")) {
      try {
        await deleteReadNotifications({}).unwrap();
      } catch (error) {
        console.error("Failed to delete read notifications:", error);
      }
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    try {
      await updatePreferences({ [key]: value }).unwrap();
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              </div>
              <p className="text-gray-600">Stay updated with your campaign activities</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                    <Bell className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
                <p className="text-xs text-gray-600 font-medium">Total Notifications</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-1">{stats.unread}</p>
                <p className="text-xs text-gray-600 font-medium">Unread</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <CheckCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-1">{stats.read}</p>
                <p className="text-xs text-gray-600 font-medium">Read</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600 mb-1">{stats.byType.failed}</p>
                <p className="text-xs text-gray-600 font-medium">Failed</p>
              </div>
            </div>
          )}

          {/* Preferences Panel */}
          {showPreferences && preferences && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="SENT">Sent</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="CREATED">Created</option>
                  <option value="FAILED">Failed</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm font-medium text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
            <button
              onClick={handleDeleteRead}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear Read
            </button>
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const style = getNotificationStyle(notification.type);

              return (
                <div
                  onClick={() => {
                    if (notification.campaign.status !== "DRAFT")
                      navigate(`/dashboard/campaign/${notification.campaign.id}`);
                    else navigate(`/dashboard/edit-draft/${notification.campaign.id}`);
                  }}
                  key={notification.id}
                  className={`group bg-white rounded-2xl border ${
                    style.border
                  } p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${
                    !notification.isRead ? `ring-2 ${style.ring}` : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon with Gradient */}
                    <div
                      className={`shrink-0 p-3 bg-gradient-to-br ${style.gradient} rounded-xl text-white shadow-sm`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.isRead && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap font-medium">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>

                      {notification.campaign && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {notification.campaign.name}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 ${style.bg} ${style.text} rounded-lg font-medium`}
                          >
                            {notification.campaign.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!notification.isRead) handleMarkAsRead(notification.id);
                        }}
                        className={`p-2 rounded-xl transition-all ${
                          notification.isRead
                            ? "bg-green-50 text-green-600"
                            : "hover:bg-blue-50 text-gray-400 hover:text-blue-600"
                        }`}
                        title={notification.isRead ? "Read" : "Mark as read"}
                      >
                        {notification.isRead ? (
                          <CheckCheck className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{pagination.total}</span>{" "}
              notifications
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                Previous
              </button>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-sm">
                {page}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;

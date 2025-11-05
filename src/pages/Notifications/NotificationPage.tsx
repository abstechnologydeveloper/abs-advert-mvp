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
        return <Send className="w-6 h-6 text-green-500" />;
      case "SCHEDULED":
        return <Clock className="w-6 h-6 text-blue-500" />;
      case "CREATED":
        return <Bell className="w-6 h-6 text-purple-500" />;
      case "FAILED":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "APPROVED":
        return <CheckCheck className="w-6 h-6 text-teal-500" />;
      case "CANCELLED":
        return <Ban className="w-6 h-6 text-gray-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: AdsNotificationType) => {
    switch (type) {
      case "SENT":
        return "bg-green-50 border-green-200";
      case "SCHEDULED":
        return "bg-blue-50 border-blue-200";
      case "CREATED":
        return "bg-purple-50 border-purple-200";
      case "FAILED":
        return "bg-red-50 border-red-200";
      case "APPROVED":
        return "bg-teal-50 border-teal-200";
      case "CANCELLED":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-1">Stay updated with your campaign activities</p>
            </div>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Preferences
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unread</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Read</p>
                    <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                  </div>
                  <CheckCheck className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{stats.byType.failed}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>
          )}

          {/* Preferences Panel */}
          {showPreferences && preferences && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="SENT">Sent</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CREATED">Created</option>
                <option value="FAILED">Failed</option>
                <option value="APPROVED">Approved</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="w-5 h-5" />
                  Mark All Read
                </button>
                <button
                  onClick={handleDeleteRead}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Read
                </button>
                <button
                  onClick={() => refetch()}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const markIcon = notification.isRead ? (
                <CheckCheck className="w-6 h-6 text-green-500"  />
              ) : (
                <Check className="w-6 h-6 text-gray-600"  />
              );

              return (
                <div
                  onClick={() => {
                    if (notification.campaign.status !== "DRAFT")
                      navigate(`/dashboard/campaign/${notification.campaign.id}`);
                    else navigate(`/dashboard/edit-draft/${notification.campaign.id}`);
                  }}
                  key={notification.id}
                  className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                    !notification.isRead ? "border-l-4 border-l-blue-500" : "border-gray-200"
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                          {notification.campaign && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{notification.campaign.name}</span>
                              <span className="px-2 py-0.5 bg-gray-200 rounded">
                                {notification.campaign.status}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!notification.isRead) handleMarkAsRead(notification.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          notification.isRead
                            ? "bg-green-50 hover:bg-green-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {markIcon}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
              notifications
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

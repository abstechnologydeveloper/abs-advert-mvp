/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

import { Bell, Trash2, Check, Loader2 } from "lucide-react";
import { useDeleteAllNotificationsMutation, useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "../../redux/notifications/notification-apis";

const NotificationPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery({ page, limit: 10 });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const notifications = data?.data || [];
  const total = data?.meta?.total || 0;

  // === HANDLERS ===
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    refetch();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead({});
    refetch();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    refetch();
  };

  const handleDeleteAll = async () => {
    if (confirm("Delete all notifications?")) {
      await deleteAllNotifications({});
      refetch();
    }
  };

  // === LOADING STATE ===
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin w-8 h-8 mb-2" />
        Loading notifications...
      </div>
    );
  }

  // === EMPTY STATE ===
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Bell className="w-10 h-10 mb-2 text-gray-400" />
        <p>No notifications yet!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Notifications</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md transition"
          >
            <Check className="w-4 h-4 mr-1" /> Mark all as read
          </button>
          <button
            onClick={handleDeleteAll}
            className="flex items-center text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete all
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        {notifications.map((notif: any) => (
          <div
            key={notif.id}
            className={`flex justify-between items-start p-4 transition hover:bg-gray-50 ${
              notif.isRead ? "opacity-80" : "bg-blue-50"
            }`}
          >
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{notif.title}</p>
              <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-3 ml-4">
              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleDelete(notif.id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className={`px-4 py-2 text-sm rounded-md border ${
              page === 1 ? "text-gray-400 border-gray-200" : "text-blue-600 border-blue-300"
            }`}
          >
            Prev
          </button>
          <button
            disabled={notifications.length < 10}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 text-sm rounded-md border text-blue-600 border-blue-300"
          >
            Next
          </button>
        </div>
      )}

      {isFetching && (
        <div className="flex justify-center mt-3 text-gray-500 text-sm">
          Updating notifications...
        </div>
      )}
    </div>
  );
};

export default NotificationPage;

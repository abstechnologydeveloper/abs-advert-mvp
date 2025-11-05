import api from "../api";

export const notificationServiceApis = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/ads/notification/?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Notifications"],
    }),

    getNotificationById: builder.query({
      query: (id) => `/ads/notification/${id}`,
      providesTags: ["Notifications"],
    }),

    getUnreadCount: builder.query({
      query: () => `/ads/notification/unread-count`,
      providesTags: ["Notifications"],
    }),

    getRecentNotifications: builder.query({
      query: () => `/ads/notification/recent`,
      providesTags: ["Notifications"],
    }),

    getNotificationStats: builder.query({
      query: () => `/ads/notification/stats`,
      providesTags: ["Stats"],
    }),

    getNotificationsByType: builder.query({
      query: (type) => `/ads/notification/type?type=${type}`,
      providesTags: ["Notifications"],
    }),

    // ==========================
    // ✅ MARK READ
    // ==========================
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/ads/notification/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/ads/notification/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    // ==========================
    // 🗑️ DELETE NOTIFICATIONS
    // ==========================
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/ads/notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: `ads/notification/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    deleteNotificationsByType: builder.mutation({
      query: (type) => ({
        url: `/ads/notification/type/${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    deleteReadNotifications: builder.mutation({
      query: () => ({
        url: `/ads/notification/read/all`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "Stats"],
    }),

    // ==========================
    // ⚙️ PREFERENCES
    // ==========================
    getNotificationPreferences: builder.query({
      query: () => `/ads/notification/preferences`,
      providesTags: ["Preferences"],
    }),

    updateNotificationPreferences: builder.mutation({
      query: (data) => ({
        url: `/ads/notification/preferences`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Preferences"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetUnreadCountQuery,
  useGetRecentNotificationsQuery,
  useGetNotificationStatsQuery,
  useGetNotificationsByTypeQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useDeleteNotificationsByTypeMutation,
  useDeleteReadNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationServiceApis;

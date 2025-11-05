import api from "../api";

export const campaignServiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEmailCampaign: builder.mutation({
      query: (formData) => ({
        url: `/ads/campaigns`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Campaigns", "Stats", "Drafts", "History", "Notifications"],
    }),

    resendCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "History", "Stats", "Notifications"],
    }),

    approveCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "Stats", "Notifications"],
    }),

    cancelCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "Stats", "Notifications"],
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns", "Drafts", "History", "Stats", "Notifications"],
    }),

    getCampaignById: builder.query({
      query: (id) => {
        console.log("getCampaignById called with ID:", id);
        return `/ads/campaigns/${id}`;
      },
      providesTags: (id) => [{ type: "Campaigns", id }],
      // Force refetch on every mount to ensure fresh data
      keepUnusedDataFor: 0,
    }),

    getCampaignStatistics: builder.query({
      query: () => `/ads/campaigns/statistics`,
      providesTags: ["Stats"],
    }),

    // ==========================
    // 📝 DRAFT MANAGEMENT
    // ==========================
    saveDraft: builder.mutation({
      query: (data) => ({
        url: `/ads/campaigns/draft`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Drafts", "Stats"],
    }),

    updateDraft: builder.mutation({
      query: ({ id, data }) => {
        console.log("📤 updateDraft payload >>>", { id, data }); // 👈 add this line
        return {
          url: `/ads/campaigns/draft/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ({ id }) => ["Drafts", { type: "Campaigns", id }],
    }),

    getDrafts: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) =>
        `/ads/campaigns/drafts?page=${page}&limit=${limit}&search=${search}`,
      providesTags: ["Drafts"],
    }),

    // ==========================
    // 📜 HISTORY
    // ==========================
    getHistory: builder.query({
      query: ({ page = 1, limit = 10, status = "", search = "" }) =>
        `/ads/campaigns/history?page=${page}&limit=${limit}&status=${status}&search=${search}`,
      providesTags: ["History"],
    }),

    // ==========================
    // 🏫 SCHOOLS
    // ==========================
    getSchools: builder.query({
      query: () => `/ads/campaigns/schools`,
      providesTags: ["Schools"],
    }),

    uploadAttachments: builder.mutation({
      query: (formData: FormData) => ({
        url: `/ads/campaigns/upload`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateEmailCampaignMutation,
  useResendCampaignMutation,
  useApproveCampaignMutation,
  useCancelCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignByIdQuery,
  useGetCampaignStatisticsQuery,
  useSaveDraftMutation,
  useUpdateDraftMutation,
  useGetDraftsQuery,
  useGetHistoryQuery,
  useGetSchoolsQuery,
  useUploadAttachmentsMutation,
} = campaignServiceApi;

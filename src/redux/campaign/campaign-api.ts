import api from "../api";

export const campaignServiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createEmailCampaign: builder.mutation({
      query: (formData) => ({
        url: `/ads/campaigns`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Campaigns", "Stats"],
    }),

    resendCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "History", "Stats"],
    }),

    approveCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "Stats"],
    }),

    cancelCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Campaigns", "Stats"],
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/ads/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns", "Drafts", "History"],
    }),

    getCampaignById: builder.query({
      query: (id) => `/ads/campaigns/${id}`,
      providesTags: ["Campaigns"],
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
      invalidatesTags: ["Drafts"],
    }),

    updateDraft: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/ads/campaigns/draft/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Drafts"],
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
} = campaignServiceApi;

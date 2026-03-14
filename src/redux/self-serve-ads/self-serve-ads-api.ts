/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";

export type SelfServeAdChannel = "QUILLS" | "LIBRARY" | "OPPORTUNITIES" | "PUBLIC";
export type SelfServeAdStatus =
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "PAUSED"
  | "BUDGET_EXHAUSTED"
  | "COMPLETED"
  | "REJECTED";

export interface SelfServeAdCampaign {
  id: string;
  studentId: string;
  title: string;
  channel: SelfServeAdChannel;
  headline: string;
  bodyText: string;
  imageUrl?: string;
  imageUrls: string[];
  ctaUrl: string;
  totalBudget: number;
  dailyBudget?: number;
  spentAmount: number;
  status: SelfServeAdStatus;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelfServeAdWallet {
  id: string;
  studentId: string;
  balance: number;
  totalCredited: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelfServeAdWalletTransaction {
  id: string;
  walletId: string;
  type: "CREDIT" | "CAMPAIGN_SPEND";
  amount: number;
  reference?: string;
  campaignId?: string;
  description?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export interface CreateCampaignPayload {
  title: string;
  channel?: SelfServeAdChannel;
  targetChannels?: SelfServeAdChannel[];
  targetPages?: string[];
  headline: string;
  bodyText: string;
  imageUrls?: string[];
  ctaUrl: string;
  totalBudget: number;
  dailyBudget?: number;
  durationHours?: number;
  startDate?: string;
  endDate?: string;
}

export interface SelfServeAdCampaignWithTargets extends SelfServeAdCampaign {
  targetChannels: SelfServeAdChannel[];
}

export const selfServeAdsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Image Upload ─────────────────────────────────────────────────────────
    uploadAdImages: builder.mutation<
      { success: boolean; data: { urls: string[] } },
      FormData
    >({
      query: (formData) => ({
        url: "/self-serve-ads/upload",
        method: "POST",
        body: formData,
      }),
    }),

    // ── Wallet ──────────────────────────────────────────────────────────────
    getAdWallet: builder.query<
      { success: boolean; data: { wallet: SelfServeAdWallet; transactions: SelfServeAdWalletTransaction[] } },
      void
    >({
      query: () => "/self-serve-ads/wallet",
      providesTags: ["SelfServeAdWallet"],
    }),

    fundAdWallet: builder.mutation<
      { success: boolean; data: { authorizationUrl: string; reference: string; amountNGN: number } },
      { amountNGN: number; callbackUrl?: string }
    >({
      query: (body) => ({
        url: "/self-serve-ads/wallet/fund",
        method: "POST",
        body,
      }),
    }),

    // ── Campaigns ───────────────────────────────────────────────────────────
    getSelfServeCampaigns: builder.query<
      { success: boolean; data: SelfServeAdCampaign[] },
      void
    >({
      query: () => "/self-serve-ads/campaigns",
      providesTags: ["SelfServeAds"],
    }),

    createSelfServeCampaign: builder.mutation<
      { success: boolean; data: SelfServeAdCampaign },
      CreateCampaignPayload
    >({
      query: (body) => ({
        url: "/self-serve-ads/campaigns",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SelfServeAds", "SelfServeAdWallet"],
    }),

    pauseSelfServeCampaign: builder.mutation<
      { success: boolean; data: SelfServeAdCampaign },
      string
    >({
      query: (id) => ({
        url: `/self-serve-ads/campaigns/${id}/pause`,
        method: "POST",
      }),
      invalidatesTags: ["SelfServeAds"],
    }),

    resumeSelfServeCampaign: builder.mutation<
      { success: boolean; data: SelfServeAdCampaign },
      string
    >({
      query: (id) => ({
        url: `/self-serve-ads/campaigns/${id}/resume`,
        method: "POST",
      }),
      invalidatesTags: ["SelfServeAds"],
    }),

    cancelSelfServeCampaign: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/self-serve-ads/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SelfServeAds", "SelfServeAdWallet"],
    }),
  }),
});

export const {
  useUploadAdImagesMutation,
  useGetAdWalletQuery,
  useFundAdWalletMutation,
  useGetSelfServeCampaignsQuery,
  useCreateSelfServeCampaignMutation,
  usePauseSelfServeCampaignMutation,
  useResumeSelfServeCampaignMutation,
  useCancelSelfServeCampaignMutation,
} = selfServeAdsApi;

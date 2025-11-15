/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== services/billingServiceApis.ts ====================
import api from "../api";

interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: "CREDIT" | "DEBIT";
  status?: "PENDING" | "COMPLETED" | "FAILED";
}

export const billingServiceApis = api.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== WALLET ENDPOINTS ====================

    // GET WALLET BALANCE
    getWalletBalance: builder.query<any, void>({
      query: () => `/ads/billing/wallet/balance`,
      providesTags: ["Billing"],
    }),

    // GET WALLET SUMMARY
    getWalletSummary: builder.query<any, void>({
      query: () => `/ads/billing/wallet/summary`,
      providesTags: ["Billing"],
    }),

    // FUND WALLET (Initialize Payment)
    initializePayment: builder.mutation<
      {
        success: boolean;
        data?: {
          authorization_url: string;
          reference: string;
          transactionId?: string;
        };
        message?: string;
      },
      { amount: number; callback_url: string }
    >({
      query: (data) => ({
        url: `/ads/billing/wallet/fund`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Billing"],
    }),

    // GET WALLET TRANSACTIONS (with pagination and filters)
    getWalletTransactions: builder.query<
      any,
      TransactionQueryParams | undefined
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.type) queryParams.append("type", params.type);
        if (params?.status) queryParams.append("status", params.status);

        const queryString = queryParams.toString();
        return `/ads/billing/wallet/transactions${
          queryString ? `?${queryString}` : ""
        }`;
      },
      providesTags: ["Billing"],
    }),

    // GET TRANSACTION BY ID
    getTransactionById: builder.query<any, string>({
      query: (transactionId) =>
        `/ads/billing/wallet/transactions/${transactionId}`,
      providesTags: ["Billing"],
    }),

    // ==================== SUBSCRIPTION PLANS ====================

    // GET SUBSCRIPTION PLANS
    getSubscriptionPlans: builder.query<any, void>({
      query: () => `/ads/billing/subscription/plans`,
      providesTags: ["Plans"],
    }),

    // ==================== SUBSCRIPTION MANAGEMENT ====================

    // SUBSCRIBE TO A PLAN
    subscribeToPlan: builder.mutation<
      any,
      { planTier: string; campaignType?: string }
    >({
      query: (data) => ({
        url: `/ads/billing/subscription/subscribe`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),

    // GET USER SUBSCRIPTIONS (Active)
    getActiveSubscriptions: builder.query<any, void>({
      query: () => `/ads/billing/subscription/active`,
      providesTags: ["Plans"],
    }),

    // GET SINGLE SUBSCRIPTION BY ID
    getSubscriptionById: builder.query<any, string>({
      query: (subscriptionId) => `/ads/billing/subscription/${subscriptionId}`,
      providesTags: ["Plans"],
    }),

    // CANCEL SUBSCRIPTION BY ID
    cancelSubscriptionById: builder.mutation<any, string>({
      query: (subscriptionId) => ({
        url: `/ads/billing/subscription/${subscriptionId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),

    // TOGGLE AUTO-RENEW SUBSCRIPTION
    toggleAutoRenew: builder.mutation<any, string>({
      query: (subscriptionId) => ({
        url: `/ads/billing/subscription/${subscriptionId}/toggle-auto-renew`,
        method: "POST",
      }),
      invalidatesTags: ["Plans"],
    }),

    // RENEW SUBSCRIPTION
    renewSubscription: builder.mutation<any, string>({
      query: (subscriptionId) => ({
        url: `/ads/billing/subscription/${subscriptionId}/renew`,
        method: "POST",
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),

    // CHANGE PLAN
    changePlan: builder.mutation<
      any,
      { subscriptionId: string; newPlanTier: string }
    >({
      query: ({ subscriptionId, newPlanTier }) => ({
        url: `/ads/billing/subscription/${subscriptionId}/change-plan`,
        method: "POST",
        body: { newPlanTier },
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),

    // ==================== SUBSCRIPTION USAGE & LIMITS ====================

    // GET SUBSCRIPTION USAGE
    getSubscriptionUsage: builder.query<any, string>({
      query: (subscriptionId) =>
        `/ads/billing/subscription/${subscriptionId}/usage`,
      providesTags: ["Plans"],
    }),

    // GET SUBSCRIPTION LIMIT (Check Limit)
    checkSubscriptionLimit: builder.query<any, string>({
      query: (subscriptionId) =>
        `/ads/billing/subscription/${subscriptionId}/check-limit`,
      providesTags: ["Plans"],
    }),
  }),
});

export const {
  // Wallet hooks
  useGetWalletBalanceQuery,
  useGetWalletSummaryQuery,
  useInitializePaymentMutation,
  useGetWalletTransactionsQuery,
  useGetTransactionByIdQuery,

  // Plans hooks
  useGetSubscriptionPlansQuery,

  // Subscription management hooks
  useSubscribeToPlanMutation,
  useGetActiveSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCancelSubscriptionByIdMutation,
  useToggleAutoRenewMutation,
  useRenewSubscriptionMutation,
  useChangePlanMutation,

  // Usage & limits hooks
  useGetSubscriptionUsageQuery,
  useCheckSubscriptionLimitQuery,
} = billingServiceApis;

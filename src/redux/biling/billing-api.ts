/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== services/billingServiceApis.ts ====================
import api from "../api";

export const billingServiceApis = api.injectEndpoints({
  endpoints: (builder) => ({
    // WALLET BALANCE
    getWalletBalance: builder.query<any, void>({
      query: () => `/ads/billing/wallet/balance`,
      providesTags: ["Billing"],
    }),

    // WALLET SUMMARY
    getWalletSummary: builder.query<any, void>({
      query: () => `/ads/billing/wallet/summary`,
      providesTags: ["Billing"],
    }),

    // SUBSCRIPTION PLANS
    getSubscriptionPlans: builder.query<any, void>({
      query: () => `/ads/billing/subscription/plans`,
      providesTags: ["Plans"],
    }),

    // SUBSCRIBE TO PLAN
    subscribeToPlan: builder.mutation<any, { planTier: string }>({
      query: (data) => ({
        url: `/ads/billing/subscription/subscribe`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),

    // INITIALIZE PAYMENT (Fund Wallet)
    initializePayment: builder.mutation<any, { amount: number }>({
      query: (data) => ({
        url: `/ads/billing/wallet/fund`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Billing"],
    }),

    // GET ACTIVE SUBSCRIPTIONS (if available)
    getActiveSubscriptions: builder.query<any, void>({
      query: () => `/ads/billing/subscription/active`,
      providesTags: ["Plans"],
    }),

    // CANCEL SUBSCRIPTION (if available)
    cancelSubscription: builder.mutation<any, { campaignType: string }>({
      query: (data) => ({
        url: `/ads/billing/subscription/cancel`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Billing", "Plans"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useGetWalletSummaryQuery,
  useGetSubscriptionPlansQuery,
  useSubscribeToPlanMutation,
  useInitializePaymentMutation,
  useGetActiveSubscriptionsQuery,
  useCancelSubscriptionMutation,
} = billingServiceApis;

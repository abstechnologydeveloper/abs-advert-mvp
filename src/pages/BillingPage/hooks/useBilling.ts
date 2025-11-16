/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== hooks/useBilling.ts (Updated) ====================
import { useState } from "react";
import {
  useGetWalletBalanceQuery,
  useGetWalletSummaryQuery,
  useGetSubscriptionPlansQuery,
  useSubscribeToPlanMutation,
  useInitializePaymentMutation,
} from "../../../redux/biling/billing-api";
import {
  transformApiPlansToComponentFormat,
  convertPlanNameToApiTier,
  transformApiTransactions,
} from "../utils/planTransformers";
import {
  CampaignTypeId,
  SubscriptionsState,
  UsageState,
  SelectedPlanForFunding,
} from "../types/billing.types";
import { useToastContext } from "./useToast";

export const useBilling = () => {
  const { addToast } = useToastContext();

  const [selectedCampaignType, setSelectedCampaignType] =
    useState<CampaignTypeId>("email");
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "history">(
    "overview"
  );
  const [showFundModal, setShowFundModal] = useState<boolean>(false);
  const [selectedPlanForFunding, setSelectedPlanForFunding] =
    useState<SelectedPlanForFunding | null>(null);

  // RTK Query hooks
  const {
    data: walletBalanceData,
    isLoading: walletLoading,
    refetch: refetchBalance,
  } = useGetWalletBalanceQuery(undefined);

  const { data: walletSummaryData, refetch: refetchSummary } =
    useGetWalletSummaryQuery(undefined);

  const { data: plansData, isLoading: plansLoading } =
    useGetSubscriptionPlansQuery(undefined);

  const [subscribeToPlan, { isLoading: isSubscribing }] =
    useSubscribeToPlanMutation();

  const [initializePayment, { isLoading: isInitializingPayment }] =
    useInitializePaymentMutation();

  // Wallet balance
  const walletBalance = walletBalanceData?.data?.balance || 0;

  // Transformed plans
  const transformedPlans = plansData?.success
    ? transformApiPlansToComponentFormat(plansData.data)
    : {};

  // Transactions
  const transactions = walletSummaryData?.success
    ? transformApiTransactions(walletSummaryData.data.recentTransactions)
    : [];

  // Mock subscriptions and usage
  const [subscriptions, setSubscriptions] = useState<SubscriptionsState>({
    email: null,
    quills: null,
    blog: null,
    scholarship: null,
    library: null,
  });

  const [usage] = useState<UsageState>({
    email: { dailySent: 0, monthlySent: 0 },
    quills: { dailySent: 0, monthlySent: 0 },
    blog: { dailySent: 0, monthlySent: 0 },
    scholarship: { dailySent: 0, monthlySent: 0 },
    library: { dailySent: 0, monthlySent: 0 },
  });

  /**
   * Handle wallet funding with payment gateway
   */
  const handleFundWallet = async (amount: number): Promise<void> => {
    try {
      const callbackUrl = `${window.location.origin}/billing/payment-callback`;

      const response = await initializePayment({
        amount,
        callback_url: callbackUrl,
      }).unwrap();

      if (response.success && response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      addToast(
        error?.data?.message ||
          "Failed to initialize payment. Please try again.",
        "error"
      );
    }
  };

  /**
   * Handle subscription to a plan
   */
  const handleSubscribe = async (
    campaignType: string,
    planName: string,
    canAfford: boolean
  ): Promise<void> => {
    if (!canAfford) {
      const plans = transformedPlans[campaignType as CampaignTypeId];
      const plan = plans?.[planName];
      if (plan) {
        setSelectedPlanForFunding({
          campaignType,
          planName,
          shortfall: Math.max(0, plan.price - walletBalance),
        });
        setShowFundModal(true);
      }
      return;
    }

    try {
      const planTier = convertPlanNameToApiTier(planName);
      await subscribeToPlan({ planTier }).unwrap();

      // Update local subscription state
      setSubscriptions((prev) => ({
        ...prev,
        [campaignType]: {
          planName: planName,
          status: "active" as const,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          autoRenew: true,
        },
      }));

      addToast(`Successfully subscribed to ${planName} plan! 🎉`, "success");

      // Refetch wallet data
      await refetchBalance();
      await refetchSummary();
    } catch (error: any) {
      console.error("Subscription error:", error);
      addToast(
        error?.data?.message || "Subscription failed. Please try again.",
        "error"
      );
    }
  };

  return {
    selectedCampaignType,
    setSelectedCampaignType,
    activeTab,
    setActiveTab,
    showFundModal,
    setShowFundModal,
    selectedPlanForFunding,
    setSelectedPlanForFunding,
    walletBalance,
    subscriptions,
    usage,
    transactions,
    transformedPlans,
    handleFundWallet,
    handleSubscribe,
    isLoading: walletLoading || plansLoading,
    isSubscribing,
    isInitializingPayment,
  };
};

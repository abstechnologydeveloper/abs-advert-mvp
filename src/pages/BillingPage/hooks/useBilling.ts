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

export const useBilling = () => {
  const [selectedCampaignType, setSelectedCampaignType] =
    useState<CampaignTypeId>("email");
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "history">(
    "overview"
  );
  const [showFundModal, setShowFundModal] = useState<boolean>(false);
  const [selectedPlanForFunding, setSelectedPlanForFunding] =
    useState<SelectedPlanForFunding | null>(null);

  // RTK Query hooks - NOW WITH undefined PARAMETER
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


  // Mock subscriptions and usage (replace with actual API when available)
  const [subscriptions, setSubscriptions] = useState<SubscriptionsState>({
    email: null,
    quills: null,
    blog: null,
    scholarship: null,
    library: null,
  });

  const [usage, setUsage] = useState<UsageState>({
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
      const response = await initializePayment({ amount }).unwrap();

      if (response.success && response.data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      alert(
        error?.data?.message ||
          "Failed to initialize payment. Please try again."
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

      alert(`Successfully subscribed to ${planName} plan!`);

      // Refetch wallet data
      await refetchBalance();
      await refetchSummary();
    } catch (error: any) {
      console.error("Subscription error:", error);
      const errorMessage =
        error?.data?.message || "Subscription failed. Please try again.";
      alert(errorMessage);
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

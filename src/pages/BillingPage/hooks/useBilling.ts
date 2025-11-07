// ==================== hooks/useBilling.ts ====================
import { useState } from "react";
import { CAMPAIGN_TYPES } from "../config/campaignTypes";
import {
  SubscriptionsState,
  UsageState,
  Transaction,
  SelectedPlanForFunding,
  CampaignTypeId,
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
  const [walletBalance, setWalletBalance] = useState<number>(100000);

  const [subscriptions, setSubscriptions] = useState<SubscriptionsState>({
    email: {
      planName: "Basic",
      status: "active",
      startDate: "2025-11-01",
      endDate: "2025-12-01",
      autoRenew: true,
    },
    quills: null,
    blog: null,
    scholarship: null,
    library: null,
  });

  const [usage, setUsage] = useState<UsageState>({
    email: { dailySent: 1250, monthlySent: 45000 },
    quills: { dailySent: 0, monthlySent: 0 },
    blog: { dailySent: 0, monthlySent: 0 },
    scholarship: { dailySent: 0, monthlySent: 0 },
    library: { dailySent: 0, monthlySent: 0 },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN-001",
      date: "2025-11-05",
      description: "Wallet funding via Paystack",
      type: "credit",
      amount: 100000,
      status: "completed",
      reference: "PSK-2025-001",
    },
    {
      id: "TXN-002",
      date: "2025-11-01",
      description: "Email Campaigns - Basic Plan",
      type: "debit",
      amount: 170000,
      status: "completed",
      reference: "SUB-EMAIL-001",
    },
    {
      id: "TXN-003",
      date: "2025-10-28",
      description: "Wallet funding via Paystack",
      type: "credit",
      amount: 200000,
      status: "completed",
      reference: "PSK-2025-002",
    },
  ]);

  const handleFundWallet = (amount: number): void => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: "Wallet funding via Paystack",
        type: "credit",
        amount: amount,
        status: "completed",
        reference: `PSK-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleSubscribe = (
    campaignType: string,
    planName: string,
    canAfford: boolean
  ): void => {
    if (!canAfford) {
      const plan =
        CAMPAIGN_TYPES[campaignType].plans[
          planName as keyof (typeof CAMPAIGN_TYPES)[typeof campaignType]["plans"]
        ];
      setSelectedPlanForFunding({
        campaignType,
        planName,
        shortfall: Math.max(0, plan.price - walletBalance),
      });
      setShowFundModal(true);
      return;
    }

    const plan =
      CAMPAIGN_TYPES[campaignType].plans[
        planName as keyof (typeof CAMPAIGN_TYPES)[typeof campaignType]["plans"]
      ];

    setWalletBalance((prev) => prev - plan.price);

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

    setTransactions((prev) => [
      {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: `${CAMPAIGN_TYPES[campaignType].label} - ${planName} Plan`,
        type: "debit",
        amount: plan.price,
        status: "completed",
        reference: `SUB-${campaignType.toUpperCase()}-${Date.now()}`,
      },
      ...prev,
    ]);

    alert(
      `Successfully subscribed to ${planName} plan for ${CAMPAIGN_TYPES[campaignType].label}!`
    );
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
    handleFundWallet,
    handleSubscribe,
  };
};
// ==================== hooks/useBilling.ts ====================
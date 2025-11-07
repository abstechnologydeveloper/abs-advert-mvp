// ==================== pages/BillingPage/BillingPage.tsx ====================
import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import CampaignTypeSelector from "./components/CampaignTypeSelector";
import SubscriptionOverview from "./components/SubscriptionOverview";
import PlansTab from "./components/PlansTab";
import TransactionHistory from "./components/TransactionHistory";
import FundWalletModal from "./components/FundWalletModal";
import {
  CampaignTypeId,
  SubscriptionsState,
  Transaction,
  Usage,
} from "./types/billing.types";
import { CAMPAIGN_TYPES } from "./config/campaignTypes";
import WalletCard from "./components/WalletCard";
import { formatCurrency } from "./utils/formatters";

type Usages = Record<string, Usage>;

const BillingPage: React.FC = () => {
  const [selectedCampaignType, setSelectedCampaignType] =
    useState<CampaignTypeId>("email");
  const [activeTab, setActiveTab] = useState("overview");
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedPlanForFunding, setSelectedPlanForFunding] = useState<{
    campaignType: string;
    planName: string;
    shortfall: number;
  } | null>(null);

  // Mock Wallet Balance
  const [walletBalance, setWalletBalance] = useState<number>(100000);

  // Mock Subscriptions
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

  // Mock Usage
  const [usage, setUsage] = useState<Usages>({
    email: { dailySent: 1250, monthlySent: 45000 },
    quills: { dailySent: 0, monthlySent: 0 },
    blog: { dailySent: 0, monthlySent: 0 },
    scholarship: { dailySent: 0, monthlySent: 0 },
    library: { dailySent: 0, monthlySent: 0 },
  });

  // Mock Transactions
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

  // ============== HANDLERS ==============
  const handleFundWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: "Wallet funding via Paystack",
        type: "credit",
        amount,
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
  ) => {
    const plan = CAMPAIGN_TYPES[campaignType].plans[planName];
    if (!canAfford) {
      setSelectedPlanForFunding({
        campaignType,
        planName,
        shortfall: Math.max(0, plan.price - walletBalance),
      });
      setShowFundModal(true);
      return;
    }

    // Deduct wallet balance
    setWalletBalance((prev) => prev - plan.price);

    // Update subscription
    setSubscriptions((prev) => ({
      ...prev,
      [campaignType]: {
        planName,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        autoRenew: true,
      },
    }));

    // Add transaction record
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

  // ============== CURRENT STATES ==============
  const currentSubscription = subscriptions[selectedCampaignType];
  const currentUsage = usage[selectedCampaignType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600">
            Manage your wallet and campaign subscriptions
          </p>
        </div>

        {/* Wallet Balance */}
        <WalletCard
          balance={walletBalance}
          onFund={() => setShowFundModal(true)}
          onWithdraw={() => alert("Withdraw functionality coming soon")}
        />

        {/* Campaign Selector */}
        <CampaignTypeSelector
          selectedType={selectedCampaignType}
          onSelect={setSelectedCampaignType}
          subscriptions={subscriptions}
        />

        {/* Subscription Overview */}
        <SubscriptionOverview
          campaignType={selectedCampaignType}
          subscription={currentSubscription}
          usage={currentUsage}
          onUpgrade={() => setActiveTab("plans")}
        />

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          {/* Tabs Header */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {(selectedCampaignType === "email"
                ? [
                    { id: "overview", label: "Overview" },
                    { id: "plans", label: "Available Plans" },
                    { id: "history", label: "Transaction History" },
                  ]
                : [{ id: "history", label: "Transaction History" }]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedCampaignType === "email" ? (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Recent Transactions */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Recent Transactions
                      </h3>
                      <div className="space-y-3">
                        {transactions.slice(0, 5).map((txn) => (
                          <div
                            key={txn.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center space-x-4">
                              {txn.type === "credit" ? (
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <ArrowDownRight className="w-5 h-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="p-2 bg-red-100 rounded-lg">
                                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {txn.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {txn.date} • {txn.reference}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  txn.type === "credit"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {txn.type === "credit" ? "+" : "-"}
                                {formatCurrency(txn.amount)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Subscriptions */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Active Subscriptions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(subscriptions).map(([type, sub]) => {
                          if (!sub || sub.status !== "active") return null;
                          const campaign = CAMPAIGN_TYPES[type];
                          const plan = campaign.plans[sub.planName];
                          const Icon = campaign.icon;

                          return (
                            <div
                              key={type}
                              className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                            >
                              <div className="flex items-center space-x-3 mb-2">
                                <Icon className="w-6 h-6 text-blue-600" />
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {campaign.label}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {sub.planName} Plan •{" "}
                                    {formatCurrency(plan.price)}/mo
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
                                Renews:{" "}
                                {new Date(sub.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "plans" && (
                  <PlansTab
                    campaignType={selectedCampaignType}
                    walletBalance={walletBalance}
                    currentSubscription={currentSubscription}
                    onSubscribe={handleSubscribe}
                  />
                )}

                {activeTab === "history" && (
                  <TransactionHistory transactions={transactions} />
                )}
              </>
            ) : (
              // ✅ For non-email campaigns → empty transaction list
              <TransactionHistory transactions={[]} />
            )}
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => {
          setShowFundModal(false);
          setSelectedPlanForFunding(null);
        }}
        onFund={handleFundWallet}
        selectedPlan={selectedPlanForFunding}
      />
    </div>
  );
};

export default BillingPage;

// ==================== Updated BillingPage.tsx ====================
import React, { useEffect, useState } from "react";
import { ToastProvider } from "./components/ToastNotification";
import { useBilling } from "./hooks/useBilling";
// CampaignTypeSelector removed — billing is email-only
import PlansTab from "./components/PlansTab";
import FundWalletModal from "./components/FundWalletModal";
import TransactionHistory from "./components/TransactionHistory";
import WalletCard from "./components/WalletCard";
import ActiveSubscriptionTab from "./components/ActiveSubscriptionTab";
import ChangePlanModal from "./components/ChangePlanModal";
import {
  useGetWalletBalanceQuery,
  useGetActiveSubscriptionsQuery,
} from "../../redux/biling/billing-api";

const BillingPageContent: React.FC = () => {
  // Email campaign type is fixed — no other campaign types shown here
  const EMAIL_TYPE = "email" as const;

  const {
    activeTab,
    setActiveTab,
    showFundModal,
    setShowFundModal,
    selectedPlanForFunding,
    subscriptions,
    transactions,
    transformedPlans,
    handleSubscribe,
    isLoading,
    isSubscribing,
  } = useBilling();

useEffect(() => {
  const handleSwitchTab = (event: Event) => {
    const customEvent = event as CustomEvent<"overview" | "plans" | "history">;
    setActiveTab(customEvent.detail);
  };

  window.addEventListener("switchTab", handleSwitchTab);
  return () => window.removeEventListener("switchTab", handleSwitchTab);
}, [setActiveTab]);

  // Change Plan Modal State
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>("");

  // Fetch wallet balance
  const { data: walletData } = useGetWalletBalanceQuery(undefined);
  const walletBalance = walletData?.data?.balance ?? walletData?.balance ?? 0;

  // Fetch active subscriptions
  const { data: activeSubscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetActiveSubscriptionsQuery(undefined);

  const activeSubscriptions = activeSubscriptionsData?.data || [];
  console.log("activeSubscriptionData", activeSubscriptions);

  // Find current subscription for change plan modal
  const currentSubscription = activeSubscriptions.find(
    (sub) => sub.id === selectedSubscriptionId
  );

  const handleChangePlanClick = (subscriptionId: string) => {
    setSelectedSubscriptionId(subscriptionId);
    setShowChangePlanModal(true);
  };

  if (isLoading || isLoadingSubscriptions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Campaign Billing
          </h1>
          <p className="text-gray-600">
            Manage your email campaign wallet, plans, and transaction history.
          </p>
        </div>

        {/* Wallet Card */}
        <WalletCard onFund={() => setShowFundModal(true)} />

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            {(["overview", "plans", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 font-medium transition ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "plans" && (
            <PlansTab
              campaignType={EMAIL_TYPE}
              plans={transformedPlans[EMAIL_TYPE] || {}}
              walletBalance={walletBalance}
              currentSubscription={subscriptions[EMAIL_TYPE]}
              activeSubscriptions={activeSubscriptions}
              onSubscribe={handleSubscribe}
            />
          )}

          {activeTab === "history" && (
            <TransactionHistory transactions={transactions} />
          )}

          {activeTab === "overview" && (
            <ActiveSubscriptionTab
              activeSubscriptions={activeSubscriptions}
              campaignType={EMAIL_TYPE}
              onChangePlan={handleChangePlanClick}
            />
          )}
        </div>

        {/* Fund Wallet Modal */}
        <FundWalletModal
          isOpen={showFundModal}
          onClose={() => setShowFundModal(false)}
          selectedPlan={selectedPlanForFunding}
        />

        {/* Change Plan Modal */}
        {currentSubscription && (
          <ChangePlanModal
            isOpen={showChangePlanModal}
            onClose={() => setShowChangePlanModal(false)}
            currentSubscriptionId={currentSubscription.id}
            currentPlanName={currentSubscription.planName}
            availablePlans={transformedPlans[EMAIL_TYPE] || {}}
            walletBalance={walletBalance}
          />
        )}

        {/* Loading Overlay */}
        {isSubscribing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-900 font-medium">
                Processing subscription...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with ToastProvider
const BillingPage: React.FC = () => {
  return (
    <ToastProvider>
      <BillingPageContent />
    </ToastProvider>
  );
};

export default BillingPage;
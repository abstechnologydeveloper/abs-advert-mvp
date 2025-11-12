// ==================== Updated BillingPage.tsx ====================
import React from "react";
import { useBilling } from "./hooks/useBilling";
import CampaignTypeSelector from "./components/CampaignTypeSelector";
import PlansTab from "./components/PlansTab";
import FundWalletModal from "./components/FundWalletModal";
import TransactionHistory from "./components/TransactionHistory";
import WalletCard from "./components/WalletCard";
import ActiveSubscriptionTab from "./components/ActiveSubscriptionTab";
import {
  useGetWalletBalanceQuery,
  useGetActiveSubscriptionsQuery,
} from "../../redux/biling/billing-api";

const BillingPage: React.FC = () => {
  const {
    selectedCampaignType,
    setSelectedCampaignType,
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

  // Fetch wallet balance
  const { data: walletData } = useGetWalletBalanceQuery(undefined);
  const walletBalance = walletData?.data?.balance ?? walletData?.balance ?? 0;

  // Fetch active subscriptions
  const { data: activeSubscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetActiveSubscriptionsQuery(undefined);

  const activeSubscriptions = activeSubscriptionsData?.data || [];

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
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600">
            Manage your wallet and campaign subscriptions
          </p>
        </div>

        {/* Wallet Card */}
        <WalletCard onFund={() => setShowFundModal(true)} />

        {/* Campaign Type Selector */}
        <CampaignTypeSelector
          selectedType={selectedCampaignType}
          onSelect={setSelectedCampaignType}
          subscriptions={subscriptions}
        />

    
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            {["overview", "plans", "history"]
              .filter(
                (tab) => tab !== "plans" || selectedCampaignType === "email"
              )
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
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

          {/* Tab Content */}
          {activeTab === "plans" && selectedCampaignType === "email" && (
            <PlansTab
              campaignType={selectedCampaignType}
              plans={transformedPlans[selectedCampaignType] || {}}
              walletBalance={walletBalance}
              currentSubscription={subscriptions[selectedCampaignType]}
              activeSubscriptions={activeSubscriptions}
              onSubscribe={handleSubscribe}
            />
          )}

          {activeTab === "plans" && selectedCampaignType !== "email" && (
            <div className="text-center py-12 text-gray-600">
              Plans are only available for <b>Email</b> Campaigns.
            </div>
          )}

          {activeTab === "history" && selectedCampaignType === "email" ? (
            <TransactionHistory transactions={transactions} />
          ) : (
            activeTab === "history" && (
              <div className="text-center py-12 text-gray-600">
                Transaction history is only available for <b>Email</b>{" "}
                Campaigns.
              </div>
            )
          )}

          {activeTab === "overview" && selectedCampaignType === "email" ? (
            <ActiveSubscriptionTab
              activeSubscriptions={activeSubscriptions}
              campaignType={selectedCampaignType}
            />
          ) : (
            activeTab === "overview" && (
              <div className="text-center py-12 text-gray-600">
                Overview only available for <b>Email</b> Campaigns.
              </div>
            )
          )}
        </div>

        {/* Fund Wallet Modal */}
        <FundWalletModal
          isOpen={showFundModal}
          onClose={() => setShowFundModal(false)}
          selectedPlan={selectedPlanForFunding}
        />

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

export default BillingPage;

// ==================== Updated EmailPlans.tsx ====================
import React from "react";
import { useBilling } from "../BillingPage/hooks/useBilling";
import WalletCard from "../BillingPage/components/WalletCard";
import PlansTab from "../BillingPage/components/PlansTab";
import FundWalletModal from "../BillingPage/components/FundWalletModal";
import {
  useGetWalletBalanceQuery,
  useGetActiveSubscriptionsQuery,
} from "../../redux/biling/billing-api";

const EmailPlans: React.FC = () => {
  const {
    showFundModal,
    setShowFundModal,
    selectedPlanForFunding,
    subscriptions,
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

  // Email campaign type
  const campaignType = "email";

  if (isLoading || isLoadingSubscriptions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
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
            Email Campaign Plans
          </h1>
          <p className="text-gray-600">
            Choose the perfect plan for your email campaigns
          </p>
        </div>

        {/* Wallet Card */}
        <WalletCard onFund={() => setShowFundModal(true)} />

        {/* Plans Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <PlansTab
            campaignType={campaignType}
            plans={transformedPlans[campaignType] || {}}
            walletBalance={walletBalance}
            currentSubscription={subscriptions[campaignType]}
            activeSubscriptions={activeSubscriptions}
            onSubscribe={handleSubscribe}
          />
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

export default EmailPlans;

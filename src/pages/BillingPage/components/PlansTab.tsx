// ==================== Updated PlansTab.tsx ====================
import React from "react";
import { Info } from "lucide-react";
import PlanCard from "./PlanCard";
import { Plan, Subscription } from "../types/billing.types";

interface ActiveSubscription {
  id: string;
  campaignType: string;
  planName: string;
  status: string;
  monthlyPrice: number;
  dailyLimit: number;
  monthlyLimit: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

interface PlansTabProps {
  campaignType: string;
  plans: Record<string, Plan>;
  walletBalance: number;
  currentSubscription: Subscription | null;
  activeSubscriptions: ActiveSubscription[];
  onSubscribe: (
    campaignType: string,
    planName: string,
    canAfford: boolean
  ) => void;
}

const PlansTab: React.FC<PlansTabProps> = ({
  campaignType,
  plans,
  walletBalance,
  currentSubscription,
  activeSubscriptions,
  onSubscribe,
}) => {
  if (campaignType.toUpperCase() !== "EMAIL") {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Subscription plans are only available for <b>Email</b> campaigns.
        </p>
      </div>
    );
  }

  if (!plans || Object.keys(plans).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No plans available for this campaign type.
        </p>
      </div>
    );
  }

  // Find active subscription for this campaign type
  const activeSub = activeSubscriptions.find(
    (sub) =>
      sub.campaignType.toUpperCase() === campaignType.toUpperCase() &&
      sub.status === "ACTIVE"
  );

  return (
    <div className="space-y-6">
      {/* Wallet Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">
            Payment from Wallet
          </p>
          <p className="text-sm text-blue-700">
            Subscription fees will be deducted from your wallet balance. If
            insufficient, please fund your wallet first.
          </p>
        </div>
      </div>
      {currentSubscription && (
        <div className="text-sm text-gray-700 mb-4">
          You are currently subscribed to <b>{currentSubscription.planName}</b>{" "}
          plan.
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(plans).map(([planName, plan]) => {
          const isCurrentPlan =
            activeSub?.planName?.toUpperCase() === planName.toUpperCase();

          return (
            <PlanCard
              key={planName}
              campaignType={campaignType}
              planName={planName}
              plan={plan}
              isCurrentPlan={isCurrentPlan}
              walletBalance={walletBalance}
              onSubscribe={onSubscribe}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlansTab;

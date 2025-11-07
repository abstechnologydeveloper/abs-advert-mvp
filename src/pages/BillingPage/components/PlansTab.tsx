// ==================== components/PlansTab.tsx ====================
import React from "react";
import { Info } from "lucide-react";
import PlanCard from "./PlanCard";
import { Subscription } from "../types/billing.types";
import { CAMPAIGN_TYPES } from "../config/campaignTypes";

interface PlansTabProps {
  campaignType: string;
  walletBalance: number;
  currentSubscription: Subscription | null;
  onSubscribe: (
    campaignType: string,
    planName: string,
    canAfford: boolean
  ) => void;
}

const PlansTab: React.FC<PlansTabProps> = ({
  campaignType,
  walletBalance,
  currentSubscription,
  onSubscribe,
}) => {
  const campaign = CAMPAIGN_TYPES[campaignType];

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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(campaign.plans).map(([planName, plan]) => (
          <PlanCard
            key={planName}
            campaignType={campaignType}
            planName={planName}
            plan={plan}
            isCurrentPlan={
              currentSubscription?.planName === planName &&
              currentSubscription?.status === "active"
            }
            walletBalance={walletBalance}
            onSubscribe={onSubscribe}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansTab;

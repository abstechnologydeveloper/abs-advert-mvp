// ==================== components/SubscriptionOverview.tsx ====================
import React from "react";
import { Mail, Calendar } from "lucide-react";
import { CAMPAIGN_TYPES } from "../config/campaignTypes";
import { formatCurrency, getPlanIcon } from "../utils/formatters";
import { Subscription, Usage } from "../types/billing.types";

interface SubscriptionOverviewProps {
  campaignType: string;
  subscription: Subscription | null;
  usage: Usage;
  onUpgrade: () => void;
}

const SubscriptionOverview: React.FC<SubscriptionOverviewProps> = ({
  campaignType,
  subscription,
  usage,
  onUpgrade,
}) => {
  if (!subscription || subscription.status !== "active") return null;

  const campaign = CAMPAIGN_TYPES[campaignType];
  const plan =
    campaign.plans[subscription.planName as keyof typeof campaign.plans];
  const Icon = getPlanIcon(subscription.planName);

  const usagePercentages = {
    daily: (usage.dailySent / plan.dailyLimit) * 100,
    monthly: (usage.monthlySent / plan.monthlyLimit) * 100,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {subscription.planName} Plan
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
            <p className="text-gray-600">
              {campaign.label} • {formatCurrency(plan.price)}/month • Renews{" "}
              {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
        >
          Change Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Daily Usage</span>
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {usage.dailySent.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercentages.daily >= 80 ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(usagePercentages.daily, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {usagePercentages.daily.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            of {plan.dailyLimit.toLocaleString()} daily limit
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Usage</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {usage.monthlySent.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercentages.monthly >= 80 ? "bg-red-500" : "bg-green-600"
                }`}
                style={{ width: `${Math.min(usagePercentages.monthly, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {usagePercentages.monthly.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            of {plan.monthlyLimit.toLocaleString()} monthly limit
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionOverview;

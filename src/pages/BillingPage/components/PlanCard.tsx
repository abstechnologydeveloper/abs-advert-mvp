// ==================== components/PlanCard.tsx ====================
import React from "react";
import { CheckCircle } from "lucide-react";
import { formatCurrency, getPlanIcon } from "../utils/formatters";
import { Plan } from "../types/billing.types";

interface PlanCardProps {
  campaignType: string;
  planName: string;
  plan: Plan;
  isCurrentPlan: boolean;
  walletBalance: number;
  onSubscribe: (
    campaignType: string,
    planName: string,
    canAfford: boolean
  ) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  campaignType,
  planName,
  plan,
  isCurrentPlan,
  walletBalance,
  onSubscribe,
}) => {
  const Icon = getPlanIcon(planName);
  const shortfall = Math.max(0, plan.price - walletBalance);
  const canAfford = walletBalance >= plan.price;

  return (
    <div
      className={`relative rounded-2xl p-6 border-2 transition hover:shadow-lg ${
        isCurrentPlan
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* === Current Plan Badge === */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
          Current Plan
        </div>
      )}

      {/* === Header === */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{planName} Plan</h3>
          <p className="text-2xl font-semibold text-blue-600">
            {formatCurrency(plan.price)}
            <span className="text-sm text-gray-600 font-normal"> /month</span>
          </p>
        </div>
      </div>

      {/* === Features === */}
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start space-x-2 text-sm text-gray-700"
          >
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* === Subscription Action === */}
      {!isCurrentPlan && (
        <div className="space-y-3">
          {!canAfford ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-900 mb-1">
                Insufficient Balance
              </p>
              <p className="text-sm text-yellow-700">
                You need {formatCurrency(shortfall)} more to subscribe
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                {formatCurrency(plan.price)} will be deducted from your wallet
              </p>
            </div>
          )}

          <button
            onClick={() => onSubscribe(campaignType, planName, canAfford)}
            className={`w-full py-3 rounded-xl font-medium transition ${
              canAfford
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            {canAfford ? "Subscribe Now" : "Fund Wallet First"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanCard;

// ==================== components/ChangePlanModal.tsx ====================
import React, { useState } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { formatCurrency, getPlanIcon } from "../utils/formatters";
import { useChangePlanMutation } from "../../../redux/biling/billing-api";
import { Plan } from "../types/billing.types";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscriptionId: string;
  currentPlanName: string;
  availablePlans: Record<string, Plan>;
  walletBalance: number;
}

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  isOpen,
  onClose,
  currentSubscriptionId,
  currentPlanName,
  availablePlans,
  walletBalance,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [changePlan, { isLoading }] = useChangePlanMutation();

  if (!isOpen) return null;

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    try {
      // Convert plan name to uppercase format (BASIC, GROWTH, PRO, ENTERPRISE)
      const planTierUppercase = selectedPlan.toUpperCase();

      await changePlan({
        subscriptionId: currentSubscriptionId,
        newPlanTier: planTierUppercase,
      }).unwrap();

      alert(`Successfully changed to ${selectedPlan} plan`);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error?.data?.message || "Failed to change plan");
    }
  };

  const selectedPlanData = selectedPlan ? availablePlans[selectedPlan] : null;
  const canAfford = selectedPlanData
    ? walletBalance >= selectedPlanData.price
    : false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Change Your Plan
            </h2>
            <p className="text-gray-600 mt-1">
              Currently on:{" "}
              <span className="font-semibold">{currentPlanName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Wallet Balance Info */}
        <div className="px-6 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Wallet Balance:</span>{" "}
              {formatCurrency(walletBalance)}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Plan change fee will be deducted from your wallet
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(availablePlans).map(([planName, plan]) => {
            const Icon = getPlanIcon(planName);
            const isCurrentPlan =
              planName.toUpperCase() === currentPlanName.toUpperCase();
            const isSelected = selectedPlan === planName;
            const canAffordPlan = walletBalance >= plan.price;

            return (
              <button
                key={planName}
                onClick={() => !isCurrentPlan && setSelectedPlan(planName)}
                disabled={isCurrentPlan}
                className={`text-left p-5 rounded-xl border-2 transition ${
                  isCurrentPlan
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-60"
                    : isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {isCurrentPlan && (
                  <div className="inline-block px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-medium mb-3">
                    Current Plan
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {planName}
                    </h3>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatCurrency(plan.price)}
                      <span className="text-sm text-gray-600 font-normal">
                        {" "}
                        /month
                      </span>
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-gray-500 pl-6">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {!isCurrentPlan && !canAffordPlan && (
                  <div className="mt-3 text-xs text-red-600 font-medium">
                    Insufficient balance
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          {selectedPlan && selectedPlanData && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Plan:</span>
                <span className="font-semibold text-gray-900">
                  {currentPlanName}
                </span>
              </div>
              <div className="flex items-center justify-center my-2">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">New Plan:</span>
                <span className="font-semibold text-blue-600">
                  {selectedPlan}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-600">Amount to be charged:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(selectedPlanData.price)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Remaining balance:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(walletBalance - selectedPlanData.price)}
                </span>
              </div>
            </div>
          )}

          {!canAfford && selectedPlan && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                You need{" "}
                {formatCurrency((selectedPlanData?.price || 0) - walletBalance)}{" "}
                more in your wallet to change to this plan.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePlan}
              disabled={!selectedPlan || !canAfford || isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Confirm Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== components/ChangePlanModal.tsx ====================
import React, { useState } from "react";
import { X, ArrowRight, CheckCircle, AlertCircle, XCircle } from "lucide-react";
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
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  if (!isOpen) return null;

  const showToast = (message: string, type: "success" | "error") => {
    const shortMessage =
      message.length > 60 ? message.substring(0, 57) + "..." : message;

    setToast({ show: true, message: shortMessage, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000
    );
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    try {
      const planTierUppercase = selectedPlan.toUpperCase();

      await changePlan({
        subscriptionId: currentSubscriptionId,
        newPlanTier: planTierUppercase,
      }).unwrap();

      showToast(`Successfully changed to ${selectedPlan} plan`, "success");
      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to change plan", "error");
    }
  };

  const selectedPlanData = selectedPlan ? availablePlans[selectedPlan] : null;
  const canAfford = selectedPlanData
    ? walletBalance >= selectedPlanData.price
    : false;

  // Sort plans by price
  const sortedPlans = Object.entries(availablePlans).sort(
    ([, a], [, b]) => a.price - b.price
  );

  return (
    <>
      <div
        className="fixed inset-0 z-50 p-4 flex items-center justify-center"
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">Change Plan</h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  Current:{" "}
                  <span className="font-semibold">{currentPlanName}</span> •
                  Balance:{" "}
                  <span className="font-semibold">
                    {formatCurrency(walletBalance)}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plans Grid - More Space */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {sortedPlans.map(([planName, plan]) => {
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
                    className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                      isCurrentPlan
                        ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-70"
                        : isSelected
                        ? "border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    {/* Badges */}
                    {isCurrentPlan && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gray-600 text-white rounded-full text-[10px] font-bold shadow">
                        CURRENT
                      </div>
                    )}
                    {isSelected && !isCurrentPlan && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Icon & Name */}
                    <div className="text-center mb-2">
                      <div className="inline-flex p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-1.5">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        {planName}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-3 pb-2 border-b border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </p>
                      <p className="text-xs text-gray-600">/month</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-2">
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-tight"
                        >
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.features.length > 3 && (
                      <p className="text-[10px] text-blue-600 font-medium text-center">
                        +{plan.features.length - 3} more
                      </p>
                    )}

                    {/* Warning */}
                    {!isCurrentPlan && !canAffordPlan && (
                      <div className="mt-2 px-2 py-1 bg-red-100 border border-red-300 rounded">
                        <p className="text-[10px] text-red-700 font-medium text-center">
                          Insufficient balance
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
            {/* Summary - Only show when selected */}
            {selectedPlan && selectedPlanData && (
              <div className="mb-3 bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-gray-900">
                    {currentPlanName}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    {selectedPlan}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="font-bold text-gray-900">
                      {formatCurrency(selectedPlanData.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">After</p>
                    <p
                      className={`font-bold ${
                        canAfford ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(walletBalance - selectedPlanData.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {!canAfford && selectedPlan && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  Need{" "}
                  {formatCurrency(
                    (selectedPlanData?.price || 0) - walletBalance
                  )}{" "}
                  more. Please fund wallet first.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePlan}
                disabled={!selectedPlan || !canAfford || isLoading}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  `Confirm Change${selectedPlan ? ` to ${selectedPlan}` : ""}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[60]">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl border w-80 ${
              toast.type === "success"
                ? "bg-white border-green-500 text-gray-900"
                : "bg-white border-red-500 text-gray-900"
            }`}
            style={{
              animation: "slideIn 0.3s ease-out",
            }}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className="font-medium text-sm flex-1 leading-tight">
              {toast.message}
            </p>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="flex-shrink-0 hover:opacity-70 transition text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ChangePlanModal;

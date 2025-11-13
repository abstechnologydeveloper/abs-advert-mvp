/* eslint-disable @typescript-eslint/no-explicit-any */
// ==================== Enhanced ActiveSubscriptionTab.tsx ====================
import React, { useState } from "react";
import {
  Calendar,
  Mail,
  Users,
  Clock,
  RefreshCw,
  Shield,
  XCircle,
  Edit,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { ActiveSubscription } from "../types/billing.types";
import {
  useCancelSubscriptionByIdMutation,
  useToggleAutoRenewMutation,
  useRenewSubscriptionMutation,
  useGetSubscriptionUsageQuery,
  useCheckSubscriptionLimitQuery,
} from "../../../redux/biling/billing-api";

interface ActiveSubscriptionTabProps {
  activeSubscriptions: ActiveSubscription[];
  campaignType: string;
  onChangePlan?: (subscriptionId: string) => void;
}

const ActiveSubscriptionTab: React.FC<ActiveSubscriptionTabProps> = ({
  activeSubscriptions,
  campaignType,
  onChangePlan,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const subscription = activeSubscriptions.find(
    (sub) =>
      sub.campaignType.toUpperCase() === campaignType.toUpperCase() &&
      sub.status === "ACTIVE"
  );

  // RTK Query Hooks
  const [cancelSubscription] = useCancelSubscriptionByIdMutation();
  const [toggleAutoRenew] = useToggleAutoRenewMutation();
  const [renewSubscription] = useRenewSubscriptionMutation();

  const { data: usageData } = useGetSubscriptionUsageQuery(
    subscription?.id || "",
    { skip: !subscription?.id }
  );

  const { data: limitData } = useCheckSubscriptionLimitQuery(
    subscription?.id || "",
    { skip: !subscription?.id }
  );

  // Handle Cancel Subscription
  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setActionLoading("cancel");
    try {
      await cancelSubscription(subscription.id).unwrap();
      alert("Subscription cancelled successfully");
      setShowCancelConfirm(false);
    } catch (error: any) {
      alert(error?.data?.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Toggle Auto-Renew
  const handleToggleAutoRenew = async () => {
    if (!subscription) return;

    setActionLoading("autorenew");
    try {
      await toggleAutoRenew(subscription.id).unwrap();
      alert(
        `Auto-renewal ${
          subscription.autoRenew ? "disabled" : "enabled"
        } successfully`
      );
    } catch (error: any) {
      alert(error?.data?.message || "Failed to toggle auto-renewal");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Renew Subscription
  const handleRenewSubscription = async () => {
    if (!subscription) return;

    setActionLoading("renew");
    try {
      await renewSubscription(subscription.id).unwrap();
      alert("Subscription renewed successfully");
    } catch (error: any) {
      alert(error?.data?.message || "Failed to renew subscription");
    } finally {
      setActionLoading(null);
    }
  };

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Active Subscription
        </h3>
        <p className="text-gray-600 mb-4">
          You don't have an active {campaignType.toLowerCase()} subscription
          yet.
        </p>
        <button
          onClick={() => {
            const event = new CustomEvent("switchTab", { detail: "plans" });
            window.dispatchEvent(event);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
        >
          View Available Plans
        </button>
      </div>
    );
  }

  const todayUsage = subscription.todayUsage?.emailsSent || 0;
  const dailyUsagePercent = (todayUsage / subscription.dailyLimit) * 100;

  // Parse usage data
  const currentUsage =
    usageData?.data?.currentUsage || usageData?.currentUsage || 0;
  const remainingLimit =
    limitData?.data?.remaining || limitData?.remaining || 0;
  const canSendMore = limitData?.data?.canSend || limitData?.canSend || true;

  return (
    <div className="space-y-6">
      {/* Subscription Header */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {subscription.planName} Plan
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                ACTIVE
              </span>
            </div>
            <p className="text-gray-600">
              {formatCurrency(subscription.monthlyPrice)} per month
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Next Renewal</p>
            <p className="font-semibold text-gray-900">
              {new Date(subscription.nextRenewalDate).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        </div>

        {/* Auto Renew Status */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            subscription.autoRenew
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">
            Auto-renewal {subscription.autoRenew ? "enabled" : "disabled"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={handleToggleAutoRenew}
          disabled={actionLoading === "autorenew"}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-medium text-gray-700 hover:text-blue-600 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          {actionLoading === "autorenew"
            ? "Processing..."
            : subscription.autoRenew
            ? "Disable Auto-Renew"
            : "Enable Auto-Renew"}
        </button>

        <button
          onClick={handleRenewSubscription}
          disabled={actionLoading === "renew"}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition font-medium text-gray-700 hover:text-green-600 disabled:opacity-50"
        >
          <TrendingUp className="w-4 h-4" />
          {actionLoading === "renew" ? "Processing..." : "Renew Now"}
        </button>

        <button
          onClick={() => onChangePlan?.(subscription.id)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition font-medium text-gray-700 hover:text-purple-600"
        >
          <Edit className="w-4 h-4" />
          Change Plan
        </button>

        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition font-medium text-red-600 hover:text-red-700"
        >
          <XCircle className="w-4 h-4" />
          Cancel Plan
        </button>
      </div>

      {/* Limit Check Warning */}
      {!canSendMore && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 mb-1">
              Limit Reached
            </p>
            <p className="text-sm text-red-700">
              You've reached your subscription limit. Consider upgrading your
              plan.
            </p>
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Usage */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Today's Usage
            </span>
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {todayUsage.toLocaleString()}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Daily Limit</span>
              <span className="font-medium text-gray-900">
                {subscription.dailyLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  dailyUsagePercent >= 80 ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {dailyUsagePercent.toFixed(1)}% used
            </p>
          </div>
        </div>

        {/* Monthly Usage (from API) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Current Usage
            </span>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {currentUsage.toLocaleString()}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium text-gray-900">
                {remainingLimit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* User Limit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              User Accounts
            </span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {subscription.userLimit}
          </p>
          <p className="text-sm text-gray-600">
            {subscription.userLimit === 1 ? "account" : "accounts"} allowed
          </p>
        </div>

        {/* Schedule Limit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Active Schedules
            </span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {subscription.scheduleLimit}
          </p>
          <p className="text-sm text-gray-600">schedules allowed</p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Plan Features
        </h4>
        <ul className="space-y-3">
          {subscription.planConfig.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Period */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Subscription Period
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Started</p>
            <p className="font-medium text-gray-900">
              {new Date(subscription.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Expires</p>
            <p className="font-medium text-gray-900">
              {new Date(subscription.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Cancel Subscription
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your {subscription.planName}{" "}
              subscription? You'll lose access to premium features at the end of
              your billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading === "cancel"}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {actionLoading === "cancel" ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptionTab;

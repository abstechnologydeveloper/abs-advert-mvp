// ==================== ActiveSubscriptionTab.tsx Component ====================
import React from "react";
import { Calendar, Mail, Users, Clock, RefreshCw, Shield } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { ActiveSubscription } from "../types/billing.types";

interface ActiveSubscriptionTabProps {
  activeSubscriptions: ActiveSubscription[];
  campaignType: string;
}

const ActiveSubscriptionTab: React.FC<ActiveSubscriptionTabProps> = ({
  activeSubscriptions,
  campaignType,
}) => {
  const subscription = activeSubscriptions.find(
    (sub) =>
      sub.campaignType.toUpperCase() === campaignType.toUpperCase() &&
      sub.status === "ACTIVE"
  );

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

        {/* Monthly Limit */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Monthly Limit
            </span>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {subscription.monthlyLimit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">emails per month</p>
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
    </div>
  );
};

export default ActiveSubscriptionTab;

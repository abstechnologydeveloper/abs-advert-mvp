// ==================== components/SubscriptionDetailsModal.tsx ====================
import React from "react";
import {
  X,
  Calendar,
  DollarSign,
  Mail,
  Activity,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useGetSubscriptionByIdQuery } from "../../../redux/biling/billing-api";

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
}

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  isOpen,
  onClose,
  subscriptionId,
}) => {
  const { data, isLoading, error } = useGetSubscriptionByIdQuery(
    subscriptionId,
    {
      skip: !isOpen || !subscriptionId,
    }
  );

  if (!isOpen) return null;

  const subscription = data?.data || data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Subscription Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading subscription details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">
                Failed to load subscription details
              </p>
            </div>
          ) : !subscription ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No subscription data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Plan Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {subscription.planName || subscription.planTier} Plan
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {subscription.campaignType} Campaign
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      subscription.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : subscription.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : subscription.status === "EXPIRED"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {subscription.status}
                  </span>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Monthly Price
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      subscription.monthlyPrice || subscription.amount || 0
                    )}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Auto Renewal
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.autoRenew ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              {/* Limits */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Plan Limits
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Daily Limit</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.dailyLimit?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Limit</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.monthlyLimit?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">User Limit</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.userLimit || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Schedule Limit</p>
                    <p className="text-xl font-bold text-gray-900">
                      {subscription.scheduleLimit || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Subscription Period
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-600">Start Date</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <p className="text-sm text-gray-600">End Date</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(subscription.endDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  {subscription.nextRenewalDate && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-gray-600">Next Renewal</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(
                          subscription.nextRenewalDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {subscription.planConfig?.features && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Plan Features
                  </h4>
                  <ul className="space-y-3">
                    {subscription.planConfig.features.map(
                      (feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Today's Usage */}
              {subscription.todayUsage && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Today's Usage
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">
                    {subscription.todayUsage.emailsSent?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    emails sent today
                  </p>
                </div>
              )}

              {/* Additional Info */}
              {subscription.cancelledAt && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Cancellation Date
                  </p>
                  <p className="text-red-700">
                    {new Date(subscription.cancelledAt).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsModal;

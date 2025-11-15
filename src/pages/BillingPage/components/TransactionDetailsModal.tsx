// ==================== components/TransactionDetailsModal.tsx ====================
import React from "react";
import {
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useGetTransactionByIdQuery } from "../../../redux/biling/billing-api";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const { data, isLoading, error } = useGetTransactionByIdQuery(transactionId, {
    skip: !isOpen || !transactionId,
  });

  if (!isOpen) return null;

  const transaction = data?.data || data;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Completed",
        };
      case "FAILED":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Failed",
        };
      case "PENDING":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          label: "Pending",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: status,
        };
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "CREDIT":
        return {
          icon: ArrowDownCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Credit",
        };
      case "DEBIT":
        return {
          icon: ArrowUpCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Debit",
        };
      default:
        return {
          icon: DollarSign,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          label: type,
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Transaction Details
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
              <p className="text-gray-600">Loading transaction details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">
                Failed to load transaction details
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Please try again later
              </p>
            </div>
          ) : !transaction ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No transaction data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount & Type */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {(() => {
                      const typeConfig = getTypeConfig(transaction.type);
                      const TypeIcon = typeConfig.icon;
                      return (
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${typeConfig.bgColor}`}
                        >
                          <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                          <span className={`font-semibold ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                        </div>
                      );
                    })()}
                    {(() => {
                      const statusConfig = getStatusConfig(transaction.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                        >
                          <StatusIcon
                            className={`w-5 h-5 ${statusConfig.color}`}
                          />
                          <span
                            className={`font-semibold ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Transaction Information
                </h4>
                <div className="space-y-4">
                  {/* Transaction ID */}
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        Transaction ID
                      </p>
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {transaction.id || transaction.transactionId || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Reference */}
                  {transaction.reference && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Reference</p>
                        <p className="text-gray-900 font-mono text-sm break-all">
                          {transaction.reference}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {transaction.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Description
                        </p>
                        <p className="text-gray-900">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Created At</p>
                      <p className="text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Updated Date */}
                  {transaction.updatedAt && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Last Updated
                        </p>
                        <p className="text-gray-900">
                          {new Date(transaction.updatedAt).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Balance Info */}
              {(transaction.balanceBefore !== undefined ||
                transaction.balanceAfter !== undefined) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Balance Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {transaction.balanceBefore !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Balance Before
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(transaction.balanceBefore)}
                        </p>
                      </div>
                    )}
                    {transaction.balanceAfter !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Balance After
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(transaction.balanceAfter)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {transaction.metadata &&
                Object.keys(transaction.metadata).length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Additional Information
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(transaction.metadata).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                          >
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Payment Gateway Info */}
              {transaction.paymentGateway && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="text-sm text-blue-900 mb-1">Payment Gateway</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {transaction.paymentGateway}
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

export default TransactionDetailsModal;

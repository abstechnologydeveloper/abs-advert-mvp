// ==================== components/TransactionHistory.tsx ====================
import React from "react";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { Transaction } from "../types/billing.types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">All Transactions</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Type */}
                  <td className="py-4 px-4">
                    {transaction.type === "CREDIT" ? (
                      <div className="flex items-center space-x-2">
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Credit
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-600">
                          Debit
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {transaction.date}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right">
                    <span
                      className={`font-semibold ${
                        transaction.type === "CREDIT"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "CREDIT" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-right">
                    {transaction.status === "COMPLETED" && (
                      <CheckCircle className="w-5 h-5 text-green-500 inline" />
                    )}
                    {transaction.status === "PENDING" && (
                      <Clock className="w-5 h-5 text-yellow-500 inline" />
                    )}
                    {transaction.status === "FAILED" && (
                      <AlertCircle className="w-5 h-5 text-red-500 inline" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;

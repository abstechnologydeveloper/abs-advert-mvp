/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Trash2,
  Star,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  campaignName: string;
  campaignType: "email" | "quills" | "blog" | "scholarship" | "library";
  amount: number;
  status: "completed" | "pending" | "failed";
  invoice?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank";
  last4: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "payment">("overview");

  const [stats] = useState({
    currentBalance: 1250.0,
    monthlySpend: 450.0,
    totalCampaigns: 12,
    pendingCharges: 125.5,
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN-001",
      date: "2025-11-05",
      campaignName: "Black Friday Sale Email",
      campaignType: "email",
      amount: 450.0,
      status: "completed",
      invoice: "INV-2025-001",
    },
    {
      id: "TXN-002",
      date: "2025-11-03",
      campaignName: "App Feature Launch",
      campaignType: "quills",
      amount: 320.5,
      status: "pending",
    },
    {
      id: "TXN-003",
      date: "2025-10-28",
      campaignName: "Blog Post Promotion",
      campaignType: "blog",
      amount: 180.0,
      status: "completed",
      invoice: "INV-2025-002",
    },
    {
      id: "TXN-004",
      date: "2025-10-25",
      campaignName: "Scholarship Announcement",
      campaignType: "scholarship",
      amount: 275.75,
      status: "completed",
      invoice: "INV-2025-003",
    },
    {
      id: "TXN-005",
      date: "2025-10-20",
      campaignName: "Library Resource Ads",
      campaignType: "library",
      amount: 195.0,
      status: "completed",
      invoice: "INV-2025-004",
    },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryDate: "08/27",
      isDefault: false,
    },
  ]);

  const getCampaignTypeColor = (type: string) => {
    const colors = {
      email: "bg-blue-100 text-blue-700",
      quills: "bg-purple-100 text-purple-700",
      blog: "bg-green-100 text-green-700",
      scholarship: "bg-orange-100 text-orange-700",
      library: "bg-pink-100 text-pink-700",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-600">Manage your campaigns spending and payment methods</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Current Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">${stats.currentBalance.toFixed(2)}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">This Month</p>
            <h3 className="text-2xl font-bold text-gray-900">${stats.monthlySpend.toFixed(2)}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Campaigns</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Pending Charges</p>
            <h3 className="text-2xl font-bold text-gray-900">${stats.pendingCharges.toFixed(2)}</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "history", label: "Transaction History" },
                { id: "payment", label: "Payment Methods" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 font-medium transition-all relative ${
                    activeTab === tab.id ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Summary</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your current billing period: Nov 1 - Nov 30, 2025
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completed Campaigns:</span>
                          <span className="font-semibold text-gray-900">$1,125.50</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending Campaigns:</span>
                          <span className="font-semibold text-gray-900">$125.50</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total Due:</span>
                            <span className="font-bold text-gray-900 text-lg">$1,251.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Calendar className="w-12 h-12 text-blue-600 opacity-50" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {transaction.campaignName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${getCampaignTypeColor(
                                  transaction.campaignType
                                )}`}
                              >
                                {transaction.campaignType}
                              </span>
                              <span className="text-sm text-gray-500">{transaction.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </p>
                          {transaction.invoice && (
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span>Invoice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction History Tab */}
            {activeTab === "history" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">All Transactions</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Campaign
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-4">{getStatusIcon(transaction.status)}</td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{transaction.campaignName}</p>
                            <p className="text-xs text-gray-500">{transaction.id}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${getCampaignTypeColor(
                                transaction.campaignType
                              )}`}
                            >
                              {transaction.campaignType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">
                            ${transaction.amount.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {transaction.invoice ? (
                              <button className="text-blue-600 hover:text-blue-700 flex items-center justify-end space-x-1">
                                <Download className="w-4 h-4" />
                                <span className="text-sm">PDF</span>
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Saved Payment Methods</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative p-6 rounded-2xl border-2 transition hover:shadow-lg ${
                        method.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      {method.isDefault && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Default</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {method.brand} •••• {method.last4}
                          </p>
                          {method.expiryDate && (
                            <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                        {!method.isDefault && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Set as Default
                          </button>
                        )}
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 mb-1">Automatic Billing</p>
                    <p className="text-sm text-yellow-700">
                      Your default payment method will be charged automatically when campaigns are
                      approved and launched.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;

import React, { useState } from "react";
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Mail,
  Smartphone,
  BookOpen,
  GraduationCap,
  Crown,
  Info,
} from "lucide-react";

// Plan configurations matching your backend
const PLAN_CONFIGS = {
  Basic: {
    name: "Basic",
    price: 170000,
    currency: "NGN",
    dailyEmailLimit: 5000,
    monthlyEmailLimit: 150000,
    contactLimit: 5000,
    userLimit: 1,
    scheduleLimit: 5,
    allowRecurring: true,
    recurringFrequencies: ["weekly"],
    reportType: "basic",
    supportType: "email",
    features: [
      "5,000 emails/day (~150,000/month)",
      "5,000 contacts",
      "1 user",
      "2 schedules (weekly recurring)",
      "Standard templates",
      "Basic reports",
      "Email support",
    ],
    campaignTypes: ["email"],
  },
  Growth: {
    name: "Growth",
    price: 280000,
    currency: "NGN",
    dailyEmailLimit: 10000,
    monthlyEmailLimit: 300000,
  
    userLimit: 2,
    scheduleLimit: 12,
    allowRecurring: true,
    recurringFrequencies: ["daily", "weekly", "monthly"],
    reportType: "standard",
    supportType: "chat",
    features: [
      "10,000 emails/day (~300,000/month)",
      "10,000 contacts",
      "2 users",
      "Unlimited schedules",
      "All campaign types",
      "Standard reports",
      "Chat support",
    ],
    campaignTypes: ["email", "quills", "blog"],
  },
  Pro: {
    name: "Pro",
    price: 450000,
    currency: "NGN",
    dailyEmailLimit: 25000,
    monthlyEmailLimit: 750000,
    userLimit: 3,
    scheduleLimit: 30,
    allowRecurring: true,
    recurringFrequencies: ["daily", "weekly", "monthly"],
    reportType: "extended",
    supportType: "priority",
    features: [
      "25,000 emails/day (~750,000/month)",
      "25,000 contacts",
      "3 users",
      "Unlimited schedules",
      "All campaign types",
      "Extended reports & insights",
      "Priority support",
    ],
    campaignTypes: ["email", "quills", "blog", "scholarship"],
  },
  Enterprise: {
    name: "Enterprise",
    price: 650000,
    currency: "NGN",
    dailyEmailLimit: 50000,
    monthlyEmailLimit: 1500000,
    contactLimit: 50000,
    userLimit: 5,
    scheduleLimit: null,
    allowRecurring: true,
    recurringFrequencies: ["daily", "weekly", "monthly"],
    reportType: "full",
    supportType: "priority",
    features: [
      "50,000+ emails/day (~1.5M+/month)",
      "50,000+ contacts",
      "5+ users",
      "Unlimited schedules",
      "All campaign types",
      "Full summary reporting",
      "Dedicated support",
    ],
    campaignTypes: ["email", "quills", "blog", "scholarship", "library"],
  },
};

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  status: "completed" | "pending" | "failed";
  reference: string;
}

interface Subscription {
  planName: keyof typeof PLAN_CONFIGS;
  status: "active" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "plans" | "history" | "wallet">(
    "overview"
  );
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLAN_CONFIGS | null>(null);

  // Mock data - replace with actual API calls
  const [walletBalance] = useState(100000);
  const [subscription] = useState<Subscription>({
    planName: "Basic",
    status: "active",
    startDate: "2025-11-01",
    endDate: "2025-12-01",
    autoRenew: true,
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN-001",
      date: "2025-11-05",
      description: "Wallet funding via Paystack",
      type: "credit",
      amount: 100000,
      status: "completed",
      reference: "PSK-2025-001",
    },
    {
      id: "TXN-002",
      date: "2025-11-01",
      description: "Basic Plan Subscription",
      type: "debit",
      amount: 170000,
      status: "completed",
      reference: "SUB-2025-001",
    },
    {
      id: "TXN-003",
      date: "2025-10-28",
      description: "Wallet funding via Paystack",
      type: "credit",
      amount: 200000,
      status: "completed",
      reference: "PSK-2025-002",
    },
  ]);

  const [usage] = useState({
    emailsSentToday: 1250,
    emailsSentThisMonth: 45000,
    contactsCount: 3200,
    activeSchedules: 1,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSubscriptionCost = (planName: keyof typeof PLAN_CONFIGS) => {
    const planPrice = PLAN_CONFIGS[planName].price;
    const shortfall = Math.max(0, planPrice - walletBalance);
    const canAfford = walletBalance >= planPrice;

    return {
      planPrice,
      walletBalance,
      shortfall,
      canAfford,
      willUse: Math.min(walletBalance, planPrice),
    };
  };

  const getPlanIcon = (planName: string) => {
    const icons = {
      Basic: Shield,
      Growth: TrendingUp,
      Pro: Zap,
      Enterprise: Crown,
    };
    return icons[planName as keyof typeof icons] || Shield;
  };

  const getCampaignTypeIcon = (type: string) => {
    const icons = {
      email: Mail,
      quills: Smartphone,
      blog: FileText,
      scholarship: GraduationCap,
      library: BookOpen,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const currentPlan = PLAN_CONFIGS[subscription.planName];
  const usagePercentages = {
    dailyEmails: (usage.emailsSentToday / currentPlan.dailyEmailLimit) * 100,
    monthlyEmails: (usage.emailsSentThisMonth / currentPlan.monthlyEmailLimit) * 100,
    schedulesCount: usage.activeSchedules,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscriptions</h1>
          <p className="text-gray-600">
            Manage your wallet, subscription plans and campaign spending
          </p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-2">Wallet Balance</p>
              <h2 className="text-4xl font-bold">{formatCurrency(walletBalance)}</h2>
            </div>
            <Wallet className="w-16 h-16 text-white opacity-20" />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFundModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Fund Wallet</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition font-medium border border-white/20">
              <Download className="w-5 h-5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Current Subscription Overview */}
        {subscription.status === "active" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  {React.createElement(getPlanIcon(subscription.planName), {
                    className: "w-8 h-8 text-blue-600",
                  })}
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
                    {formatCurrency(currentPlan.price)}/month • Renews on{" "}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("plans")}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Upgrade Plan
              </button>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Daily Emails</span>
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {usage.emailsSentToday.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usagePercentages.dailyEmails >= 80 ? "bg-red-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(usagePercentages.dailyEmails, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {usagePercentages.dailyEmails.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  of {currentPlan.dailyEmailLimit.toLocaleString()} daily limit
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Monthly Emails</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {usage.emailsSentThisMonth.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usagePercentages.monthlyEmails >= 80 ? "bg-red-500" : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(usagePercentages.monthlyEmails, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {usagePercentages.monthlyEmails.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  of {currentPlan.monthlyEmailLimit.toLocaleString()} monthly limit
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Schedules</span>
                  <Clock className="w-4 h-4 text-gray-400" /> {/* changed icon */}
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {usage.activeSchedules.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usage.activeSchedules >= 80 ? "bg-red-500" : "bg-purple-600"
                      }`}
                      style={{ width: `${Math.min(usage.activeSchedules, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{usage.activeSchedules.toFixed(0)}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  of {currentPlan.scheduleLimit ? currentPlan.scheduleLimit.toLocaleString() : "∞"}{" "}
                  schedule limit
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "plans", label: "Available Plans" },
                { id: "history", label: "Transaction History" },
                { id: "wallet", label: "Wallet Details" },
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Type Access</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries({
                      email: "Email Campaigns",
                      quills: "Quills Ads",
                      blog: "Blog Ads",
                      scholarship: "Scholarship Ads",
                      library: "Library Ads",
                    }).map(([type, label]) => {
                      const isAvailable = currentPlan.campaignTypes.includes(type);
                      const Icon = getCampaignTypeIcon(type);
                      return (
                        <div
                          key={type}
                          className={`p-4 rounded-xl border-2 ${
                            isAvailable
                              ? "bg-white border-green-200"
                              : "bg-gray-50 border-gray-200 opacity-50"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 mb-2 ${
                              isAvailable ? "text-green-600" : "text-gray-400"
                            }`}
                          />
                          <p className="text-sm font-medium text-gray-900">{label}</p>
                          {isAvailable ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                          ) : (
                            <span className="text-xs text-gray-500 mt-1">Upgrade needed</span>
                          )}
                        </div>
                      );
                    })}
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
                          {transaction.type === "credit" ? (
                            <div className="p-2 bg-green-100 rounded-lg">
                              <ArrowDownRight className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-red-100 rounded-lg">
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.date} • {transaction.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "credit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === "plans" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">Payment from Wallet</p>
                    <p className="text-sm text-blue-700">
                      Subscription fees will be deducted from your wallet balance. If insufficient,
                      you'll need to fund your wallet first.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(PLAN_CONFIGS).map(([planName, plan]) => {
                    const isCurrentPlan = subscription.planName === planName;
                    const cost = calculateSubscriptionCost(planName as keyof typeof PLAN_CONFIGS);
                    const Icon = getPlanIcon(planName);

                    return (
                      <div
                        key={planName}
                        className={`relative rounded-2xl p-6 border-2 transition hover:shadow-lg ${
                          isCurrentPlan ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                        }`}
                      >
                        {isCurrentPlan && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                            Current Plan
                          </div>
                        )}

                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(plan.price)}
                              <span className="text-sm text-gray-600 font-normal">/month</span>
                            </p>
                          </div>
                        </div>

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

                        {!isCurrentPlan && (
                          <div className="space-y-3">
                            {!cost.canAfford && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm font-medium text-yellow-900 mb-1">
                                  Insufficient Balance
                                </p>
                                <p className="text-sm text-yellow-700">
                                  You need {formatCurrency(cost.shortfall)} more to subscribe
                                </p>
                              </div>
                            )}

                            {cost.canAfford && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700">
                                  {formatCurrency(cost.willUse)} will be deducted from your wallet
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                if (!cost.canAfford) {
                                  setShowFundModal(true);
                                } else {
                                  setSelectedPlan(planName as keyof typeof PLAN_CONFIGS);
                                }
                              }}
                              className={`w-full py-3 rounded-xl font-medium transition ${
                                cost.canAfford
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-yellow-600 text-white hover:bg-yellow-700"
                              }`}
                            >
                              {cost.canAfford ? "Subscribe Now" : "Fund Wallet First"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                    <span>Export CSV</span>
                  </button>
                </div>

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
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Reference
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
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-4">
                            {transaction.type === "credit" ? (
                              <div className="flex items-center space-x-2">
                                <ArrowDownRight className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">Credit</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <ArrowUpRight className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">Debit</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {transaction.reference}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span
                              className={`font-semibold ${
                                transaction.type === "credit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {transaction.status === "completed" && (
                              <CheckCircle className="w-5 h-5 text-green-500 inline" />
                            )}
                            {transaction.status === "pending" && (
                              <Clock className="w-5 h-5 text-yellow-500 inline" />
                            )}
                            {transaction.status === "failed" && (
                              <AlertCircle className="w-5 h-5 text-red-500 inline" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Wallet Details Tab */}
            {activeTab === "wallet" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <DollarSign className="w-8 h-8 mb-4 opacity-80" />
                    <p className="text-green-100 text-sm mb-2">Available Balance</p>
                    <h3 className="text-3xl font-bold">{formatCurrency(walletBalance)}</h3>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <ArrowDownRight className="w-8 h-8 mb-4 opacity-80" />
                    <p className="text-blue-100 text-sm mb-2">Total Credits</p>
                    <h3 className="text-3xl font-bold">
                      {formatCurrency(
                        transactions
                          .filter((t) => t.type === "credit" && t.status === "completed")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </h3>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <ArrowUpRight className="w-8 h-8 mb-4 opacity-80" />
                    <p className="text-purple-100 text-sm mb-2">Total Debits</p>
                    <h3 className="text-3xl font-bold">
                      {formatCurrency(
                        transactions
                          .filter((t) => t.type === "debit" && t.status === "completed")
                          .reduce((sum, t) => sum + t.amount, 0)
                      )}
                    </h3>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Wallet Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          How Wallet Payments Work
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Subscription fees are automatically deducted from your wallet</li>
                          <li>• Fund your wallet via Paystack for instant credit</li>
                          <li>• Minimum funding amount: ₦10,000</li>
                          <li>• Withdrawals processed within 24-48 hours</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900 mb-1">
                          Subscription Payment Process
                        </p>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• If wallet balance ≥ plan price: Full deduction from wallet</li>
                          <li>
                            • If wallet balance &lt; plan price: You'll be prompted to fund the
                            shortfall
                          </li>
                          <li>• Example: ₦100,000 balance + ₦170,000 plan = Fund ₦70,000 more</li>
                          <li>• Auto-renewal uses wallet balance each billing cycle</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-900 mb-1">
                          Important Reminders
                        </p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>
                            • Ensure sufficient wallet balance before renewal date to avoid service
                            interruption
                          </li>
                          <li>• Failed auto-renewals will suspend your subscription</li>
                          <li>• You'll receive notifications 7 days before renewal</li>
                          <li>• All transactions are secured and encrypted</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowFundModal(true)}
                      className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Fund Wallet</p>
                          <p className="text-sm text-gray-600">Add money via Paystack</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                    </button>

                    <button className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <Download className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Withdraw Funds</p>
                          <p className="text-sm text-gray-600">Transfer to bank account</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </button>

                    <button className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-600 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Transaction Statement</p>
                          <p className="text-sm text-gray-600">Download full history</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-purple-600" />
                    </button>

                    <button className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-600 rounded-lg">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Security Settings</p>
                          <p className="text-sm text-gray-600">Manage wallet security</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Fund Your Wallet</h3>
              <button
                onClick={() => setShowFundModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-2xl text-gray-600">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NGN)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="10000"
                  min="10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">Minimum: ₦10,000</p>
              </div>

              {selectedPlan && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Funding for {selectedPlan} Plan
                  </p>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Plan Price:</span>
                      <span className="font-medium">
                        {formatCurrency(PLAN_CONFIGS[selectedPlan].price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Balance:</span>
                      <span className="font-medium">{formatCurrency(walletBalance)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200">
                      <span className="font-medium">Required:</span>
                      <span className="font-bold">
                        {formatCurrency(
                          Math.max(0, PLAN_CONFIGS[selectedPlan].price - walletBalance)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h4>
                <div className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <img
                    src="https://paystack.com/assets/img/logo/logo.svg"
                    alt="Paystack"
                    className="h-6"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Paystack</p>
                    <p className="text-xs text-gray-500">Card, Bank Transfer, USSD</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <button
                onClick={() => {
                  // Handle Paystack payment
                  alert(`Initiating payment for ${formatCurrency(parseInt(fundAmount) || 0)}`);
                  setShowFundModal(false);
                }}
                disabled={!fundAmount || parseInt(fundAmount) < 10000}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>

              <p className="text-xs text-gray-500 text-center">
                Secured by Paystack • Your transaction is encrypted and safe
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Confirmation Modal */}
      {selectedPlan && !showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Confirm Subscription</h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-2xl text-gray-600">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl">
                    {React.createElement(getPlanIcon(selectedPlan), {
                      className: "w-6 h-6 text-white",
                    })}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedPlan} Plan</h4>
                    <p className="text-sm text-gray-600">Monthly Subscription</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(PLAN_CONFIGS[selectedPlan].price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Balance:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(walletBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-medium text-gray-900">Amount to Deduct:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(Math.min(walletBalance, PLAN_CONFIGS[selectedPlan].price))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Remaining Balance:</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(
                        Math.max(0, walletBalance - PLAN_CONFIGS[selectedPlan].price)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">What You'll Get:</h4>
                <ul className="space-y-1">
                  {PLAN_CONFIGS[selectedPlan].features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle subscription
                    alert(`Subscribing to ${selectedPlan} plan...`);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Confirm & Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;

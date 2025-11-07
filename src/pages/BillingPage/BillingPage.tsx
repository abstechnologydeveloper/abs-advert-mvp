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
  X,
} from "lucide-react";

// ============== CAMPAIGN TYPE CONFIGS ==============
const CAMPAIGN_TYPES = {
  email: {
    id: "email",
    label: "Email Campaigns",
    icon: Mail,
    plans: {
      Basic: {
        name: "Basic",
        price: 170000,
        dailyLimit: 5000,
        monthlyLimit: 150000,
        contactLimit: 5000,
        userLimit: 1,
        scheduleLimit: 5,
        features: [
          "5,000 emails/day",
          "5,000 contacts",
          "1 user account",
          "5 schedules",
          "Basic templates",
          "Email support",
        ],
      },
      Growth: {
        name: "Growth",
        price: 280000,
        dailyLimit: 10000,
        monthlyLimit: 300000,
        contactLimit: 10000,
        userLimit: 2,
        scheduleLimit: 12,
        features: [
          "10,000 emails/day",
          "10,000 contacts",
          "2 user accounts",
          "12 schedules",
          "All templates",
          "Chat support",
        ],
      },
      Pro: {
        name: "Pro",
        price: 450000,
        dailyLimit: 25000,
        monthlyLimit: 750000,
        contactLimit: 25000,
        userLimit: 3,
        scheduleLimit: 30,
        features: [
          "25,000 emails/day",
          "25,000 contacts",
          "3 user accounts",
          "30 schedules",
          "Premium templates",
          "Priority support",
        ],
      },
      Enterprise: {
        name: "Enterprise",
        price: 650000,
        dailyLimit: 50000,
        monthlyLimit: 1500000,
        contactLimit: 50000,
        userLimit: 5,
        scheduleLimit: null,
        features: [
          "50,000+ emails/day",
          "50,000+ contacts",
          "5+ user accounts",
          "Unlimited schedules",
          "Custom templates",
          "Dedicated support",
        ],
      },
    },
  },
  quills: {
    id: "quills",
    label: "Quills Ads",
    icon: Smartphone,
    plans: {
      Basic: {
        name: "Basic",
        price: 150000,
        dailyLimit: 3000,
        monthlyLimit: 90000,
        impressionLimit: 50000,
        userLimit: 1,
        scheduleLimit: 3,
        features: [
          "3,000 ads/day",
          "50,000 impressions/month",
          "1 user account",
          "3 schedules",
          "Standard placements",
          "Email support",
        ],
      },
      Growth: {
        name: "Growth",
        price: 250000,
        dailyLimit: 7000,
        monthlyLimit: 210000,
        impressionLimit: 150000,
        userLimit: 2,
        scheduleLimit: 10,
        features: [
          "7,000 ads/day",
          "150,000 impressions/month",
          "2 user accounts",
          "10 schedules",
          "Premium placements",
          "Chat support",
        ],
      },
      Pro: {
        name: "Pro",
        price: 400000,
        dailyLimit: 15000,
        monthlyLimit: 450000,
        impressionLimit: 500000,
        userLimit: 3,
        scheduleLimit: 25,
        features: [
          "15,000 ads/day",
          "500,000 impressions/month",
          "3 user accounts",
          "25 schedules",
          "Priority placements",
          "Priority support",
        ],
      },
      Enterprise: {
        name: "Enterprise",
        price: 600000,
        dailyLimit: 30000,
        monthlyLimit: 900000,
        impressionLimit: 1000000,
        userLimit: 5,
        scheduleLimit: null,
        features: [
          "30,000+ ads/day",
          "1M+ impressions/month",
          "5+ user accounts",
          "Unlimited schedules",
          "Custom placements",
          "Dedicated support",
        ],
      },
    },
  },
  blog: {
    id: "blog",
    label: "Blog Ads",
    icon: FileText,
    plans: {
      Basic: {
        name: "Basic",
        price: 120000,
        dailyLimit: 2000,
        monthlyLimit: 60000,
        postLimit: 100,
        userLimit: 1,
        scheduleLimit: 5,
        features: [
          "2,000 ads/day",
          "100 blog posts",
          "1 user account",
          "5 schedules",
          "Standard visibility",
          "Email support",
        ],
      },
      Growth: {
        name: "Growth",
        price: 220000,
        dailyLimit: 5000,
        monthlyLimit: 150000,
        postLimit: 300,
        userLimit: 2,
        scheduleLimit: 12,
        features: [
          "5,000 ads/day",
          "300 blog posts",
          "2 user accounts",
          "12 schedules",
          "Enhanced visibility",
          "Chat support",
        ],
      },
      Pro: {
        name: "Pro",
        price: 350000,
        dailyLimit: 10000,
        monthlyLimit: 300000,
        postLimit: 1000,
        userLimit: 3,
        scheduleLimit: 20,
        features: [
          "10,000 ads/day",
          "1,000 blog posts",
          "3 user accounts",
          "20 schedules",
          "Priority visibility",
          "Priority support",
        ],
      },
      Enterprise: {
        name: "Enterprise",
        price: 550000,
        dailyLimit: 20000,
        monthlyLimit: 600000,
        postLimit: null,
        userLimit: 5,
        scheduleLimit: null,
        features: [
          "20,000+ ads/day",
          "Unlimited blog posts",
          "5+ user accounts",
          "Unlimited schedules",
          "Featured visibility",
          "Dedicated support",
        ],
      },
    },
  },
  scholarship: {
    id: "scholarship",
    label: "Scholarship Ads",
    icon: GraduationCap,
    plans: {
      Basic: {
        name: "Basic",
        price: 100000,
        dailyLimit: 1000,
        monthlyLimit: 30000,
        listingLimit: 50,
        userLimit: 1,
        scheduleLimit: 3,
        features: [
          "1,000 ads/day",
          "50 scholarship listings",
          "1 user account",
          "3 schedules",
          "Standard reach",
          "Email support",
        ],
      },
      Growth: {
        name: "Growth",
        price: 200000,
        dailyLimit: 3000,
        monthlyLimit: 90000,
        listingLimit: 150,
        userLimit: 2,
        scheduleLimit: 8,
        features: [
          "3,000 ads/day",
          "150 scholarship listings",
          "2 user accounts",
          "8 schedules",
          "Enhanced reach",
          "Chat support",
        ],
      },
      Pro: {
        name: "Pro",
        price: 320000,
        dailyLimit: 7000,
        monthlyLimit: 210000,
        listingLimit: 500,
        userLimit: 3,
        scheduleLimit: 15,
        features: [
          "7,000 ads/day",
          "500 scholarship listings",
          "3 user accounts",
          "15 schedules",
          "Priority reach",
          "Priority support",
        ],
      },
      Enterprise: {
        name: "Enterprise",
        price: 500000,
        dailyLimit: 15000,
        monthlyLimit: 450000,
        listingLimit: null,
        userLimit: 5,
        scheduleLimit: null,
        features: [
          "15,000+ ads/day",
          "Unlimited listings",
          "5+ user accounts",
          "Unlimited schedules",
          "Maximum reach",
          "Dedicated support",
        ],
      },
    },
  },
  library: {
    id: "library",
    label: "Library Ads",
    icon: BookOpen,
    plans: {
      Basic: {
        name: "Basic",
        price: 90000,
        dailyLimit: 800,
        monthlyLimit: 24000,
        bookLimit: 100,
        userLimit: 1,
        scheduleLimit: 3,
        features: [
          "800 ads/day",
          "100 books/resources",
          "1 user account",
          "3 schedules",
          "Basic catalog",
          "Email support",
        ],
      },
      Growth: {
        name: "Growth",
        price: 180000,
        dailyLimit: 2000,
        monthlyLimit: 60000,
        bookLimit: 300,
        userLimit: 2,
        scheduleLimit: 8,
        features: [
          "2,000 ads/day",
          "300 books/resources",
          "2 user accounts",
          "8 schedules",
          "Enhanced catalog",
          "Chat support",
        ],
      },
      Pro: {
        name: "Pro",
        price: 300000,
        dailyLimit: 5000,
        monthlyLimit: 150000,
        bookLimit: 1000,
        userLimit: 3,
        scheduleLimit: 15,
        features: [
          "5,000 ads/day",
          "1,000 books/resources",
          "3 user accounts",
          "15 schedules",
          "Premium catalog",
          "Priority support",
        ],
      },
      Enterprise: {
        name: "Enterprise",
        price: 480000,
        dailyLimit: 10000,
        monthlyLimit: 300000,
        bookLimit: null,
        userLimit: 5,
        scheduleLimit: null,
        features: [
          "10,000+ ads/day",
          "Unlimited resources",
          "5+ user accounts",
          "Unlimited schedules",
          "Custom catalog",
          "Dedicated support",
        ],
      },
    },
  },
};

// ============== UTILITY FUNCTIONS ==============
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getPlanIcon = (planName) => {
  const icons = { Basic: Shield, Growth: TrendingUp, Pro: Zap, Enterprise: Crown };
  return icons[planName] || Shield;
};

// ============== WALLET CARD COMPONENT ==============
const WalletCard = ({ balance, onFund, onWithdraw }) => (
  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-blue-100 text-sm mb-2">Wallet Balance</p>
        <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
        <p className="text-blue-100 text-sm mt-2">Available for all campaigns</p>
      </div>
      <Wallet className="w-16 h-16 text-white opacity-20" />
    </div>
    <div className="flex space-x-4">
      <button
        onClick={onFund}
        className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium"
      >
        <Plus className="w-5 h-5" />
        <span>Fund Wallet</span>
      </button>
      <button
        onClick={onWithdraw}
        className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition font-medium border border-white/20"
      >
        <Download className="w-5 h-5" />
        <span>Withdraw</span>
      </button>
    </div>
  </div>
);

// ============== CAMPAIGN TYPE SELECTOR ==============
const CampaignTypeSelector = ({ selectedType, onSelect, subscriptions }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Campaign Type</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Object.values(CAMPAIGN_TYPES).map((type) => {
        const Icon = type.icon;
        const subscription = subscriptions[type.id];
        const isActive = subscription?.status === "active";
        const isSelected = selectedType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`p-4 rounded-xl border-2 transition ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : isActive
                ? "border-green-200 bg-white hover:border-green-300"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <Icon
              className={`w-8 h-8 mb-2 mx-auto ${
                isSelected ? "text-blue-600" : isActive ? "text-green-600" : "text-gray-400"
              }`}
            />
            <p className="text-sm font-medium text-gray-900 text-center">{type.label}</p>
            {isActive && (
              <span className="text-xs text-green-600 font-medium block mt-1">Active</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

// ============== SUBSCRIPTION OVERVIEW ==============
const SubscriptionOverview = ({ campaignType, subscription, usage, onUpgrade }) => {
  if (!subscription || subscription.status !== "active") return null;

  const campaign = CAMPAIGN_TYPES[campaignType];
  const plan = campaign.plans[subscription.planName];
  const Icon = getPlanIcon(subscription.planName);

  const usagePercentages = {
    daily: (usage.dailySent / plan.dailyLimit) * 100,
    monthly: (usage.monthlySent / plan.monthlyLimit) * 100,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">{subscription.planName} Plan</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
            <p className="text-gray-600">
              {campaign.label} • {formatCurrency(plan.price)}/month • Renews{" "}
              {new Date(subscription.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
        >
          Change Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Daily Usage</span>
            <Mail className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {usage.dailySent.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercentages.daily >= 80 ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(usagePercentages.daily, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{usagePercentages.daily.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            of {plan.dailyLimit.toLocaleString()} daily limit
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Usage</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {usage.monthlySent.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  usagePercentages.monthly >= 80 ? "bg-red-500" : "bg-green-600"
                }`}
                style={{ width: `${Math.min(usagePercentages.monthly, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{usagePercentages.monthly.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            of {plan.monthlyLimit.toLocaleString()} monthly limit
          </p>
        </div>
      </div>
    </div>
  );
};

// ============== PLAN CARD ==============
const PlanCard = ({ campaignType, planName, plan, isCurrentPlan, walletBalance, onSubscribe }) => {
  const Icon = getPlanIcon(planName);
  const shortfall = Math.max(0, plan.price - walletBalance);
  const canAfford = walletBalance >= plan.price;

  return (
    <div
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
          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {!isCurrentPlan && (
        <div className="space-y-3">
          {!canAfford ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-900 mb-1">Insufficient Balance</p>
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

// ============== PLANS TAB ==============
const PlansTab = ({ campaignType, walletBalance, currentSubscription, onSubscribe }) => {
  const campaign = CAMPAIGN_TYPES[campaignType];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 mb-1">Payment from Wallet</p>
          <p className="text-sm text-blue-700">
            Subscription fees will be deducted from your wallet balance. If insufficient, you'll
            need to fund your wallet first.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(campaign.plans).map(([planName, plan]) => (
          <PlanCard
            key={planName}
            campaignType={campaignType}
            planName={planName}
            plan={plan}
            isCurrentPlan={
              currentSubscription?.planName === planName && currentSubscription?.status === "active"
            }
            walletBalance={walletBalance}
            onSubscribe={onSubscribe}
          />
        ))}
      </div>
    </div>
  );
};

// ============== TRANSACTION HISTORY ==============
const TransactionHistory = ({ transactions }) => (
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
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
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
);

// ============== FUND WALLET MODAL ==============
const FundWalletModal = ({ isOpen, onClose, onFund, selectedPlan }) => {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Fund Your Wallet</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NGN)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              min="10000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">Minimum: ₦10,000</p>
          </div>

          {selectedPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Funding for subscription</p>
              <p className="text-sm text-blue-700">
                Required amount: {formatCurrency(selectedPlan.shortfall)}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              onFund(parseInt(amount) || 0);
              onClose();
              setAmount("");
            }}
            disabled={!amount || parseInt(amount) < 10000}
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
  );
};

// ============== MAIN COMPONENT ==============
const BillingPage = () => {
  const [selectedCampaignType, setSelectedCampaignType] = useState("email");
  const [activeTab, setActiveTab] = useState("overview");
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedPlanForFunding, setSelectedPlanForFunding] = useState(null);

  // Mock data - replace with actual API calls
  const [walletBalance, setWalletBalance] = useState(100000);

  // Subscriptions per campaign type
  const [subscriptions, setSubscriptions] = useState({
    email: {
      planName: "Basic",
      status: "active",
      startDate: "2025-11-01",
      endDate: "2025-12-01",
      autoRenew: true,
    },
    quills: null,
    blog: null,
    scholarship: null,
    library: null,
  });

  // Usage per campaign type
  const [usage, setUsage] = useState({
    email: { dailySent: 1250, monthlySent: 45000 },
    quills: { dailySent: 0, monthlySent: 0 },
    blog: { dailySent: 0, monthlySent: 0 },
    scholarship: { dailySent: 0, monthlySent: 0 },
    library: { dailySent: 0, monthlySent: 0 },
  });

  const [transactions, setTransactions] = useState([
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
      description: "Email Campaigns - Basic Plan",
      type: "debit",
      amount: 170000,
      status: "completed",
      reference: "SUB-EMAIL-001",
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

  const handleFundWallet = (amount) => {
    setWalletBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: "Wallet funding via Paystack",
        type: "credit",
        amount: amount,
        status: "completed",
        reference: `PSK-${Date.now()}`,
      },
      ...prev,
    ]);
  };

  const handleSubscribe = (campaignType, planName, canAfford) => {
    if (!canAfford) {
      const plan = CAMPAIGN_TYPES[campaignType].plans[planName];
      setSelectedPlanForFunding({
        campaignType,
        planName,
        shortfall: Math.max(0, plan.price - walletBalance),
      });
      setShowFundModal(true);
      return;
    }

    const plan = CAMPAIGN_TYPES[campaignType].plans[planName];

    // Deduct from wallet
    setWalletBalance((prev) => prev - plan.price);

    // Update subscription
    setSubscriptions((prev) => ({
      ...prev,
      [campaignType]: {
        planName: planName,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        autoRenew: true,
      },
    }));

    // Add transaction
    setTransactions((prev) => [
      {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: `${CAMPAIGN_TYPES[campaignType].label} - ${planName} Plan`,
        type: "debit",
        amount: plan.price,
        status: "completed",
        reference: `SUB-${campaignType.toUpperCase()}-${Date.now()}`,
      },
      ...prev,
    ]);

    alert(`Successfully subscribed to ${planName} plan for ${CAMPAIGN_TYPES[campaignType].label}!`);
  };

  const currentSubscription = subscriptions[selectedCampaignType];
  const currentUsage = usage[selectedCampaignType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscriptions</h1>
          <p className="text-gray-600">Manage your wallet and campaign subscriptions</p>
        </div>

        {/* Wallet Balance Card */}
        <WalletCard
          balance={walletBalance}
          onFund={() => setShowFundModal(true)}
          onWithdraw={() => alert("Withdraw functionality coming soon")}
        />

        {/* Campaign Type Selector */}
        <CampaignTypeSelector
          selectedType={selectedCampaignType}
          onSelect={setSelectedCampaignType}
          subscriptions={subscriptions}
        />

        {/* Current Subscription Overview */}
        <SubscriptionOverview
          campaignType={selectedCampaignType}
          subscription={currentSubscription}
          usage={currentUsage}
          onUpgrade={() => setActiveTab("plans")}
        />

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "plans", label: "Available Plans" },
                { id: "history", label: "Transaction History" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
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

                {/* Active Subscriptions Summary */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Active Subscriptions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(subscriptions).map(([type, sub]) => {
                      if (!sub || sub.status !== "active") return null;
                      const campaign = CAMPAIGN_TYPES[type];
                      const plan = campaign.plans[sub.planName];
                      const Icon = campaign.icon;

                      return (
                        <div
                          key={type}
                          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="font-semibold text-gray-900">{campaign.label}</p>
                              <p className="text-sm text-gray-600">
                                {sub.planName} Plan • {formatCurrency(plan.price)}/mo
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            Renews: {new Date(sub.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Plans Tab */}
            {activeTab === "plans" && (
              <PlansTab
                campaignType={selectedCampaignType}
                walletBalance={walletBalance}
                currentSubscription={currentSubscription}
                onSubscribe={handleSubscribe}
              />
            )}

            {/* Transaction History Tab */}
            {activeTab === "history" && <TransactionHistory transactions={transactions} />}
          </div>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => {
          setShowFundModal(false);
          setSelectedPlanForFunding(null);
        }}
        onFund={handleFundWallet}
        selectedPlan={selectedPlanForFunding}
      />
    </div>
  );
};

export default BillingPage;

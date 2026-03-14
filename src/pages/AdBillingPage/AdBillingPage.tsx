import React from "react";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  useGetAdWalletQuery,
  useFundAdWalletMutation,
  type SelfServeAdWalletTransaction,
} from "../../redux/self-serve-ads/self-serve-ads-api";

const TX_STATUS_ICONS: Record<string, React.ReactNode> = {
  COMPLETED: <CheckCircle2 className="w-3 h-3" />,
  PENDING: <Clock className="w-3 h-3" />,
  FAILED: <XCircle className="w-3 h-3" />,
};

function txStatusStyle(tx: SelfServeAdWalletTransaction): string {
  if (tx.status === "PENDING") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (tx.status === "FAILED")  return "bg-red-50 text-red-700 border border-red-200";
  // COMPLETED spend → neutral grey (it's a deduction, not a success to celebrate)
  if (tx.type === "CAMPAIGN_SPEND") return "bg-gray-100 text-gray-600 border border-gray-200";
  // COMPLETED credit → green
  return "bg-green-50 text-green-700 border border-green-200";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TransactionRow: React.FC<{ tx: SelfServeAdWalletTransaction }> = ({ tx }) => {
  const isCredit = tx.type === "CREDIT";
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className={`p-2 rounded-xl shrink-0 ${isCredit ? "bg-green-50" : "bg-violet-50"}`}>
        {isCredit
          ? <ArrowUpCircle className="w-5 h-5 text-green-600" />
          : <ArrowDownCircle className="w-5 h-5 text-[#6E58FF]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {tx.description ?? (isCredit ? "Wallet top-up" : "Campaign spend")}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)}</p>
        {tx.reference && (
          <p className="text-xs text-gray-300 font-mono mt-0.5 truncate">{tx.reference}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-gray-700"}`}>
          {isCredit ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG")}
        </p>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${txStatusStyle(tx)}`}>
          {TX_STATUS_ICONS[tx.status]}
          {tx.status}
        </span>
      </div>
    </div>
  );
};

const AdBillingPage: React.FC = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const { data, isLoading, refetch } = useGetAdWalletQuery();
  const [fundWallet, { isLoading: isFunding }] = useFundAdWalletMutation();

  const wallet = data?.data?.wallet;
  const transactions: SelfServeAdWalletTransaction[] = data?.data?.transactions ?? [];

  const handleFund = async () => {
    const amount = Number(fundAmount);
    if (!amount || amount < 500) {
      toast.error("Minimum top-up amount is ₦500");
      return;
    }
    try {
      const res = await fundWallet({
        amountNGN: amount,
        callbackUrl: `${window.location.origin}/dashboard/ad-billing`,
      }).unwrap();
      window.location.href = res.data.authorizationUrl;
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initialize payment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6E58FF]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ad Wallet & Billing</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your ad wallet balance for App & Web Ads and Blog Space campaigns.
        </p>
      </div>

      {/* Wallet card */}
      <div className="bg-gradient-to-r from-[#6E58FF] to-[#8B5CF6] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="font-semibold text-sm">Ad Wallet Balance</span>
          </div>
          <button
            onClick={() => refetch()}
            className="text-white/70 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <p className="text-4xl font-bold mb-1">
          ₦{(wallet?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-white/70 text-sm mb-5">Available for campaigns</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-white/80">
              ₦{(wallet?.totalCredited ?? 0).toLocaleString("en-NG")} total credited
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-300" />
            <span className="text-white/80">
              ₦{(wallet?.totalSpent ?? 0).toLocaleString("en-NG")} total spent
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowFundModal(true)}
          className="flex items-center gap-2 bg-white text-[#6E58FF] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition shadow"
        >
          <Plus className="w-4 h-4" />
          Fund Wallet
        </button>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Transaction History</h2>
          <span className="text-xs text-gray-400">{transactions.length} record{transactions.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="px-5">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-400">No transactions yet.</p>
              <p className="text-xs text-gray-300 mt-1">Fund your wallet to get started.</p>
            </div>
          ) : (
            <div>
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual balance correction notice (for pre-fix campaigns) */}
      {(wallet?.balance ?? 0) > (wallet?.totalCredited ?? 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">Balance discrepancy detected</p>
          <p className="text-amber-700 text-xs">
            Your wallet balance (₦{(wallet?.balance ?? 0).toLocaleString()}) exceeds your total credited amount (₦{(wallet?.totalCredited ?? 0).toLocaleString()}).
            This was caused by campaigns cancelled before the budget-reservation system was in place. Please contact support to reconcile.
          </p>
        </div>
      )}

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFundModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Fund Ad Wallet</h3>
            <p className="text-gray-500 text-sm mb-5">Minimum top-up: ₦500. Funds are used for App & Web Ads and Blog Space campaigns.</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (NGN)</label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                min={500}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-gray-900 bg-gray-50 focus:bg-white transition"
              />
              {/* Quick amount buttons */}
              <div className="flex gap-2 mt-2">
                {[1000, 5000, 10000, 20000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFundAmount(String(amt))}
                    className="flex-1 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-violet-50 hover:text-[#6E58FF] transition"
                  >
                    ₦{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFundModal(false)}
                disabled={isFunding}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFund}
                disabled={isFunding}
                className="flex-1 px-4 py-2.5 bg-[#6E58FF] text-white rounded-xl hover:bg-[#5843e0] transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isFunding && <Loader2 className="w-4 h-4 animate-spin" />}
                {isFunding ? "Redirecting..." : "Pay with Paystack"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBillingPage;

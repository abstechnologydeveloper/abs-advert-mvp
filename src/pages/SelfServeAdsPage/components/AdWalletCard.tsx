import React, { useState } from "react";
import { Wallet, Plus, TrendingUp, TrendingDown, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAdWalletQuery,
  useFundAdWalletMutation,
} from "../../../redux/self-serve-ads/self-serve-ads-api";

const AdWalletCard: React.FC = () => {
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const { data, isLoading, refetch } = useGetAdWalletQuery();
  const [fundWallet, { isLoading: isFunding }] = useFundAdWalletMutation();

  const wallet = data?.data?.wallet;

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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <>
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

        <p className="text-3xl font-bold mb-1">
          ₦{(wallet?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-white/70 text-sm mb-5">Available for campaigns</p>

        <div className="flex items-center gap-4 text-sm mb-5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-white/80">
              ₦{(wallet?.totalCredited ?? 0).toLocaleString()} credited
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-300" />
            <span className="text-white/80">
              ₦{(wallet?.totalSpent ?? 0).toLocaleString()} spent
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowFundModal(true)}
          className="flex items-center gap-2 bg-white text-[#6E58FF] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition"
        >
          <Plus className="w-4 h-4" />
          Fund Wallet
        </button>
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFundModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Fund Ad Wallet</h3>
            <p className="text-gray-500 text-sm mb-5">Minimum top-up: ₦500</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (NGN)
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {[1000, 5000, 10000, 20000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setFundAmount(String(preset))}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                      fundAmount === String(preset)
                        ? "bg-[#6E58FF] text-white border-[#6E58FF]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#6E58FF] hover:text-[#6E58FF]"
                    }`}
                  >
                    ₦{preset.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                min={500}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6E58FF] focus:border-transparent outline-none text-gray-900"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFundModal(false)}
                disabled={isFunding}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFund}
                disabled={isFunding}
                className="flex-1 px-4 py-2.5 bg-[#6E58FF] text-white rounded-xl hover:bg-[#5843e0] transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isFunding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isFunding ? "Redirecting..." : "Pay with Paystack"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdWalletCard;

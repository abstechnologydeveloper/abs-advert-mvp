// ==================== components/WalletCard.tsx ====================
import React from "react";
import { Plus, Wallet, RefreshCw } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useGetWalletBalanceQuery } from "../../../redux/biling/billing-api";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface WalletCardProps {
  onFund: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    return `Failed to load balance (${fetchError.status})`;
  }
  return "Failed to load balance";
}

const WalletCard: React.FC<WalletCardProps> = ({ onFund }) => {
  const {
    data: walletData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetWalletBalanceQuery(undefined);

  const balance = walletData?.data?.balance ?? walletData?.balance ?? 0;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-blue-100 text-sm">Wallet Balance</p>
            <button
              onClick={() => refetch()}
              className="text-blue-100 hover:text-white transition-colors"
              title="Refresh balance"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-2xl font-bold">Loading...</span>
            </div>
          ) : isError ? (
            <div>
              <h2 className="text-4xl font-bold text-red-200">Error</h2>
              <p className="text-red-100 text-sm mt-2">
                {getErrorMessage(error)}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
              <p className="text-blue-100 text-sm mt-2">
                Available for all campaigns
              </p>
            </>
          )}
        </div>
        <Wallet className="w-16 h-16 text-white opacity-20" />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onFund}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span>Fund Wallet</span>
        </button>
      </div>
    </div>
  );
};

export default WalletCard;

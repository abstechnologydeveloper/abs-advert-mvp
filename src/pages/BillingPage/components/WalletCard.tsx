// ==================== components/WalletCard.tsx ====================
import React from "react";
import { Plus, Download, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface WalletCardProps {
  balance: number;
  onFund: () => void;
  onWithdraw: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  onFund,
  onWithdraw,
}) => (
  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-blue-100 text-sm mb-2">Wallet Balance</p>
        <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
        <p className="text-blue-100 text-sm mt-2">
          Available for all campaigns
        </p>
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

export default WalletCard;





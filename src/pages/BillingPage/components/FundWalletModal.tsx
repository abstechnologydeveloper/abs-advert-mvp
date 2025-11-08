// ==================== components/FundWalletModal.tsx ====================
import React, { useState } from "react";
import { X } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFund: (amount: number) => void;
  selectedPlan?: {
    shortfall: number;
  };
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({
  isOpen,
  onClose,
  onFund,
  selectedPlan,
}) => {
  const [amount, setAmount] = useState<string>("");

  if (!isOpen) return null;

  const handleFund = () => {
    const parsedAmount = parseInt(amount, 10) || 0;
    onFund(parsedAmount);
    onClose();
    setAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Fund Your Wallet</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (NGN)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              min={10000}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">Minimum: ₦10,000</p>
          </div>

          {/* Selected Plan Info */}
          {selectedPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Funding for subscription
              </p>
              <p className="text-sm text-blue-700">
                Required amount: {formatCurrency(selectedPlan.shortfall)}
              </p>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleFund}
            disabled={!amount || parseInt(amount, 10) < 10000}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center">
            Secured by Paystack • Your transaction is encrypted and safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal;

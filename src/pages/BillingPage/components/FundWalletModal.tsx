// ==================== components/FundWalletModal.tsx ====================
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useInitializePaymentMutation } from "../../../redux/biling/billing-api";
import { toast } from "react-hot-toast";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: {
    shortfall: number;
  };
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [initializePayment, { isLoading }] = useInitializePaymentMutation();

  if (!isOpen) return null;

  const handleFund = async () => {
    const parsedAmount = parseInt(amount, 10);

    if (!parsedAmount || parsedAmount < 20000) {
      toast.error("Amount must be at least ₦20,000");
      return;
    }

    try {
      // Get the current URL origin for the callback
      const callbackUrl = `${window.location.origin}/dashboard/billing?payment=callback`;

      // Call the API to initialize payment
      const response = await initializePayment({
        amount: parsedAmount,
        callback_url: callbackUrl, // Add callback URL to the request
      }).unwrap();

      if (response.success && response.data?.authorization_url) {
        // Store transaction details if needed
        const transactionData = {
          reference: response.data.reference,
          transactionId: response.data.transactionId,
          amount: parsedAmount,
          timestamp: new Date().toISOString(),
        };

        // Store in localStorage for verification after redirect
        localStorage.setItem(
          "pending_transaction",
          JSON.stringify(transactionData)
        );

        // Redirect to Paystack checkout
        window.location.href = response.data.authorization_url;
      } else {
        toast.error("Failed to initialize payment");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast.error(
        error?.data?.message ||
          "Failed to initialize payment. Please try again."
      );
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Fund Your Wallet</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              placeholder="20000"
              min={20000}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-2">Minimum: ₦20,000</p>
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
            disabled={!amount || parseInt(amount, 10) < 20000 || isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Proceed to Payment</span>
            )}
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

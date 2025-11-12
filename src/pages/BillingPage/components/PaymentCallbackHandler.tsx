// ==================== components/PaymentCallbackHandler.tsx ====================
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface PaymentCallbackHandlerProps {
  onVerificationComplete?: () => void;
}

const PaymentCallbackHandler: React.FC<PaymentCallbackHandlerProps> = ({
  onVerificationComplete,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      // Get reference from URL
      const reference = searchParams.get("reference");
      const trxref = searchParams.get("trxref");

      const paymentReference = reference || trxref;

      if (!paymentReference) {
        setStatus("failed");
        setMessage("Payment reference not found");
        toast.error("Invalid payment reference");

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/dashboard/billing");
        }, 3000);
        return;
      }

      try {
        // Get pending transaction from localStorage
        const pendingTransaction = localStorage.getItem("pending_transaction");

        if (pendingTransaction) {
          const transactionData = JSON.parse(pendingTransaction);

          // Here you would typically call your backend to verify the payment
          // Example:
          // const verifyResponse = await verifyPaymentAPI({ reference: paymentReference });

          // For now, we'll simulate a successful verification
          // Replace this with your actual API call

          setStatus("success");
          setMessage(
            `Payment of ₦${transactionData.amount.toLocaleString()} successful!`
          );
          toast.success("Payment successful! Your wallet has been funded.");

          // Clean up localStorage
          localStorage.removeItem("pending_transaction");

          // Call callback if provided
          if (onVerificationComplete) {
            onVerificationComplete();
          }

          // Redirect to billing page after 3 seconds
          setTimeout(() => {
            navigate("/dashboard/billing");
          }, 3000);
        } else {
          setStatus("failed");
          setMessage("Transaction details not found");
          toast.error("Could not verify payment");

          setTimeout(() => {
            navigate("/dashboard/billing");
          }, 3000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage("Failed to verify payment. Please contact support.");
        toast.error("Payment verification failed");

        setTimeout(() => {
          navigate("/dashboard/billing");
        }, 3000);
      }
    };

    // Check if this is a payment callback
    if (searchParams.get("payment") === "callback") {
      verifyPayment();
    }
  }, [searchParams, navigate, onVerificationComplete]);

  // Don't render if not a payment callback
  if (searchParams.get("payment") !== "callback") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h3>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to billing page...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Payment Verification Failed
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Redirecting to billing page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackHandler;

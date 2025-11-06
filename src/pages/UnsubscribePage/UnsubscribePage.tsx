import React, { useState } from "react";
import { CheckCircle, Mail, AlertCircle } from "lucide-react";

export default function UnsubscribePage() {
  const [status, setStatus] = useState<"initial" | "loading" | "success" | "error">("initial");
  const [email, setEmail] = useState("");

  const handleUnsubscribe = () => {
    if (!email) return;
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
            alt="AbS Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Email Preferences</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {status === "initial" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Unsubscribe from Emails
              </h2>
              <p className="text-gray-600 text-center mb-6">
                We're sorry to see you go. Enter your email to unsubscribe from our mailing list.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <button
                  onClick={handleUnsubscribe}
                  disabled={!email}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unsubscribe
                </button>
              </div>
            </>
          )}

          {status === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your request...</p>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Successfully Unsubscribed
              </h2>
              <p className="text-gray-600 text-center mb-6">
                You've been removed from our mailing list. You won't receive any more emails from
                us.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Changed your mind?</strong> You can resubscribe anytime by visiting our
                  website and signing up again.
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Something Went Wrong
              </h2>
              <p className="text-gray-600 text-center mb-6">
                We couldn't process your request. Please try again or contact support.
              </p>
              <button
                onClick={() => setStatus("initial")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <a
            href="https://www.abstechconnect.com/"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Return to AbS Website →
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">© 2025 AbS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

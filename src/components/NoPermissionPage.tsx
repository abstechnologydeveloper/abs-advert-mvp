import React from "react";
import { Lock, Shield, Mail } from "lucide-react";

const NoPermissionPage: React.FC<{ feature?: string }> = ({ feature }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-6 py-12">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
        <div className="relative bg-linear-to-br from-blue-500 to-blue-600 p-6 rounded-full shadow-lg">
          <Shield className="w-16 h-16 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Premium Feature</h1>

      <p className="text-lg text-gray-600 max-w-md mb-6">
        {feature ? (
          <>
            <span className="font-semibold text-gray-800">{feature}</span> is currently unavailable
            on your plan.
          </>
        ) : (
          "This feature is currently unavailable on your plan."
        )}
      </p>

      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 max-w-lg mb-8">
        <div className="flex items-start space-x-3 text-left">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Access Restricted</h3>
            <p className="text-sm text-gray-700">
              Your current subscription doesn't include access to this feature. Upgrade your plan to
              unlock advanced advertising capabilities.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105">
          Upgrade Plan
        </button> */}

        <button className="flex items-center justify-center space-x-2 px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200">
          <Mail className="w-4 h-4" />
          <span>Contact Support</span>
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Questions? Our team is here to help you choose the right plan.
      </p>
    </div>
  );
};

export default NoPermissionPage;

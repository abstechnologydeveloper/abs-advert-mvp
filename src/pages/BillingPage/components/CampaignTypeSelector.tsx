// ==================== components/CampaignTypeSelector.tsx ====================
import React from "react";
import { CAMPAIGN_TYPES } from "../config/campaignTypes";
import { SubscriptionsState, CampaignTypeId } from "../types/billing.types";


interface CampaignTypeSelectorProps {
  selectedType: CampaignTypeId;
  onSelect: (type: CampaignTypeId) => void;
  subscriptions: SubscriptionsState;
}

const CampaignTypeSelector: React.FC<CampaignTypeSelectorProps> = ({
  selectedType,
  onSelect,
  subscriptions,
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
    <h3 className="text-lg font-bold text-gray-900 mb-4">
      Select Campaign Type
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Object.values(CAMPAIGN_TYPES).map((type) => {
        const Icon = type.icon;
        const subscription = subscriptions[type.id as CampaignTypeId];
        const isActive = subscription?.status === "active";
        const isSelected = selectedType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id as CampaignTypeId)}
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
                isSelected
                  ? "text-blue-600"
                  : isActive
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            />
            <p className="text-sm font-medium text-gray-900 text-center">
              {type.label}
            </p>
            {isActive && (
              <span className="text-xs text-green-600 font-medium block mt-1">
                Active
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default CampaignTypeSelector;
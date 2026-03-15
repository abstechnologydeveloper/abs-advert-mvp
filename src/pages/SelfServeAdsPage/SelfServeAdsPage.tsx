import React, { useState } from "react";
import CreateAdForm from "./components/CreateAdForm";
import AdCampaignList from "./components/AdCampaignList";
import { type SelfServeAdChannel } from "../../redux/self-serve-ads/self-serve-ads-api";
import { Globe, PlusCircle, Zap, ListChecks, History } from "lucide-react";

interface SelfServeAdsPageProps {
  channel: SelfServeAdChannel;
}

type Tab = "create" | "active" | "pending" | "history";

const TABS: { key: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "create", label: "Create Ad", Icon: PlusCircle },
  { key: "active", label: "Active", Icon: Zap },
  { key: "pending", label: "In Review", Icon: ListChecks },
  { key: "history", label: "History", Icon: History },
];

const SelfServeAdsPage: React.FC<SelfServeAdsPageProps> = ({ channel }) => {
  const [activeTab, setActiveTab] = useState<Tab>("create");

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-50 rounded-xl shrink-0">
            <Globe className="w-6 h-6 text-[#6E58FF]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Blog Ads</h1>
            <p className="text-gray-500 text-sm mt-1">
              Buy ad space on AbS public pages — blog, library listings, scholarships and more.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 bg-gray-100 rounded-xl p-1">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === key
                  ? "bg-white text-[#6E58FF] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "create" && (
        <CreateAdForm channel={channel} onSuccess={() => setActiveTab("pending")} />
      )}
      {activeTab === "active" && <AdCampaignList channel={channel} view="active" />}
      {activeTab === "pending" && <AdCampaignList channel={channel} view="pending" />}
      {activeTab === "history" && <AdCampaignList channel={channel} view="history" />}
    </div>
  );
};

export default SelfServeAdsPage;

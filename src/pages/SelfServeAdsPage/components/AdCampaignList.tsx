import React, { useState } from "react";
import { Pause, Play, Loader2, Eye, TrendingUp, DollarSign, ImageIcon, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetSelfServeCampaignsQuery,
  usePauseSelfServeCampaignMutation,
  useResumeSelfServeCampaignMutation,
  useCancelSelfServeCampaignMutation,
  type SelfServeAdCampaign,
  type SelfServeAdChannel,
  type SelfServeAdStatus,
} from "../../../redux/self-serve-ads/self-serve-ads-api";

interface AdCampaignListProps {
  channel: SelfServeAdChannel;
  view: "active" | "pending" | "history";
}

const STATUS_COLORS: Record<SelfServeAdStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  ACTIVE: "bg-green-50 text-green-700 border border-green-200",
  PAUSED: "bg-gray-100 text-gray-600 border border-gray-200",
  BUDGET_EXHAUSTED: "bg-orange-50 text-orange-700 border border-orange-200",
  COMPLETED: "bg-blue-50 text-blue-700 border border-blue-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_LABELS: Record<SelfServeAdStatus, string> = {
  PENDING_REVIEW: "In Review",
  ACTIVE: "Active",
  PAUSED: "Paused",
  BUDGET_EXHAUSTED: "Budget Exhausted",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const VIEW_STATUSES: Record<"active" | "pending" | "history", SelfServeAdStatus[]> = {
  active: ["ACTIVE", "PAUSED"],
  pending: ["PENDING_REVIEW"],
  history: ["BUDGET_EXHAUSTED", "COMPLETED", "REJECTED"],
};

const VIEW_TITLES = {
  active: "Active & Paused",
  pending: "Awaiting Review",
  history: "Campaign History",
};

const VIEW_EMPTY = {
  active: "No active campaigns yet. Create one above to get started.",
  pending: "No campaigns waiting for review right now.",
  history: "No completed or rejected campaigns yet.",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

const CampaignCard: React.FC<{
  campaign: SelfServeAdCampaign;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string, title: string) => void;
  isPausing: boolean;
  isResuming: boolean;
  isCancelling: boolean;
}> = ({ campaign, onPause, onResume, onCancel, isPausing, isResuming, isCancelling }) => {
  const budgetPct = Math.min(100, (campaign.spentAmount / campaign.totalBudget) * 100);
  const coverImage = campaign.imageUrls?.[0] ?? campaign.imageUrl;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition bg-white">
      <div className="flex">
        {/* Image strip */}
        <div className="w-20 sm:w-28 shrink-0 bg-gray-100 flex items-center justify-center">
          {coverImage ? (
            <img src={coverImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Status + title */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${STATUS_COLORS[campaign.status]}`}>
                  {STATUS_LABELS[campaign.status]}
                </span>
                {campaign.imageUrls?.length > 1 && (
                  <span className="text-[11px] text-gray-400">{campaign.imageUrls.length} images</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {campaign.title}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{campaign.headline}</p>
            </div>

            {/* Action button */}
            <div className="shrink-0 flex flex-col gap-1.5">
              {campaign.status === "ACTIVE" && (
                <button
                  onClick={() => onPause(campaign.id)}
                  disabled={isPausing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {isPausing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />}
                  Pause
                </button>
              )}
              {campaign.status === "PAUSED" && (
                <button
                  onClick={() => onResume(campaign.id)}
                  disabled={isResuming}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition disabled:opacity-50"
                >
                  {isResuming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Resume
                </button>
              )}
              {campaign.status === "PENDING_REVIEW" && (
                <button
                  onClick={() => onCancel(campaign.id, campaign.title)}
                  disabled={isCancelling}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition disabled:opacity-50"
                >
                  {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {campaign.impressions.toLocaleString()} imp.
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {campaign.clicks.toLocaleString()} clicks
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ₦{campaign.spentAmount.toLocaleString()} / ₦{campaign.totalBudget.toLocaleString()}
            </span>
            {(campaign.startDate || campaign.endDate) && (
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />
                {formatDate(campaign.startDate) ?? "—"} → {formatDate(campaign.endDate) ?? "ongoing"}
              </span>
            )}
          </div>

          {/* Budget bar */}
          <div className="mt-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${budgetPct >= 90 ? "bg-orange-500" : "bg-[#6E58FF]"}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{budgetPct.toFixed(0)}% budget used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdCampaignList: React.FC<AdCampaignListProps> = ({ channel, view }) => {
  const { data, isLoading, isFetching } = useGetSelfServeCampaignsQuery();
  const [pauseCampaign, { isLoading: isPausing }] = usePauseSelfServeCampaignMutation();
  const [resumeCampaign, { isLoading: isResuming }] = useResumeSelfServeCampaignMutation();
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelSelfServeCampaignMutation();

  const [confirmCancel, setConfirmCancel] = useState<{ id: string; title: string } | null>(null);

  const allowedStatuses = VIEW_STATUSES[view];
  const campaigns: SelfServeAdCampaign[] = (data?.data ?? []).filter(
    (c) => c.channel === channel && allowedStatuses.includes(c.status),
  );

  const handlePause = async (id: string) => {
    try {
      await pauseCampaign(id).unwrap();
      toast.success("Campaign paused");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to pause campaign");
    }
  };

  const handleResume = async (id: string) => {
    try {
      await resumeCampaign(id).unwrap();
      toast.success("Campaign resumed");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resume campaign");
    }
  };

  const handleCancelConfirm = async () => {
    if (!confirmCancel) return;
    try {
      await cancelCampaign(confirmCancel.id).unwrap();
      toast.success("Campaign cancelled — budget refunded to your ad wallet");
      setConfirmCancel(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel campaign");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[#6E58FF]" />
      </div>
    );
  }

  return (
    <>
      {/* Cancel Confirmation Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmCancel(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Campaign?</h3>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-medium text-gray-700">"{confirmCancel.title}"</span>
            </p>
            <p className="text-gray-500 text-sm mb-5">
              The full budget will be refunded to your ad wallet immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmCancel(null)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
              >
                Keep Campaign
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{VIEW_TITLES[view]}</h3>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{VIEW_EMPTY[view]}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={(id, title) => setConfirmCancel({ id, title })}
                isPausing={isPausing}
                isResuming={isResuming}
                isCancelling={isCancelling}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdCampaignList;

import React, { useRef, useState } from "react";
import {
  Loader2, Info, Upload, X, ImageIcon, ExternalLink,
  Users, BookOpen, GraduationCap, Eye, TrendingUp,
  DollarSign, Clock, Pause, Play, PlusCircle, History, ListChecks, Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateSelfServeCampaignMutation,
  useUploadAdImagesMutation,
  useGetSelfServeCampaignsQuery,
  usePauseSelfServeCampaignMutation,
  useResumeSelfServeCampaignMutation,
  useCancelSelfServeCampaignMutation,
  useGetAdWalletQuery,
  type SelfServeAdChannel,
  type SelfServeAdCampaign,
  type SelfServeAdStatus,
} from "../../redux/self-serve-ads/self-serve-ads-api";

const DURATION_OPTIONS = [
  { hours: 24,  label: "24 hours" },
  { hours: 48,  label: "2 days" },
  { hours: 72,  label: "3 days" },
  { hours: 168, label: "7 days" },
  { hours: 336, label: "14 days" },
  { hours: 720, label: "30 days" },
];

/** Validate that a URL starts with http:// or https:// */
function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const APP_CHANNELS: { value: SelfServeAdChannel; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: "QUILLS", label: "Quill Community", Icon: Users },
  { value: "LIBRARY", label: "Library", Icon: BookOpen },
  { value: "OPPORTUNITIES", label: "Opportunities", Icon: GraduationCap },
];

const APP_CHANNEL_VALUES = APP_CHANNELS.map((c) => c.value);

// ─── Status helpers ───────────────────────────────────────────────
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

function formatDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Campaign card ────────────────────────────────────────────────
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
  const cover = (campaign as any).targetChannels?.length > 0
    ? (campaign as any).targetChannels.map((c: SelfServeAdChannel) => APP_CHANNELS.find((x) => x.value === c)?.label).filter(Boolean).join(", ")
    : campaign.channel;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition bg-white">
      <div className="flex">
        <div className="w-20 sm:w-24 shrink-0 bg-gray-100 flex items-center justify-center">
          {campaign.imageUrls?.[0] ?? campaign.imageUrl ? (
            <img src={campaign.imageUrls?.[0] ?? campaign.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${STATUS_COLORS[campaign.status]}`}>
                  {STATUS_LABELS[campaign.status]}
                </span>
                <span className="text-[11px] text-gray-400">{cover}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">{campaign.title}</h3>
              <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{campaign.headline}</p>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              {campaign.status === "ACTIVE" && (
                <button onClick={() => onPause(campaign.id)} disabled={isPausing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition disabled:opacity-50">
                  {isPausing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />} Pause
                </button>
              )}
              {campaign.status === "PAUSED" && (
                <button onClick={() => onResume(campaign.id)} disabled={isResuming}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition disabled:opacity-50">
                  {isResuming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Resume
                </button>
              )}
              {campaign.status === "PENDING_REVIEW" && (
                <button onClick={() => onCancel(campaign.id, campaign.title)} disabled={isCancelling}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition disabled:opacity-50">
                  {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Cancel
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{campaign.impressions.toLocaleString()} imp.</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{campaign.clicks.toLocaleString()} clicks</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₦{campaign.spentAmount.toLocaleString()} / ₦{campaign.totalBudget.toLocaleString()}</span>
            {(campaign.startDate || campaign.endDate) && (
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3 h-3" />{formatDate(campaign.startDate) ?? "—"} → {formatDate(campaign.endDate) ?? "ongoing"}
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${budgetPct >= 90 ? "bg-orange-500" : "bg-[#6E58FF]"}`} style={{ width: `${budgetPct}%` }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{budgetPct.toFixed(0)}% budget used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Campaign list ────────────────────────────────────────────────
const AppCampaignList: React.FC<{ view: "active" | "pending" | "history" }> = ({ view }) => {
  const { data, isLoading, isFetching } = useGetSelfServeCampaignsQuery();
  const [pauseCampaign, { isLoading: isPausing }] = usePauseSelfServeCampaignMutation();
  const [resumeCampaign, { isLoading: isResuming }] = useResumeSelfServeCampaignMutation();
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelSelfServeCampaignMutation();
  const [confirmCancel, setConfirmCancel] = useState<{ id: string; title: string } | null>(null);

  const allowed = VIEW_STATUSES[view];
  const campaigns = (data?.data ?? []).filter(
    (c) => APP_CHANNEL_VALUES.includes(c.channel) && allowed.includes(c.status),
  );

  const handlePause = async (id: string) => {
    try { await pauseCampaign(id).unwrap(); toast.success("Campaign paused"); }
    catch (err: any) { toast.error(err?.data?.message || "Failed to pause"); }
  };
  const handleResume = async (id: string) => {
    try { await resumeCampaign(id).unwrap(); toast.success("Campaign resumed"); }
    catch (err: any) { toast.error(err?.data?.message || "Failed to resume"); }
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#6E58FF]" /></div>;

  const emptyText = {
    active: "No active campaigns yet.",
    pending: "Nothing awaiting review.",
    history: "No completed campaigns yet.",
  };

  return (
    <>
      {/* Cancel confirmation modal */}
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
              <button onClick={() => setConfirmCancel(null)} disabled={isCancelling}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium text-sm">
                Keep Campaign
              </button>
              <button onClick={handleCancelConfirm} disabled={isCancelling}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {isFetching && (
          <div className="flex justify-end mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
        {campaigns.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{emptyText[view]}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
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

// ─── Image upload helper ──────────────────────────────────────────
interface ImageFile { file: File; preview: string; url?: string; uploading?: boolean; error?: boolean; }

// ─── Create form ──────────────────────────────────────────────────
const AppWebCreateForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChannels, setSelectedChannels] = useState<SelfServeAdChannel[]>(["QUILLS"]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [durationHours, setDurationHours] = useState(24);
  const [customDays, setCustomDays] = useState("");
  const [form, setForm] = useState({
    title: "", headline: "", bodyText: "", ctaUrl: "",
    totalBudget: "", dailyBudget: "",
  });

  const [createCampaign, { isLoading }] = useCreateSelfServeCampaignMutation();
  const [uploadImages] = useUploadAdImagesMutation();
  const { data: walletData } = useGetAdWalletQuery();

  const toggleChannel = (ch: SelfServeAdChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? (prev.length > 1 ? prev.filter((c) => c !== ch) : prev) : [...prev, ch]
    );
  };

  const selectAll = () => setSelectedChannels(APP_CHANNEL_VALUES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const uploadSingleImage = async (file: File, idx: number) => {
    setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, uploading: true } : img)));
    try {
      const fd = new FormData();
      fd.append("images", file);
      const res = await uploadImages(fd).unwrap();
      setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, uploading: false, url: res.data.urls[0] } : img)));
    } catch {
      setImages((prev) => prev.map((img, i) => (i === idx ? { ...img, uploading: false, error: true } : img)));
      toast.error("Failed to upload image");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 5) { toast.error("Maximum 5 images"); return; }
    const newImages: ImageFile[] = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    const startIdx = images.length;
    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img, i) => uploadSingleImage(img.file, startIdx + i));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => { const c = [...prev]; URL.revokeObjectURL(c[idx].preview); c.splice(idx, 1); return c; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChannels.length === 0) { toast.error("Select at least one target"); return; }
    if (Number(form.totalBudget) < 1000) { toast.error("Minimum budget is ₦1,000"); return; }
    if (!isValidUrl(form.ctaUrl)) { toast.error("Landing page URL must start with https:// or http://"); return; }
    if (images.some((i) => i.uploading)) { toast.error("Wait for images to finish uploading"); return; }
    if (images.some((i) => i.error)) { toast.error("Remove failed images and try again"); return; }

    const walletBalance = walletData?.data?.wallet?.balance ?? 0;
    if (Number(form.totalBudget) > walletBalance) {
      toast.error(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}, need ₦${Number(form.totalBudget).toLocaleString()}`);
      return;
    }

    try {
      await createCampaign({
        title: form.title,
        targetChannels: selectedChannels,
        channel: selectedChannels[0],
        headline: form.headline,
        bodyText: form.bodyText,
        imageUrls: images.map((i) => i.url!).filter(Boolean),
        ctaUrl: form.ctaUrl,
        totalBudget: Number(form.totalBudget),
        dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : undefined,
        durationHours,
      }).unwrap();

      toast.success("Campaign submitted for review!");
      setForm({ title: "", headline: "", bodyText: "", ctaUrl: "", totalBudget: "", dailyBudget: "" });
      setImages([]);
      setSelectedChannels(["QUILLS"]);
      setDurationHours(24);
      setCustomDays("");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create campaign");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Create In-App Ad</h2>
        <p className="text-gray-500 text-sm mt-0.5">Choose your target sections — your ad runs in all selected areas.</p>
      </div>

      {/* Pricing + wallet balance */}
      <div className="mx-6 mt-5 space-y-2">
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-violet-700">
          <Info className="w-4 h-4 shrink-0" />
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span>₦0.50 / impression</span>
            <span className="text-violet-300">·</span>
            <span>₦5.00 / click</span>
            <span className="text-violet-300">·</span>
            <span>₦1,000 min. budget</span>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
          <span className="text-gray-500">Ad Wallet Balance</span>
          <span className="font-semibold text-gray-900">₦{(walletData?.data?.wallet?.balance ?? 0).toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        {/* Channel selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Ad Targets <span className="text-red-500">*</span>
            </label>
            <button type="button" onClick={selectAll} className="text-xs text-[#6E58FF] hover:underline font-medium">
              Select All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {APP_CHANNELS.map(({ value, label, Icon }) => {
              const active = selectedChannels.includes(value);
              return (
                <button key={value} type="button" onClick={() => toggleChannel(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    active ? "bg-[#6E58FF] text-white border-[#6E58FF]" : "bg-white text-gray-600 border-gray-200 hover:border-[#6E58FF] hover:text-[#6E58FF]"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Selected: {selectedChannels.map((c) => APP_CHANNELS.find((x) => x.value === c)?.label).join(", ")}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Title <span className="text-red-500">*</span></label>
          <input name="title" value={form.title} onChange={handleChange} required
            placeholder="Internal name for this campaign"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition" />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ad Headline <span className="text-red-500">*</span></label>
          <input name="headline" value={form.headline} onChange={handleChange} required maxLength={80}
            placeholder="Short, attention-grabbing headline"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition" />
          <p className="text-xs text-gray-400 mt-1">{form.headline.length}/80</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ad Body Text <span className="text-red-500">*</span></label>
          <textarea name="bodyText" value={form.bodyText} onChange={handleChange} required rows={3} maxLength={300}
            placeholder="Brief description of your offer or message"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition resize-none" />
          <p className="text-xs text-gray-400 mt-1">{form.bodyText.length}/300</p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ad Images <span className="text-gray-400 font-normal">(up to 5)</span></label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {img.uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
                  {img.error && <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center"><span className="text-white text-xs">Failed</span></div>}
                  {!img.uploading && (
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#6E58FF] hover:bg-violet-50 transition text-gray-400 hover:text-[#6E58FF]">
                  <ImageIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          {images.length === 0 && (
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-[#6E58FF] hover:bg-violet-50 transition group">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:text-[#6E58FF] transition" />
              <p className="text-sm text-gray-500 group-hover:text-[#6E58FF] transition">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 10MB each</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
        </div>

        {/* CTA URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Landing Page URL <span className="text-red-500">*</span></label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input name="ctaUrl" value={form.ctaUrl} onChange={handleChange} required type="text"
              placeholder="https://yourwebsite.com/offer"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition" />
          </div>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Budget (₦) <span className="text-red-500">*</span></label>
            <input name="totalBudget" value={form.totalBudget} onChange={handleChange} required type="number" min={1000}
              placeholder="1000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Daily Cap (₦) <span className="text-gray-400 font-normal">(optional)</span></label>
            <input name="dailyBudget" value={form.dailyBudget} onChange={handleChange} type="number" min={100}
              placeholder="No daily limit"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition" />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" /> Ad Duration
          </label>
          <p className="text-xs text-gray-400 mb-2">
            How long should the ad run after approval? It also stops when the budget is exhausted.
          </p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(({ hours, label }) => (
              <button
                key={hours}
                type="button"
                onClick={() => { setDurationHours(hours); setCustomDays(""); }}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                  durationHours === hours && !customDays
                    ? "bg-[#6E58FF] text-white border-[#6E58FF]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#6E58FF] hover:text-[#6E58FF]"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCustomDays((d) => d || "1")}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                customDays
                  ? "bg-[#6E58FF] text-white border-[#6E58FF]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#6E58FF] hover:text-[#6E58FF]"
              }`}
            >
              Custom
            </button>
          </div>
          {customDays !== "" && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                min={1}
                max={365}
                value={customDays}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomDays(val);
                  if (Number(val) > 0) setDurationHours(Number(val) * 24);
                }}
                placeholder="e.g. 10"
                className="w-28 px-3 py-2 border border-[#6E58FF] rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 outline-none text-sm bg-white font-semibold text-gray-900"
              />
              <span className="text-sm text-gray-500">days</span>
              {Number(customDays) > 0 && (
                <span className="text-xs text-gray-400">= {Number(customDays) * 24} hours</span>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading || images.some((i) => i.uploading)}
          className="w-full py-3 bg-[#6E58FF] text-white rounded-xl font-semibold hover:bg-[#5843e0] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
};

// ─── Tab config ───────────────────────────────────────────────────
type Tab = "create" | "active" | "pending" | "history";

const TABS: { key: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "create", label: "Create Ad", Icon: PlusCircle },
  { key: "active", label: "Active", Icon: Zap },
  { key: "pending", label: "In Review", Icon: ListChecks },
  { key: "history", label: "History", Icon: History },
];

// ─── Page ─────────────────────────────────────────────────────────
const AppWebAdsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("create");

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-50 rounded-xl shrink-0">
            <Users className="w-6 h-6 text-[#6E58FF]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">In-App Ads</h1>
            <p className="text-gray-500 text-sm mt-1">
              Target logged-in students across Quill Community, Library, and Opportunities — on mobile and desktop.
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
        <AppWebCreateForm onSuccess={() => setActiveTab("pending")} />
      )}
      {activeTab === "active" && <AppCampaignList view="active" />}
      {activeTab === "pending" && <AppCampaignList view="pending" />}
      {activeTab === "history" && <AppCampaignList view="history" />}
    </div>
  );
};

export default AppWebAdsPage;

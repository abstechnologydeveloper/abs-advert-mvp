import React, { useRef, useState } from "react";
import { Loader2, Info, Upload, X, ImageIcon, ExternalLink, Clock } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateSelfServeCampaignMutation,
  useUploadAdImagesMutation,
  useGetAdWalletQuery,
  type SelfServeAdChannel,
} from "../../../redux/self-serve-ads/self-serve-ads-api";

/** Validate that a URL starts with http:// or https:// */
function isValidUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

interface CreateAdFormProps {
  channel: SelfServeAdChannel;
  onSuccess?: () => void;
}

const CHANNEL_LABELS: Record<SelfServeAdChannel, string> = {
  QUILLS: "Quill Community",
  LIBRARY: "Library",
  OPPORTUNITIES: "Opportunities",
  PUBLIC: "Blog Space",
};

const BLOG_TARGET_PAGES = [
  { value: "scholarships-list", label: "Scholarships \u2014 Listing Page" },
  { value: "scholarship-details", label: "Scholarships \u2014 Details Pages" },
  { value: "blog-list", label: "Blog / News \u2014 Listing Page" },
  { value: "blog-details", label: "Blog / News \u2014 Post Details" },
  { value: "blog-categories", label: "Blog \u2014 Category Pages" },
  { value: "library-catalogue", label: "Study Material Catalogue" },
  { value: "library-details", label: "Library \u2014 Resource Details Pages" },
  { value: "waec-jamb", label: "WAEC & JAMB Pages" },
] as const;

const PRICING = {
  impression: "₦0.50 / impression",
  click: "₦5.00 / click",
  minBudget: "₦1,000 min. budget",
};

interface ImageFile {
  file: File;
  preview: string;
  url?: string;
  uploading?: boolean;
  error?: boolean;
}

const DURATION_OPTIONS = [
  { hours: 24,  label: "24 hours" },
  { hours: 48,  label: "2 days" },
  { hours: 72,  label: "3 days" },
  { hours: 168, label: "7 days" },
  { hours: 336, label: "14 days" },
  { hours: 720, label: "30 days" },
];

const CreateAdForm: React.FC<CreateAdFormProps> = ({ channel, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetPages, setTargetPages] = useState<string[]>([]);
  const [durationHours, setDurationHours] = useState(24);
  const [customDays, setCustomDays] = useState("");
  const [form, setForm] = useState({
    title: "",
    headline: "",
    bodyText: "",
    ctaUrl: "",
    totalBudget: "",
    dailyBudget: "",
  });

  const toggleTargetPage = (val: string) => {
    setTargetPages((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  };

  const [createCampaign, { isLoading }] = useCreateSelfServeCampaignMutation();
  const [uploadImages] = useUploadAdImagesMutation();
  const { data: walletData } = useGetAdWalletQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const newImages: ImageFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    // Upload each new image immediately
    newImages.forEach((img, relIdx) => {
      const absIdx = images.length + relIdx;
      uploadSingleImage(img.file, absIdx + images.length);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadSingleImage = async (file: File, idx: number) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, uploading: true } : img))
    );
    try {
      const fd = new FormData();
      fd.append("images", file);
      const res = await uploadImages(fd).unwrap();
      const url = res.data.urls[0];
      setImages((prev) =>
        prev.map((img, i) => (i === idx ? { ...img, uploading: false, url } : img))
      );
    } catch {
      setImages((prev) =>
        prev.map((img, i) => (i === idx ? { ...img, uploading: false, error: true } : img))
      );
      toast.error("Failed to upload one image");
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.totalBudget) < 1000) {
      toast.error("Minimum campaign budget is ₦1,000");
      return;
    }
    if (!isValidUrl(form.ctaUrl)) {
      toast.error("Landing page URL must start with https:// or http://");
      return;
    }
    if (channel === "PUBLIC" && targetPages.length === 0) {
      toast.error("Select at least one page to target for Blog Space ads");
      return;
    }
    if (images.some((img) => img.uploading)) {
      toast.error("Please wait for images to finish uploading");
      return;
    }
    if (images.some((img) => img.error)) {
      toast.error("Some images failed to upload. Remove them and try again.");
      return;
    }

    const walletBalance = walletData?.data?.wallet?.balance ?? 0;
    if (Number(form.totalBudget) > walletBalance) {
      toast.error(`Insufficient wallet balance. You have ₦${walletBalance.toLocaleString()}, need ₦${Number(form.totalBudget).toLocaleString()}`);
      return;
    }

    const imageUrls = images.map((img) => img.url!).filter(Boolean);

    try {
      await createCampaign({
        title: form.title,
        channel,
        headline: form.headline,
        bodyText: form.bodyText,
        imageUrls,
        ctaUrl: form.ctaUrl,
        totalBudget: Number(form.totalBudget),
        dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : undefined,
        durationHours,
        ...(channel === "PUBLIC" && targetPages.length > 0 ? { targetPages } : {}),
      }).unwrap();

      toast.success("Campaign submitted for review!");
      setForm({ title: "", headline: "", bodyText: "", ctaUrl: "", totalBudget: "", dailyBudget: "" });
      setImages([]);
      setTargetPages([]);
      setDurationHours(24);
      setCustomDays("");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create campaign");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">
          Create {CHANNEL_LABELS[channel]} Ad
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Your ad will be reviewed by the AbS team before going live.
        </p>
      </div>

      {/* Pricing + wallet balance */}
      <div className="mx-6 mt-5 space-y-2">
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-violet-700">
          <Info className="w-4 h-4 shrink-0" />
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span>{PRICING.impression}</span>
            <span className="text-violet-300">·</span>
            <span>{PRICING.click}</span>
            <span className="text-violet-300">·</span>
            <span>{PRICING.minBudget}</span>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
          <span className="text-gray-500">Ad Wallet Balance</span>
          <span className="font-semibold text-gray-900">₦{(walletData?.data?.wallet?.balance ?? 0).toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        {/* Blog Space — Page Targeting */}
        {channel === "PUBLIC" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Pages <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">Select the public AbS pages where your ad will appear.</p>
            <div className="flex flex-wrap gap-2">
              {BLOG_TARGET_PAGES.map(({ value, label }) => {
                const active = targetPages.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleTargetPage(value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                      active
                        ? "bg-[#6E58FF] text-white border-[#6E58FF]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#6E58FF] hover:text-[#6E58FF]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {targetPages.length === 0 && (
              <p className="text-xs text-red-400 mt-1.5">At least one page required.</p>
            )}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Campaign Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Internal name for this campaign"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Ad Headline <span className="text-red-500">*</span>
          </label>
          <input
            name="headline"
            value={form.headline}
            onChange={handleChange}
            required
            maxLength={80}
            placeholder="Short, attention-grabbing headline"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition"
          />
          <p className="text-xs text-gray-400 mt-1">{form.headline.length}/80</p>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Ad Body Text <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bodyText"
            value={form.bodyText}
            onChange={handleChange}
            required
            rows={3}
            maxLength={300}
            placeholder="Brief description of your offer or message"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{form.bodyText.length}/300</p>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Ad Images <span className="text-gray-400 font-normal">(up to 5)</span>
          </label>

          {/* Image grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                  <img src={img.preview} alt="" className="w-full h-full object-cover" />
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                  {img.error && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Failed</span>
                    </div>
                  )}
                  {!img.uploading && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#6E58FF] hover:bg-violet-50 transition text-gray-400 hover:text-[#6E58FF]"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {images.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-[#6E58FF] hover:bg-violet-50 transition group"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:text-[#6E58FF] transition" />
              <p className="text-sm text-gray-500 group-hover:text-[#6E58FF] transition">
                Click to upload images
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Max 10MB each</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* CTA URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Landing Page URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="ctaUrl"
              value={form.ctaUrl}
              onChange={handleChange}
              required
              type="text"
              placeholder="https://yourwebsite.com/offer"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Total Budget (₦) <span className="text-red-500">*</span>
            </label>
            <input
              name="totalBudget"
              value={form.totalBudget}
              onChange={handleChange}
              required
              type="number"
              min={1000}
              placeholder="1000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Daily Cap (₦) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              name="dailyBudget"
              value={form.dailyBudget}
              onChange={handleChange}
              type="number"
              min={100}
              placeholder="No daily limit"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6E58FF]/30 focus:border-[#6E58FF] outline-none text-sm bg-gray-50 focus:bg-white transition"
            />
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

        <button
          type="submit"
          disabled={isLoading || images.some((i) => i.uploading)}
          className="w-full py-3 bg-[#6E58FF] text-white rounded-xl font-semibold hover:bg-[#5843e0] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdForm;

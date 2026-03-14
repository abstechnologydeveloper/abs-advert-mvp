/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Mail,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar,
  BarChart3,
  Activity,
  Loader2,
  XCircle,
  Eye,
  Wallet,
  MousePointerClick,
  Megaphone,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";
import { useGetCampaignStatisticsQuery } from "../redux/campaign/campaign-api";
import {
  useGetSelfServeCampaignsQuery,
  useGetAdWalletQuery,
  type SelfServeAdCampaign,
  type SelfServeAdStatus,
} from "../redux/self-serve-ads/self-serve-ads-api";
import { useNavigate } from "react-router-dom";
import { Campaign } from "../types/models";

// ─── Status badge for email campaigns ─────────────────────────────
const getEmailStatusBadge = (status: string) => {
  const statusConfig = {
    SENT: { bg: "bg-green-100", text: "text-green-800", label: "Sent", icon: CheckCircle },
    SCHEDULED: { bg: "bg-blue-100", text: "text-blue-800", label: "Scheduled", icon: Clock },
    PENDING: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending", icon: AlertCircle },
    DRAFT: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft", icon: FileText },
    FAILED: { bg: "bg-red-100", text: "text-red-800", label: "Failed", icon: XCircle },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
};

// ─── Ad status helpers ─────────────────────────────────────────────
const AD_STATUS_COLORS: Record<SelfServeAdStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  ACTIVE: "bg-green-50 text-green-700 border border-green-200",
  PAUSED: "bg-gray-100 text-gray-600 border border-gray-200",
  BUDGET_EXHAUSTED: "bg-orange-50 text-orange-700 border border-orange-200",
  COMPLETED: "bg-blue-50 text-blue-700 border border-blue-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
};
const AD_STATUS_LABELS: Record<SelfServeAdStatus, string> = {
  PENDING_REVIEW: "In Review",
  ACTIVE: "Active",
  PAUSED: "Paused",
  BUDGET_EXHAUSTED: "Budget Exhausted",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

// ─── Self-serve ads dashboard (for non-email users) ───────────────
const AdsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: adsData, isLoading: adsLoading } = useGetSelfServeCampaignsQuery();
  const { data: walletData, isLoading: walletLoading } = useGetAdWalletQuery();

  const campaigns: SelfServeAdCampaign[] = adsData?.data ?? [];
  const wallet = walletData?.data?.wallet;

  const totalAds = campaigns.length;
  const activeAds = campaigns.filter((c) => c.status === "ACTIVE").length;
  const pendingAds = campaigns.filter((c) => c.status === "PENDING_REVIEW").length;
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions ?? 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks ?? 0), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spentAmount ?? 0), 0);

  const formatNum = (n: number) => new Intl.NumberFormat("en-NG").format(n);

  const recentAds = [...campaigns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (adsLoading || walletLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6E58FF]" />
      </div>
    );
  }

  return (
    <div className="md:p-6 p-3 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gray-600 mt-1">Monitor your ad campaign performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Wallet + quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet balance */}
        <div className="bg-gradient-to-br from-[#6E58FF] to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Wallet size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Ad Wallet Balance</p>
          <p className="text-3xl font-bold">₦{formatNum(wallet?.balance ?? 0)}</p>
        </div>

        {/* Total ads */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Megaphone size={24} />
            </div>
            <BarChart3 size={20} className="opacity-80" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Campaigns</p>
          <p className="text-4xl font-bold">{formatNum(totalAds)}</p>
        </div>

        {/* Impressions */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Eye size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Total Impressions</p>
          <p className="text-4xl font-bold">{formatNum(totalImpressions)}</p>
        </div>

        {/* Clicks */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <MousePointerClick size={24} />
            </div>
            <Activity size={20} className="opacity-80" />
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Total Clicks</p>
          <p className="text-4xl font-bold">{formatNum(totalClicks)}</p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="p-3 bg-green-100 rounded-lg mb-3 w-fit mx-auto">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeAds}</p>
          <p className="text-xs text-gray-600 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="p-3 bg-amber-100 rounded-lg mb-3 w-fit mx-auto">
            <Clock size={24} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingAds}</p>
          <p className="text-xs text-gray-600 mt-1">In Review</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="p-3 bg-blue-100 rounded-lg mb-3 w-fit mx-auto">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) + "%" : "0%"}
          </p>
          <p className="text-xs text-gray-600 mt-1">Click-Through Rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="p-3 bg-purple-100 rounded-lg mb-3 w-fit mx-auto">
            <Wallet size={24} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{formatNum(totalSpent)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Spent</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/dashboard/app-web-ads")}
          className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#6E58FF] hover:shadow-sm transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition">
              <Users className="w-5 h-5 text-[#6E58FF]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Create App & Web Ad</p>
              <p className="text-xs text-gray-500 mt-0.5">Target students in Quill, Library & Opportunities</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#6E58FF] transition" />
        </button>
        <button
          onClick={() => navigate("/dashboard/blog-space")}
          className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#6E58FF] hover:shadow-sm transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 rounded-xl group-hover:bg-violet-100 transition">
              <Globe className="w-5 h-5 text-[#6E58FF]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Create Blog Space Ad</p>
              <p className="text-xs text-gray-500 mt-0.5">Reach visitors on Scholarships, Blog & Library pages</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#6E58FF] transition" />
        </button>
      </div>

      {/* Recent campaigns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Campaigns</h3>
          <p className="text-sm text-gray-600 mt-0.5">Your 5 most recent ad campaigns</p>
        </div>

        {recentAds.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Megaphone className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h4>
            <p className="text-gray-600 text-sm max-w-sm mx-auto mb-4">
              Create your first ad campaign to start reaching students across the AbS platform.
            </p>
            <button
              onClick={() => navigate("/dashboard/app-web-ads")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6E58FF] text-white rounded-xl text-sm font-semibold hover:bg-[#5843e0] transition"
            >
              Create First Ad →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentAds.map((ad) => (
              <div key={ad.id} className="p-5 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${AD_STATUS_COLORS[ad.status]}`}>
                        {AD_STATUS_LABELS[ad.status]}
                      </span>
                      <span className="text-[11px] text-gray-400 uppercase tracking-wide">{ad.channel}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 truncate text-sm">{ad.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{ad.headline}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Eye size={11} />{formatNum(ad.impressions)} imp.
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointerClick size={11} />{formatNum(ad.clicks)} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <Wallet size={11} />₦{formatNum(ad.spentAmount)} / ₦{formatNum(ad.totalBudget)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(ad.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Email campaign dashboard (for approved users) ─────────────────
const EmailDashboard: React.FC = () => {
  const { data: response, isLoading, error } = useGetCampaignStatisticsQuery({});
  const navigate = useNavigate();
  const stats = response?.data?.overview;
  const recentCampaigns = response?.data?.recentCampaigns || [];

  const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(num);
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="md:p-6 p-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading campaign statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:p-6 p-3">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto mt-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="text-lg font-bold mb-2 text-red-800">Failed to Load Statistics</h3>
          <p className="text-sm mb-4 text-red-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 p-3 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gray-600 mt-1">Monitor your email campaign performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm"><Mail size={24} /></div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Campaigns</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.totalCampaigns || 0)}</p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm"><Send size={24} /></div>
            <CheckCircle size={20} className="opacity-80" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Emails Sent</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.totalEmailsSent || 0)}</p>
        </div>
        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm"><FileText size={24} /></div>
            <BarChart3 size={20} className="opacity-80" />
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Active Drafts</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.draft || 0)}</p>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm"><Clock size={24} /></div>
            <Calendar size={20} className="opacity-80" />
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Scheduled</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.scheduled || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Sent", value: stats?.sent || 0, icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" },
          { label: "Pending", value: stats?.pending || 0, icon: AlertCircle, bg: "bg-amber-100", color: "text-amber-600" },
          { label: "Failed", value: stats?.failed || 0, icon: XCircle, bg: "bg-red-100", color: "text-red-600" },
          { label: "Success Rate", value: stats?.successRate || "0%", icon: TrendingUp, bg: "bg-blue-100", color: "text-blue-600", isString: true },
          { label: "Emails Failed", value: stats?.totalEmailsFailed || 0, icon: Mail, bg: "bg-gray-100", color: "text-gray-600" },
        ].map(({ label, value, icon: Icon, bg, color, isString }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 ${bg} rounded-lg mb-3`}><Icon size={24} className={color} /></div>
              <p className="text-2xl font-bold text-gray-900">{isString ? value : formatNumber(value as number)}</p>
              <p className="text-xs text-gray-600 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-0.5">Your 5 most recent campaigns</p>
        </div>
        {recentCampaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h4>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              Create your first email campaign to start reaching out to students
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCampaigns.map((campaign: Campaign) => (
              <div
                key={campaign.id}
                className="p-5 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                onClick={() => {
                  if (campaign.status !== "DRAFT") navigate(`/dashboard/campaign/${campaign.id}`);
                  else navigate(`/dashboard/edit-draft/${campaign.id}`);
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="shrink-0 mt-1">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Mail size={20} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate text-base">{campaign.name}</h4>
                          {campaign.recurring && (
                            <span className="shrink-0 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Recurring</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">{campaign.subject}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />Created {formatDateTime(campaign.createdAt.toString())}
                          </span>
                          {campaign.emailsSent > 0 && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <Send size={12} />{formatNumber(campaign.emailsSent)} sent
                            </span>
                          )}
                          {campaign.emailsFailed > 0 && (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                              <XCircle size={12} />{formatNumber(campaign.emailsFailed)} failed
                            </span>
                          )}
                          {campaign.sendAt && campaign.status === "SCHEDULED" && (
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                              <Clock size={12} />{formatDateTime(campaign.sendAt.toString())}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 lg:ml-4">{getEmailStatusBadge(campaign.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Root OverviewPage — routes to the right dashboard ────────────
const OverviewPage: React.FC = () => {
  const { error, isLoading } = useGetCampaignStatisticsQuery({});
  const is403 = !isLoading && (error as any)?.status === 403;

  // For non-email users show self-serve ad dashboard
  if (is403) return <AdsDashboard />;

  return <EmailDashboard />;
};

export default OverviewPage;

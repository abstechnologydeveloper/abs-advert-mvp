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
} from "lucide-react";
import { useGetCampaignStatisticsQuery } from "../redux/campaign/campaign-api";


const OverviewPage: React.FC = () => {
  const { data: response, isLoading, error } = useGetCampaignStatisticsQuery({});

  const stats = response?.data?.overview;
  const recentCampaigns = response?.data?.recentCampaigns || [];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
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
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Statistics</h3>
          <p className="text-red-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 p-3 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-gray-600 mt-1">Monitor your email campaign performance</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Activity size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Campaigns */}
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Mail size={24} />
            </div>
            <TrendingUp size={20} className="opacity-80" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Campaigns</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.totalCampaigns || 0)}</p>
        </div>

        {/* Emails Sent */}
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Send size={24} />
            </div>
            <CheckCircle size={20} className="opacity-80" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Emails Sent</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.totalEmailsSent || 0)}</p>
        </div>

        {/* Active Drafts */}
        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <FileText size={24} />
            </div>
            <BarChart3 size={20} className="opacity-80" />
          </div>
          <p className="text-orange-100 text-sm font-medium mb-1">Active Drafts</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.draft || 0)}</p>
        </div>

        {/* Scheduled */}
        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <Calendar size={20} className="opacity-80" />
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Scheduled</p>
          <p className="text-4xl font-bold">{formatNumber(stats?.scheduled || 0)}</p>
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Sent */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-100 rounded-lg mb-3">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.sent || 0)}</p>
            <p className="text-xs text-gray-600 mt-1">Sent</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-amber-100 rounded-lg mb-3">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.pending || 0)}</p>
            <p className="text-xs text-gray-600 mt-1">Pending</p>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 rounded-lg mb-3">
              <XCircle size={24} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(stats?.failed || 0)}</p>
            <p className="text-xs text-gray-600 mt-1">Failed</p>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-3">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats?.successRate || "0%"}</p>
            <p className="text-xs text-gray-600 mt-1">Success Rate</p>
          </div>
        </div>

        {/* Emails Failed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-gray-100 rounded-lg mb-3">
              <Mail size={24} className="text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(stats?.totalEmailsFailed || 0)}
            </p>
            <p className="text-xs text-gray-600 mt-1">Emails Failed</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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
            {recentCampaigns.map((campaign: any) => (
              <div
                key={campaign.id}
                className="p-5 hover:bg-gray-50 transition-colors duration-150"
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
                          <h4 className="font-semibold text-gray-900 truncate text-base">
                            {campaign.name}
                          </h4>
                          {campaign.recurring && (
                            <span className="shrink-0 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">{campaign.subject}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Created {formatDateTime(campaign.createdAt)}
                          </span>
                          {campaign.emailsSent > 0 && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <Send size={12} />
                              {formatNumber(campaign.emailsSent)} sent
                            </span>
                          )}
                          {campaign.emailsFailed > 0 && (
                            <span className="flex items-center gap-1 text-red-600 font-medium">
                              <XCircle size={12} />
                              {formatNumber(campaign.emailsFailed)} failed
                            </span>
                          )}
                          {campaign.sendAt && campaign.status === "SCHEDULED" && (
                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                              <Clock size={12} />
                              {formatDateTime(campaign.sendAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 lg:ml-4">{getStatusBadge(campaign.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;

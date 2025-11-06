/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Search,
  Filter,
  Calendar,
  Mail,
  Users,
  AlertCircle,
  Eye,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useGetPendingCampaignsQuery,
  useCancelCampaignMutation,
} from "../../redux/campaign/campaign-api";

const PendingCampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const { data, isLoading, refetch } = useGetPendingCampaignsQuery({
    page,
    limit: 10,
    search: searchQuery,
  });

  const [cancelCampaign, { isLoading: isCancelling }] = useCancelCampaignMutation();

  const campaigns = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/campaign/${id}`);
  };

  const handleCancelClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedCampaign) return;

    try {
      await cancelCampaign(selectedCampaign.id).unwrap();
      setShowCancelModal(false);
      setSelectedCampaign(null);
      refetch();
    } catch (error) {
      console.error("Failed to cancel campaign:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
      PENDING: {
        bg: "bg-yellow-100 border-yellow-300 text-yellow-800",
        text: "Pending Review",
        icon: Clock,
      },
      SCHEDULED: {
        bg: "bg-blue-100 border-blue-300 text-blue-800",
        text: "Scheduled",
        icon: Calendar,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading pending campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6. md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">In Review</h1>
            <p className="text-yellow-100 text-sm md:text-base">
              Campaigns awaiting admin approval before sending
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{pagination.total}</p>
              <p className="text-xs text-yellow-100">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mt-2">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">Campaign Review Process</h3>
          <p className="text-sm text-blue-800">
            All campaigns are reviewed by administrators before sending. You'll receive a
            notification once your campaign is approved or if changes are needed.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-2">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by campaign name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center mt-2">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Campaigns</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "No campaigns match your search criteria"
              : "All your campaigns have been reviewed"}
          </p>
          <button
            onClick={() => navigate("/dashboard/create-campaign")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Create New Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign: any) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {campaign.subject || "No subject"}
                    </p>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {campaign.targetAll ? (
                        <span className="text-blue-600">All Students</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.institutions?.length || 0} Institution(s)
                        </span>
                      )}
                    </p>
                  </div>
                  {campaign.sendAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Scheduled For</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(campaign.sendAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  {campaign.recurring && campaign.endAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Recurring Until</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(campaign.endAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Campaign ID: {campaign.id.slice(0, 8)}...
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(campaign.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleCancelClick(campaign)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * pagination.limit + 1} to{" "}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} campaigns
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Campaign</h3>
                <p className="text-sm text-gray-600">This action will move it back to drafts</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Campaign:</strong> {selectedCampaign?.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Subject:</strong> {selectedCampaign?.subject}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this campaign? It will be moved back to drafts and you
              can edit and resubmit it later.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedCampaign(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={isCancelling}
              >
                Keep Campaign
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Cancel Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCampaignsPage;

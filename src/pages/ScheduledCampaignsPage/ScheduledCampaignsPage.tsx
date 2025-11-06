import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Search,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Users,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { useCancelCampaignMutation, useDeleteCampaignMutation, useGetScheduledCampaignsQuery } from "../../redux/campaign/campaign-api";
import { Campaign } from "../../types/models";
import { formatNumber } from "../../utils/numberFormatter";


const ScheduledCampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetScheduledCampaignsQuery({
    page: currentPage,
    limit,
    search: searchQuery,
  });

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();
  const [cancelCampaign, { isLoading: isCancelling }] = useCancelCampaignMutation();

  const campaigns = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/dashboard/campaign/${id}`);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDeleteModal(true);
  };

  const handleCancelClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCancelModal(true);
  };

  const confirmDelete = async () => {
    if (selectedCampaign) {
      try {
        await deleteCampaign(selectedCampaign.id).unwrap();
        setShowDeleteModal(false);
        setSelectedCampaign(null);
      } catch (error) {
        console.error("Failed to delete campaign:", error);
      }
    }
  };

  const confirmCancel = async () => {
    if (selectedCampaign) {
      try {
        await cancelCampaign(selectedCampaign.id).unwrap();
        setShowCancelModal(false);
        setSelectedCampaign(null);
      } catch (error) {
        console.error("Failed to cancel campaign:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilScheduled = (sendAt: string) => {
    const now = new Date();
    const scheduled = new Date(sendAt);
    const diff = scheduled.getTime() - now.getTime();

    if (diff < 0) return "Sending soon...";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days}d ${hours}h`;
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scheduled Campaigns</h1>
              <p className="text-gray-600 mt-1">
                View and manage campaigns scheduled for future delivery
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by campaign name or subject..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Scheduled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pagination.total}</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {
                    campaigns.filter((c: Campaign) => {
                      const scheduled = new Date(c.sendAt);
                      const weekFromNow = new Date();
                      weekFromNow.setDate(weekFromNow.getDate() + 7);
                      return scheduled <= weekFromNow;
                    }).length
                  }
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Next 24 Hours</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {
                    campaigns.filter((c: Campaign) => {
                      const scheduled = new Date(c.sendAt);
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return scheduled <= tomorrow;
                    }).length
                  }
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="text-gray-600 font-medium">Loading scheduled campaigns...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && campaigns.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-purple-100 rounded-full">
                <Clock className="w-16 h-16 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Scheduled Campaigns</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? "No campaigns match your search criteria."
                : "You don't have any campaigns scheduled for future delivery."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/dashboard/create-campaign")}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Create New Campaign
              </button>
            )}
          </div>
        )}

        {/* Campaigns List */}
        {!isLoading && campaigns.length > 0 && (
          <div className="space-y-4">
            {campaigns.map((campaign: Campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                          {campaign.name}
                        </h3>
                        <p className="text-gray-600 text-sm truncate">{campaign.subject}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Scheduled:</span>
                        <span>{formatDate(campaign.sendAt.toString())}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">Recipients:</span>
                        {campaign.emailsSent > 0 && (
                          <span className="text-green-600">
                            {formatNumber(campaign.emailsSent)} 
                          </span>
                        )}
                        {campaign.emailsFailed > 0 && (
                          <span className="text-red-600 ml-2">
                            {formatNumber(campaign.emailsFailed)} failed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Sending {getTimeUntilScheduled(campaign.sendAt.toString())}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(campaign.id)}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleCancelClick(campaign)}
                      className="px-4 py-2.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition font-medium inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteClick(campaign)}
                      className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && campaigns.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">{(currentPage - 1) * limit + 1}</span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * limit, pagination.total)}
              </span>{" "}
              of <span className="font-semibold text-gray-900">{pagination.total}</span> campaigns
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isFetching}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        disabled={isFetching}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        } disabled:cursor-not-allowed`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages || isFetching}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cancel Scheduled Campaign</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel "{selectedCampaign.name}"? This campaign will not be
              sent at its scheduled time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel Campaign"
                )}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Keep Scheduled
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Campaign</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete "{selectedCampaign.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ScheduledCampaignsPage;

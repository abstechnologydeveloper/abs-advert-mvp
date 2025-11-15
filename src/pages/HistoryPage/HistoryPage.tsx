// pages/HistoryPage/HistoryPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Search,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Filter,
  Edit3,
  Calendar,
  X,
} from "lucide-react";
import {
  useGetHistoryQuery,
  useResendCampaignMutation,
} from "../../redux/campaign/campaign-api";
import { CampaignStatus } from "../../types/models";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | CampaignStatus>("");
  const [showFilters, setShowFilters] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [campaignToResend, setCampaignToResend] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const { data, isLoading, error } = useGetHistoryQuery({
    page,
    limit: 10,
    status: statusFilter,
    search: debouncedSearch,
  });

  const [resendCampaign, { isLoading: isResending }] =
    useResendCampaignMutation();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Toast notifications
  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleResendClick = (id: string) => {
    setCampaignToResend(id);
    setShowConfirmDialog(true);
  };

  const handleResendConfirm = async () => {
    if (!campaignToResend) return;

    setShowConfirmDialog(false);
    try {
      setResendingId(campaignToResend);
      await resendCampaign(campaignToResend).unwrap();
      showToast("Campaign resend initiated successfully!", "success");
    } catch (error) {
      console.error("Failed to resend campaign:", error);
      showToast("Failed to resend campaign. Please try again.", "error");
    } finally {
      setResendingId(null);
      setCampaignToResend(null);
    }
  };

  const handleResendCancel = () => {
    setShowConfirmDialog(false);
    setCampaignToResend(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit-failed/${id}`);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const styles = {
      SENT: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      SCHEDULED: "bg-blue-100 text-blue-800",
      DRAFT: "bg-gray-100 text-gray-800",
    };

    const icons = {
      SENT: <CheckCircle2 size={14} className="mr-1" />,
      FAILED: <XCircle size={14} className="mr-1" />,
      PENDING: <Clock size={14} className="mr-1" />,
      SCHEDULED: <Calendar size={14} className="mr-1" />,
      DRAFT: <Clock size={14} className="mr-1" />,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  // Status filter options
  const statusOptions: Array<{
    value: "" | CampaignStatus;
    label: string;
    color: string;
  }> = [
    { value: "", label: "All", color: "bg-blue-600" },
    { value: "SENT", label: "Sent", color: "bg-green-600" },
    { value: "FAILED", label: "Failed", color: "bg-red-600" },
    { value: "PENDING", label: "Pending", color: "bg-yellow-600" },
    { value: "SCHEDULED", label: "Scheduled", color: "bg-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-lg border animate-slide-in ${
                toast.type === "success"
                  ? "bg-green-50 border-green-200"
                  : toast.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              {toast.type === "success" && (
                <CheckCircle2 className="text-green-600 shrink-0" size={20} />
              )}
              {toast.type === "error" && (
                <XCircle className="text-red-600 shrink-0" size={20} />
              )}
              {toast.type === "info" && (
                <AlertCircle className="text-blue-600 shrink-0" size={20} />
              )}
              <p
                className={`flex-1 text-sm font-medium ${
                  toast.type === "success"
                    ? "text-green-800"
                    : toast.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }`}
              >
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`shrink-0 ${
                  toast.type === "success"
                    ? "text-green-600 hover:text-green-800"
                    : toast.type === "error"
                    ? "text-red-600 hover:text-red-800"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <RefreshCw className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Resend Campaign?
                  </h3>
                  <p className="text-sm text-gray-600">
                    This will send the campaign again to all recipients. Are you
                    sure you want to continue?
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleResendCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResendConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Yes, Resend
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Campaign History
          </h1>
          <p className="text-gray-600">
            View past campaigns and their performance
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:w-auto px-4 py-2 border rounded-lg transition inline-flex items-center justify-center ${
                showFilters
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Filter size={20} className="mr-2" />
              Filters
              {statusFilter && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      statusFilter === option.value
                        ? `${option.color} text-white`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Active Filters Summary */}
              {statusFilter && (
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Filtering by:{" "}
                    <span className="font-medium">{statusFilter}</span>
                  </p>
                  <button
                    onClick={() => setStatusFilter("")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <AlertCircle className="text-red-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load history
              </h3>
              <p className="text-gray-600">Please try again later</p>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Clock className="text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-600 mb-4">
                {search || statusFilter
                  ? "Try adjusting your filters"
                  : "Your sent campaigns will appear here"}
              </p>
              {(search || statusFilter) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Sent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <Clock
                              className="text-gray-400 mr-3 mt-1 shrink-0"
                              size={20}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {campaign.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-md">
                                {campaign.subject}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(campaign.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {formatNumber(
                                campaign.emailsSent + campaign.emailsFailed
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {campaign.emailsSent > 0 && (
                                <span className="text-green-600">
                                  {formatNumber(campaign.emailsSent)} sent
                                </span>
                              )}
                              {campaign.emailsFailed > 0 && (
                                <span className="text-red-600 ml-2">
                                  {formatNumber(campaign.emailsFailed)} failed
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/campaign/${campaign.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </button>

                          {/* Edit Button - Only for FAILED */}
                          {campaign.status === "FAILED" && (
                            <button
                              onClick={() => handleEdit(campaign.id)}
                              className="text-orange-600 hover:text-orange-800 mr-3 inline-flex items-center"
                            >
                              <Edit3 size={16} className="mr-1" />
                              Edit
                            </button>
                          )}

                          {/* Resend Button - Only for SENT */}
                          {campaign.status === "SENT" && (
                            <button
                              onClick={() => handleResendClick(campaign.id)}
                              disabled={
                                isResending && resendingId === campaign.id
                              }
                              className="text-green-600 hover:text-green-900 inline-flex items-center disabled:opacity-50"
                            >
                              {isResending && resendingId === campaign.id ? (
                                <Loader2
                                  size={16}
                                  className="mr-1 animate-spin"
                                />
                              ) : (
                                <RefreshCw size={16} className="mr-1" />
                              )}
                              Resend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {data.data.map((campaign) => (
                  <div key={campaign.id} className="p-4">
                    <div className="flex items-start mb-3">
                      <Clock
                        className="text-gray-400 mr-3 mt-1 shrink-0"
                        size={20}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {campaign.subject}
                        </p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      <div>Sent: {formatDate(campaign.createdAt)}</div>
                      <div>
                        Recipients:{" "}
                        {formatNumber(
                          campaign.emailsSent + campaign.emailsFailed
                        )}
                      </div>
                      {(campaign.emailsSent > 0 ||
                        campaign.emailsFailed > 0) && (
                        <div>
                          {campaign.emailsSent > 0 && (
                            <span className="text-green-600">
                              {formatNumber(campaign.emailsSent)} sent
                            </span>
                          )}
                          {campaign.emailsFailed > 0 && (
                            <span className="text-red-600 ml-2">
                              {formatNumber(campaign.emailsFailed)} failed
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/campaign/${campaign.id}`)
                        }
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center justify-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>

                      {/* Edit Button on Mobile - FAILED only */}
                      {campaign.status === "FAILED" && (
                        <button
                          onClick={() => handleEdit(campaign.id)}
                          className="flex-1 px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition inline-flex items-center justify-center"
                        >
                          <Edit3 size={16} className="mr-1" />
                          Edit
                        </button>
                      )}

                      {/* Resend Button on Mobile - SENT only */}
                      {campaign.status === "SENT" && (
                        <button
                          onClick={() => handleResendClick(campaign.id)}
                          disabled={isResending && resendingId === campaign.id}
                          className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center justify-center disabled:opacity-50"
                        >
                          {isResending && resendingId === campaign.id ? (
                            <Loader2 size={16} className="mr-1 animate-spin" />
                          ) : (
                            <RefreshCw size={16} className="mr-1" />
                          )}
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(page - 1) * 10 + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * 10, data.pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {data.pagination.total}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        {Array.from(
                          { length: data.pagination.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === data.pagination.totalPages ||
                              Math.abs(p - page) <= 1
                          )
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && arr[i - 1] !== p - 1 && (
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                  ...
                                </span>
                              )}
                              <button
                                onClick={() => setPage(p)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  p === page
                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          ))}
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={page === data.pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
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
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;

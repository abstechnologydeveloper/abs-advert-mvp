// pages/DraftsPage/DraftsPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  Users,
  Plus,
} from "lucide-react";
import { useGetDraftsQuery, useDeleteCampaignMutation } from "../../redux/campaign/campaign-api";
import { Campaign } from "../../types/models";


const DraftsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useGetDraftsQuery({
    page,
    limit: 12,
    search: debouncedSearch,
  });

  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setDeleteId(id);
        await deleteCampaign(id).unwrap();
      } catch (error) {
        console.error("Failed to delete draft:", error);
        alert("Failed to delete draft. Please try again.");
      } finally {
        setDeleteId(null);
      }
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getAudienceText = (campaign: Campaign) => {
    if (campaign.targetAll) return "All Students";
    const parts = [];
    if (campaign.institutions.length > 0)
      parts.push(
        `${campaign.institutions.length} School${campaign.institutions.length > 1 ? "s" : ""}`
      );
    if (campaign.departments.length > 0)
      parts.push(
        `${campaign.departments.length} Dept${campaign.departments.length > 1 ? "s" : ""}`
      );
    if (campaign.levels.length > 0)
      parts.push(`${campaign.levels.length} Level${campaign.levels.length > 1 ? "s" : ""}`);
    return parts.join(" • ") || "No targeting";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Draft Campaigns</h1>
            <button
              onClick={() => navigate("/dashboard/create-campaign")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={20} />
              New Campaign
            </button>
          </div>
          <p className="text-gray-600">Continue working on your saved drafts</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search drafts by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="text-red-500 mb-4 mx-auto" size={56} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load drafts</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts found</h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "Try adjusting your search terms"
                : "Start creating campaigns to save drafts"}
            </p>
            <button
              onClick={() => navigate("/dashboard/create-campaign")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus size={20} />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {data.data.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                          {draft.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {draft.subject || "No subject"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="text-blue-600" size={24} />
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(draft.updatedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span className="truncate">{getAudienceText(draft)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-gray-50 flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/edit-draft/${draft.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id, draft.name)}
                      disabled={isDeleting && deleteId === draft.id}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium disabled:opacity-50"
                    >
                      {isDeleting && deleteId === draft.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{(page - 1) * 12 + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(page * 12, data.pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{data.pagination.total}</span> drafts
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (data.pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= data.pagination.totalPages - 2) {
                          pageNum = data.pagination.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition ${
                              pageNum === page
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Mobile FAB */}
        <button
          onClick={() => navigate("/dashboard/create-campaign")}
          className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default DraftsPage;

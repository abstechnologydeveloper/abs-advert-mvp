// pages/CampaignDetailsPage/CampaignDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Building,
  GraduationCap,
  Layers,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
} from "lucide-react";
import { useGetCampaignByIdQuery } from "../../redux/campaign/campaign-api";
import { CampaignStatus } from "../../types/models";

const CampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const { data, isLoading, error } = useGetCampaignByIdQuery(id!, {
    skip: !id,
  });

  const campaign = data?.data;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
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
      SENT: "bg-green-100 text-green-800 border-green-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const icons = {
      SENT: <CheckCircle2 size={18} />,
      FAILED: <XCircle size={18} />,
      PENDING: <Clock size={18} />,
      SCHEDULED: <Calendar size={18} />,
      DRAFT: <Clock size={18} />,
    };

    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${styles[status]}`}
      >
        {icons[status]}
        <span className="font-semibold">{status}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="text-red-500 mb-4 mx-auto" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-6">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate("/dashboard/history")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const totalRecipients = campaign.emailsSent + campaign.emailsFailed;
  const successRate =
    totalRecipients > 0 ? ((campaign.emailsSent / totalRecipients) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
              <p className="text-gray-600">{campaign.subject}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(campaign.status)}

              {/* Edit buttons based on campaign status */}
              {campaign.status === "FAILED" && (
                <button
                  onClick={() => navigate(`/dashboard/edit-campaign/${campaign.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <Edit size={18} />
                  Edit & Resend
                </button>
              )}

              {campaign.status === "SENT" && (
                <button
                  onClick={() => navigate(`/dashboard/edit-campaign/${campaign.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Edit size={18} />
                  Edit & Resend
                </button>
              )}

              {campaign.status === "DRAFT" && (
                <button
                  onClick={() => navigate(`/dashboard/edit-campaign/${campaign.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Edit size={18} />
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Recipients</span>
              <Users className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(totalRecipients)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Successfully Sent</span>
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatNumber(campaign.emailsSent)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Failed</span>
              <XCircle className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatNumber(campaign.emailsFailed)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Success Rate</span>
              <Mail className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Campaign Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(campaign.createdAt)}
                  </p>
                </div>
              </div>

              {campaign.sendAt && (
                <div className="flex items-start">
                  <Clock className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Scheduled For</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(campaign.sendAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Mail className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Campaign Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {campaign.campaignType || "EMAIL"}
                  </p>
                </div>
              </div>

              {campaign.student && (
                <div className="flex items-start">
                  <Users className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="text-sm font-medium text-gray-900">
                      {campaign.student.firstName} {campaign.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{campaign.student.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Target Audience</h2>
            <div className="space-y-4">
              {campaign.targetAll ? (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Users className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-medium text-blue-900">All Students</p>
                    <p className="text-xs text-blue-700">Campaign sent to all verified students</p>
                  </div>
                </div>
              ) : (
                <>
                  {campaign.institutions.length > 0 && (
                    <div className="flex items-start">
                      <Building className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">
                          Institutions ({campaign.institutions.length})
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.institutions.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.departments.length > 0 && (
                    <div className="flex items-start">
                      <GraduationCap
                        className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="text-sm text-gray-600">
                          Departments ({campaign.departments.length})
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.departments.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.levels.length > 0 && (
                    <div className="flex items-start">
                      <Layers className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Levels ({campaign.levels.length})</p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.levels.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.institutions.length === 0 &&
                    campaign.departments.length === 0 &&
                    campaign.levels.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No specific targeting applied</p>
                    )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Email Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">Email Content Preview</h2>
                <p className="text-sm text-gray-600">
                  {showPreview ? "Click to hide" : "Click to view the email content"}
                </p>
              </div>
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {showPreview && (
            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-lg border border-gray-300 p-4 max-h-[600px] overflow-y-auto">
                {/* Isolated iframe for safe HTML rendering */}
                <iframe
                  srcDoc={campaign.content}
                  title="Email Preview"
                  className="w-full min-h-[500px] border-0"
                  sandbox="allow-same-origin"
                  style={{ colorScheme: "normal" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;

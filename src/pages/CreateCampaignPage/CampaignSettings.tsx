/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Building2,
  Users,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CampaignSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
  attachments: File[];
  setAttachments: (files: File[] | ((prev: File[]) => File[])) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({
  formData,
  setFormData,
  attachments,
  setAttachments,
  fileInputRef,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    audience: true,
    attachments: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const schools = [
    { id: "all", name: "All Schools", count: 10234 },
    { id: "engineering", name: "Engineering", count: 2456 },
    { id: "business", name: "Business", count: 1834 },
    { id: "arts", name: "Arts & Sciences", count: 3211 },
    { id: "medicine", name: "Medicine", count: 1456 },
    { id: "law", name: "Law", count: 1277 },
  ];

  const departments = [
    { id: "all", name: "All Departments", school: "all" },
    { id: "cs", name: "Computer Science", school: "engineering" },
    { id: "ee", name: "Electrical Eng.", school: "engineering" },
    { id: "me", name: "Mechanical Eng.", school: "engineering" },
    { id: "finance", name: "Finance", school: "business" },
    { id: "marketing", name: "Marketing", school: "business" },
    { id: "economics", name: "Economics", school: "business" },
  ];

  const levels = [
    { id: "all", name: "All Levels", count: 10234 },
    { id: "freshman", name: "Freshman", count: 2567 },
    { id: "sophomore", name: "Sophomore", count: 2234 },
    { id: "junior", name: "Junior", count: 2145 },
    { id: "senior", name: "Senior", count: 1876 },
    { id: "graduate", name: "Graduate", count: 1234 },
    { id: "alumni", name: "Alumni", count: 178 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b">
        <h2 className="text-base font-bold text-gray-900">Campaign Settings</h2>
        <p className="text-xs text-gray-600 mt-0.5">Configure campaign details</p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Basic Information - Collapsible */}
        <div>
          <button
            onClick={() => toggleSection("basic")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                1
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Basic Info</h3>
            </div>
            {expandedSections.basic ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.basic && (
            <div className="px-4 pb-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Fall 2025 Newsletter"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Important Campus Update"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Audience Targeting - Collapsible */}
        <div>
          <button
            onClick={() => toggleSection("audience")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                2
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Audience</h3>
            </div>
            {expandedSections.audience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.audience && (
            <div className="px-4 pb-4 space-y-3">
              {/* Schools */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  <Building2 size={12} className="mr-1" />
                  School
                </label>
                <select
                  value={formData.school}
                  onChange={(e) => {
                    setFormData({ ...formData, school: e.target.value, department: "all" });
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} ({school.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Departments */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  <Users size={12} className="mr-1" />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={formData.school === "all"}
                >
                  {departments
                    .filter((dept) => dept.school === formData.school || dept.id === "all")
                    .map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  <GraduationCap size={12} className="mr-1" />
                  Student Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name} ({level.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Audience Summary - Compact */}
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Target:</strong>{" "}
                  {formData.school === "all"
                    ? "All"
                    : schools.find((s) => s.id === formData.school)?.name}{" "}
                  {formData.department !== "all" && (
                    <>→ {departments.find((d) => d.id === formData.department)?.name}</>
                  )}{" "}
                  {formData.level !== "all" && (
                    <>→ {levels.find((l) => l.id === formData.level)?.name}</>
                  )}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>~{Math.floor(Math.random() * 5000 + 1000).toLocaleString()}</strong>{" "}
                  recipients
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Attachments - Collapsible */}
        <div>
          <button
            onClick={() => toggleSection("attachments")}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                3
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                Attachments {attachments.length > 0 && `(${attachments.length})`}
              </h3>
            </div>
            {expandedSections.attachments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedSections.attachments && (
            <div className="px-4 pb-4 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileAttachment}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-xs font-medium text-gray-700"
              >
                <Upload size={16} />
                <span>Upload files</span>
              </button>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <FileText size={14} className="text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 hover:bg-red-100 rounded transition flex-shrink-0"
                      >
                        <X size={14} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

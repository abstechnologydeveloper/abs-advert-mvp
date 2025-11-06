/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import {
  Upload,
  FileText,
  X,
  Building2,
  Users,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { MultiSelectDropdown } from "../../../components/MultiSelectDropdown";


interface CampaignSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
  attachments: File[];
  setAttachments: (files: File[] | ((prev: File[]) => File[])) => void;
  existingAttachments?: any[];
  setExistingAttachments?: (attachments: any[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  institutions: any[];
  isLoadingInstitutions: boolean;
}

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({
  formData,
  setFormData,
  attachments,
  setAttachments,
  existingAttachments = [],
  setExistingAttachments,
  fileInputRef,
  institutions = [],
  isLoadingInstitutions = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    audience: true,
    attachments: false,
  });

  // Merge departments and levels from selected institutions
  const { mergedDepartments, mergedLevels } = useMemo(() => {
    if (!formData.institutions || formData.institutions.length === 0) {
      return { mergedDepartments: [], mergedLevels: [] };
    }

    const selectedInstitutions = institutions.filter((inst) =>
      formData.institutions.includes(inst.institutionId)
    );

    const deptSet = new Set<string>();
    const levelSet = new Set<string>();

    selectedInstitutions.forEach((inst) => {
      let depts: string[] = [];
      if (inst.departments) {
        if (Array.isArray(inst.departments)) {
          depts = inst.departments;
        } else if (typeof inst.departments === "string") {
          try {
            depts = JSON.parse(inst.departments);
          } catch {
            depts = [];
          }
        }
      }

      let lvls: string[] = [];
      if (inst.levels) {
        if (Array.isArray(inst.levels)) {
          lvls = inst.levels;
        } else if (typeof inst.levels === "string") {
          try {
            lvls = JSON.parse(inst.levels);
          } catch {
            lvls = [];
          }
        }
      }

      depts.forEach((dept) => deptSet.add(dept));
      lvls.forEach((level) => levelSet.add(level));
    });

    return {
      mergedDepartments: Array.from(deptSet).sort(),
      mergedLevels: Array.from(levelSet).sort(),
    };
  }, [formData.institutions, institutions]);

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

  const removeExistingAttachment = (index: number) => {
    if (setExistingAttachments) {
      setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
    }
  };

  const handleInstitutionsChange = (selectedIds: string[]) => {
    setFormData({
      ...formData,
      institutions: selectedIds,
      departments: [],
      levels: [],
    });
  };

  const handleDepartmentsChange = (selectedDepts: string[]) => {
    setFormData({ ...formData, departments: selectedDepts });
  };

  const handleLevelsChange = (selectedLevels: string[]) => {
    setFormData({ ...formData, levels: selectedLevels });
  };

  const getInstitutionName = (institutionId: string) => {
    return institutions.find((i) => i.institutionId === institutionId)?.name || institutionId;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileName = (attachment: any) => {
    return attachment.originalName || attachment.filename || "Attachment";
  };

  const totalAttachments = existingAttachments.length + attachments.length;

  // Transform institutions for MultiSelectDropdown
  const institutionOptions = institutions.map((inst) => ({
    id: inst.institutionId,
    label: inst.name,
  }));

  const departmentOptions = mergedDepartments.map((dept) => ({
    id: dept,
    label: dept,
  }));

  const levelOptions = mergedLevels.map((level) => ({
    id: level,
    label: level,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-b">
        <h2 className="text-base font-bold text-gray-900">Campaign Settings</h2>
        <p className="text-xs text-gray-600 mt-0.5">Configure campaign details</p>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Basic Information */}
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

        {/* Audience Targeting */}
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
              {/* Target All Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users size={14} className="text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Target All Students</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetAll}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAll: e.target.checked,
                        institutions: e.target.checked ? [] : formData.institutions,
                        departments: e.target.checked ? [] : formData.departments,
                        levels: e.target.checked ? [] : formData.levels,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {!formData.targetAll && (
                <>
                  {/* Institutions Multi-Select */}
                  <MultiSelectDropdown
                    label="Institutions"
                    icon={<Building2 size={12} />}
                    options={institutionOptions}
                    selectedValues={formData.institutions || []}
                    onChange={handleInstitutionsChange}
                    placeholder="Select institutions..."
                    searchPlaceholder="Search institutions..."
                    tagColor="blue"
                    isLoading={isLoadingInstitutions}
                    getDisplayName={getInstitutionName}
                  />

                  {/* Departments Multi-Select */}
                  {formData.institutions &&
                    formData.institutions.length > 0 &&
                    mergedDepartments.length > 0 && (
                      <MultiSelectDropdown
                        label="Departments"
                        icon={<Users size={12} />}
                        options={departmentOptions}
                        selectedValues={formData.departments || []}
                        onChange={handleDepartmentsChange}
                        placeholder="Select departments..."
                        searchPlaceholder="Search departments..."
                        tagColor="green"
                        helperText={
                          formData.institutions.length > 1
                            ? `from ${formData.institutions.length} institutions`
                            : undefined
                        }
                      />
                    )}

                  {/* Levels Multi-Select */}
                  {formData.institutions &&
                    formData.institutions.length > 0 &&
                    mergedLevels.length > 0 && (
                      <MultiSelectDropdown
                        label="Student Levels"
                        icon={<GraduationCap size={12} />}
                        options={levelOptions}
                        selectedValues={formData.levels || []}
                        onChange={handleLevelsChange}
                        placeholder="Select levels..."
                        searchPlaceholder="Search levels..."
                        tagColor="purple"
                        helperText={
                          formData.institutions.length > 1
                            ? `from ${formData.institutions.length} institutions`
                            : undefined
                        }
                      />
                    )}

                  {/* Info message */}
                  {formData.institutions && formData.institutions.length > 0 && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
                      <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">
                        {formData.institutions.length > 1
                          ? `Departments and levels are merged from all ${formData.institutions.length} selected institutions. Students matching ALL selected criteria will receive the email.`
                          : "Select departments and levels to further narrow your audience."}
                      </p>
                    </div>
                  )}

                  {/* Audience Summary */}
                  <div className="p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-900">
                      <strong>📊 Target Summary:</strong>{" "}
                      {formData.institutions && formData.institutions.length > 0
                        ? `${formData.institutions.length} institution(s)`
                        : "No institution selected"}
                      {formData.departments && formData.departments.length > 0 && (
                        <> • {formData.departments.length} department(s)</>
                      )}
                      {formData.levels && formData.levels.length > 0 && (
                        <> • {formData.levels.length} level(s)</>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Attachments */}
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
                Attachments {totalAttachments > 0 && `(${totalAttachments})`}
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

              {existingAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Existing Files:</p>
                  {existingAttachments.map((file, index) => (
                    <div
                      key={`existing-${index}`}
                      className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <FileText size={14} className="text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {getFileName(file)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.size ? formatFileSize(file.size) : "Unknown size"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {file.url && (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-blue-100 rounded transition"
                            title="View file"
                          >
                            <ExternalLink size={14} className="text-blue-600" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingAttachment(index)}
                          className="p-1 hover:bg-red-100 rounded transition"
                          title="Remove file"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {existingAttachments.length > 0 && (
                    <p className="text-xs font-medium text-gray-700">New Files:</p>
                  )}
                  {attachments.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <FileText size={14} className="text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
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

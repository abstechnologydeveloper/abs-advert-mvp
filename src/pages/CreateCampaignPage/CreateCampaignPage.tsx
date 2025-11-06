/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import "../../prose-mirror.css";
import { useEditor, EditorContent } from "@tiptap/react";
import { useNavigate } from "react-router-dom";
import { editorExtensions } from "./components/editorConfig";
import { Toolbar } from "./components/Toolbar";
import { CampaignSettings } from "./components/CampaignSettings";
import { SlashMenu } from "./components/SlashMenu";
import { EditorBubbleMenu } from "./components/EditorBubbleMenu";
import { EmailPreview } from "./components/EmailPreview";
import {
  Eye,
  Send,
  Save,
  Calendar,
  Loader2,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";
import {
  useCreateEmailCampaignMutation,
  useGetSchoolsQuery,
  useSaveDraftMutation,
  useUpdateDraftMutation,
  useUploadAttachmentsMutation,
} from "../../redux/campaign/campaign-api";
import { getMaxEndDate, useCampaignForm } from "./hooks/useCampaignForm";
import { handleSchedule, handleSaveDraft, handleSubmit } from "./utils/campaignHandlers";
import { Toast, MINIMUM_SCHEDULE_HOURS } from "./types/campaign.types";

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();

  const [previewMode, setPreviewMode] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [toast, setToast] = useState<Toast | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const scheduleButtonRef = useRef<HTMLButtonElement>(null);
  const scheduleDropdownRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        class: "email-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      const { state } = editor;
      const { selection } = state;
      const { from } = selection;
      const textBefore = state.doc.textBetween(Math.max(0, from - 10), from, "\n");
      const slashIndex = textBefore.lastIndexOf("/");
      if (slashIndex !== -1 && slashIndex === textBefore.length - 1) {
        const { view } = editor;
        const coords = view.coordsAtPos(from);
        const editorRect = editorRef.current?.getBoundingClientRect();
        if (editorRect) {
          let top = coords.top - editorRect.top + 30;
          let left = coords.left - editorRect.left;
          const menuWidth = window.innerWidth < 640 ? 256 : 288;
          const menuHeight = window.innerWidth < 640 ? 256 : 400;
          const editorWidth = editorRect.width;
          const editorHeight = editorRect.height;
          if (left + menuWidth > editorWidth) {
            left = Math.max(0, editorWidth - menuWidth - 20);
          }
          if (top + menuHeight > editorHeight) {
            top = coords.top - editorRect.top - menuHeight - 10;
            if (top < 0) top = 10;
          }
          left = Math.max(10, left);
          top = Math.max(10, top);
          setSlashMenuPosition({ top, left });
        }
        setShowSlashMenu(true);
      } else if (showSlashMenu && slashIndex === -1) {
        setShowSlashMenu(false);
      }
    },
  });

  // API Hooks
  const [createCampaign, { isLoading: isSending }] = useCreateEmailCampaignMutation();
  const [saveDraft, { isLoading: isSavingDraft }] = useSaveDraftMutation();
  const [updateDraft, { isLoading: isUpdatingDraft }] = useUpdateDraftMutation();
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useGetSchoolsQuery({});
  const [uploadAttachments, { isLoading: isUploadingImage }] = useUploadAttachmentsMutation();

  const institutions = institutionsData?.data || [];

  // Use custom hook for form management
  const {
    draftId,
    mode,
    formData,
    setFormData,
    attachments,
    setAttachments,
    existingAttachments,
    setExistingAttachments,
    isLoadingCampaign,
    refetchCampaign,
    resetForm,
    setDraftLoaded,
  } = useCampaignForm(editor, institutions);

  // Sync schedule modal
  useEffect(() => {
    if (formData.sendAt) {
      const dt = new Date(formData.sendAt);
      setScheduleDate(dt.toISOString().split("T")[0]);
      setScheduleTime(dt.toISOString().split("T")[1].slice(0, 5));
    } else {
      setScheduleDate("");
      setScheduleTime("");
    }

    if (formData.endAt) {
      const dt = new Date(formData.endAt);
      setEndDate(dt.toISOString().split("T")[0]);
      setEndTime(dt.toISOString().split("T")[1].slice(0, 5));
    } else {
      setEndDate("");
      setEndTime("");
    }
  }, [formData.sendAt, formData.endAt]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSlashMenu) setShowSlashMenu(false);
        if (showScheduleModal) setShowScheduleModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showSlashMenu, showScheduleModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showScheduleModal &&
        scheduleDropdownRef.current &&
        scheduleButtonRef.current &&
        !scheduleDropdownRef.current.contains(event.target as Node) &&
        !scheduleButtonRef.current.contains(event.target as Node)
      ) {
        setShowScheduleModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showScheduleModal]);

  const handleScheduleClick = () => {
    handleSchedule({
      scheduleDate,
      scheduleTime,
      endDate,
      endTime,
      formData,
      setFormData,
      setShowScheduleModal,
      setToast,
    });
  };

  const handleClearSchedule = () => {
    setFormData({ ...formData, sendNow: true, sendAt: null, endAt: null });
    setScheduleDate("");
    setScheduleTime("");
    setEndDate("");
    setEndTime("");
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        editor
          .chain()
          .focus()
          .setImage({
            src: dataUrl,
            alt: "Uploading...",
          })
          .run();
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("attachments", file);
      const response = await uploadAttachments(formData).unwrap();

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) throw new Error("Upload failed - no URL returned");

      const { state } = editor;
      let imagePos: number | null = null;

      state.doc.descendants((node, pos) => {
        if (node.type.name === "image" && node.attrs.src.startsWith("data:")) {
          imagePos = pos;
          return false;
        }
      });

      if (imagePos !== null) {
        const { tr } = state;
        tr.setNodeMarkup(imagePos, undefined, {
          src: imageUrl,
          alt: file.name,
        });
        editor.view.dispatch(tr);
      } else {
        editor
          .chain()
          .focus()
          .setImage({
            src: imageUrl,
            alt: file.name,
          })
          .run();
      }

      setToast({ message: "Image uploaded successfully!", type: "success" });
    } catch (error: any) {
      console.error("Image upload error:", error);
      setToast({
        message: error?.data?.message || "Image upload failed",
        type: "error",
      });
      editor.commands.undo();
    }

    e.target.value = "";
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updatedAttachments = [...attachments];
    const updatedExisting = [...existingAttachments];

    newFiles.forEach((file) => {
      const existingIndex = updatedExisting.findIndex((f) => f.originalName === file.name);
      if (existingIndex !== -1) {
        updatedExisting.splice(existingIndex, 1);
      }
      const newIndex = updatedAttachments.findIndex((f) => f.name === file.name);
      if (newIndex !== -1) {
        updatedAttachments[newIndex] = file;
      } else {
        updatedAttachments.push(file);
      }
    });

    setAttachments(updatedAttachments);
    setExistingAttachments(updatedExisting);
  };

  const onSaveDraft = () => {
    handleSaveDraft({
      formData,
      editor,
      attachments,
      institutions,
      draftId,
      mode,
      saveDraft,
      updateDraft,
      refetchCampaign,
      setDraftLoaded,
      setToast,
      navigate,
    });
  };

  const onSubmit = () => {
    handleSubmit({
      formData,
      editor,
      attachments,
      institutions,
      draftId,
      createCampaign,
      setToast,
      resetForm,
      navigate,
    });
  };

  if (!editor || (isLoadingCampaign && draftId)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            {isLoadingCampaign ? "Loading Campaign..." : "Loading Editor..."}
          </p>
        </div>
      </div>
    );
  }

  const isSavingOrUpdating = isSavingDraft || isUpdatingDraft;

  const scheduledTime = formData.sendAt
    ? new Date(formData.sendAt).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  // Calculate minimum schedule time
  const minScheduleDateTime = new Date(Date.now() + MINIMUM_SCHEDULE_HOURS * 60 * 60 * 1000);
  const minScheduleDate = minScheduleDateTime.toISOString().split("T")[0];
  const minScheduleTime = minScheduleDateTime.toTimeString().slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-3 sm:py-6">
      <div className="max-w-[1600px] mx-auto px-3">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white animate-slide-in-right ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-6">
                <CampaignSettings
                  formData={formData}
                  setFormData={setFormData}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  existingAttachments={existingAttachments}
                  setExistingAttachments={setExistingAttachments}
                  fileInputRef={fileInputRef}
                  institutions={institutions}
                  isLoadingInstitutions={isLoadingInstitutions}
                />
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <img
                        src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
                        alt="ABS Logo"
                        className="h-7 sm:h-8 w-auto bg-white rounded p-1 flex-shrink-0"
                      />
                      <div className="text-white min-w-0">
                        <h1 className="text-sm sm:text-lg font-bold truncate">
                          {draftId ? "Edit Campaign" : "Email Campaign"}
                        </h1>
                        <p className="text-xs text-blue-100 hidden sm:block">
                          {draftId ? "Update your campaign" : "Create engaging campaigns"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={onSaveDraft}
                        disabled={isSavingOrUpdating}
                        className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm disabled:opacity-50"
                        title="Save Draft"
                      >
                        {isSavingOrUpdating ? (
                          <Loader2 size={16} className="animate-spin sm:mr-1" />
                        ) : (
                          <Save size={16} className="sm:mr-1" />
                        )}
                        <span className="hidden sm:inline">
                          {draftId && mode === "draft" ? "Update" : "Draft"}
                        </span>
                      </button>

                      <div className="relative">
                        <button
                          ref={scheduleButtonRef}
                          type="button"
                          onClick={() => setShowScheduleModal(!showScheduleModal)}
                          className={`flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white rounded-lg transition backdrop-blur-sm ${
                            formData.sendAt
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-white/20 hover:bg-white/30"
                          }`}
                          title="Schedule"
                        >
                          <Calendar size={16} className="sm:mr-1" />
                          <span className="hidden lg:inline">Schedule</span>
                        </button>
                        {showScheduleModal && (
                          <div
                            ref={scheduleDropdownRef}
                            className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-16 sm:top-full sm:mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-auto sm:w-80 z-50 p-4 max-h-[calc(100vh-5rem)] overflow-y-auto"
                          >
                            <h3 className="text-base font-bold text-gray-900 mb-2">
                              Schedule Campaign
                            </h3>
                            <p className="text-xs text-gray-600 mb-3 bg-yellow-50 border border-yellow-200 rounded p-2">
                              ⏰ Campaigns must be scheduled at least{" "}
                              <strong>{MINIMUM_SCHEDULE_HOURS} hours</strong> in advance for admin
                              review.
                            </p>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  min={minScheduleDate}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  min={
                                    scheduleDate === minScheduleDate ? minScheduleTime : undefined
                                  }
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>

                              <div className="border-t pt-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    End Date (Optional - For Recurring)
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500 mb-1.5 bg-blue-50 border border-blue-200 rounded p-2">
                                  📅 Recurring campaigns can run for a maximum of{" "}
                                  <strong>7 days</strong>
                                </p>
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  min={scheduleDate || minScheduleDate}
                                  max={getMaxEndDate(scheduleDate)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                  End Time (Optional)
                                </label>
                                <input
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>

                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleScheduleClick}
                                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                >
                                  Schedule
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowScheduleModal(false)}
                                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
                        title="Preview"
                      >
                        <Eye size={16} className="sm:mr-1" />
                        <span className="hidden lg:inline">Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSending}
                        className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm bg-white text-blue-600 hover:bg-gray-50 rounded-lg transition shadow-sm font-semibold disabled:opacity-50"
                      >
                        {isSending ? (
                          <Loader2 size={16} className="mr-1 animate-spin" />
                        ) : (
                          <Send size={16} className="mr-1" />
                        )}
                        <span>{formData.sendAt ? "Schedule & Submit" : "Submit for Review"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <Toolbar editor={editor} imageInputRef={imageInputRef} />

                <div className="bg-gray-50 min-h-[400px] sm:min-h-[600px]">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white border-gray-200 overflow-hidden">
                      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Subject:</p>
                          <p className="text-sm font-semibold text-gray-900 break-words">
                            {formData.subject || "No subject"}
                          </p>
                        </div>
                        {formData.sendAt && (
                          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <Clock size={14} />
                            <span className="text-xs font-medium">Scheduled:</span>
                            <span className="text-sm font-semibold">{scheduledTime}</span>
                            <button
                              onClick={handleClearSchedule}
                              className="ml-1 text-green-600 hover:text-red-600"
                              title="Clear Schedule"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div
                        className="p-4 sm:p-4 relative min-h-[300px] sm:min-h-[400px]"
                        ref={editorRef}
                      >
                        <EditorContent editor={editor} />
                        <EditorBubbleMenu editor={editor} imageInputRef={imageInputRef} />
                        {showSlashMenu && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowSlashMenu(false)}
                            />
                            <SlashMenu
                              editor={editor}
                              position={slashMenuPosition}
                              onClose={() => setShowSlashMenu(false)}
                              imageInputRef={imageInputRef}
                            />
                          </>
                        )}
                      </div>

                      <div className="bg-gray-900 text-white p-4 sm:p-5 border-t border-gray-800">
                        <div className="text-center">
                          <h3 className="text-sm sm:text-base font-bold mb-1.5">About AbS</h3>
                          <p className="text-gray-300 text-xs mb-2 max-w-2xl mx-auto leading-relaxed">
                            Your comprehensive educational platform for academic materials,
                            scholarships, AI tools, and career opportunities.
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs mb-2">
                            <a
                              href="https://www.abstechconnect.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              Website
                            </a>
                            <a
                              href="https://x.com/ABSTEAM01"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              Twitter
                            </a>
                            <a
                              href="https://www.linkedin.com/company/abstechconnect1/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              LinkedIn
                            </a>
                            <a
                              href="https://web.facebook.com/people/ABS-Solution/61564113997916/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              Facebook
                            </a>
                          </div>
                          <p className="text-xs text-gray-500 border-t border-gray-700 pt-2 mt-2">
                            © 2025 AbS. All rights reserved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 sm:mt-4">
                    <p className="text-xs text-gray-500">
                      Type <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">/</kbd> to insert
                      blocks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmailPreview editor={editor} onClose={() => setPreviewMode(false)} />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isUploadingImage}
      />
    </div>
  );
};

export default CreateCampaignPage;

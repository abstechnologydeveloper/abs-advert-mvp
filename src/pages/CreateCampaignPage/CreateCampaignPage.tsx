/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import "../../prose-mirror.css";
import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "./components/editorConfig";
import { Toolbar } from "./components/Toolbar";
import { CampaignSettings } from "./components/CampaignSettings";
import { SlashMenu } from "./components/SlashMenu";
import { EditorBubbleMenu } from "./components/EditorBubbleMenu";
import { Eye, Send, Save, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";
import { wrapEmailTemplate } from "./components/emailTemplate";
import { EmailPreview } from "./components/EmailPreview";
import {
  useCreateEmailCampaignMutation,
  useGetSchoolsQuery,
  useSaveDraftMutation,
} from "../../redux/campaign/campaign-api";

const CreateCampaignPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    targetAll: false,
    institutions: [] as string[],
    departments: [] as string[],
    levels: [] as string[],
    sendNow: true,
    sendAt: null as string | null,
    recurring: false,
    timeSlots: [] as string[],
    campaignType: "EMAIL",
    fromName: "AbS",
    fromEmail: "hello@abstechconnect.com",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const scheduleButtonRef = useRef<HTMLButtonElement>(null);
  const scheduleDropdownRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const [createCampaign, { isLoading: isSending }] = useCreateEmailCampaignMutation();
  const [saveDraft, { isLoading: isSavingDraft }] = useSaveDraftMutation();
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useGetSchoolsQuery({});

  const institutions = institutionsData?.data || [];


  console.log(institutionsData);

  // Handle Escape key to close slash menu and schedule dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSlashMenu) {
          setShowSlashMenu(false);
          event.preventDefault();
        }
        if (showScheduleModal) {
          setShowScheduleModal(false);
          event.preventDefault();
        }
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

      // Get the text before cursor (up to 10 characters back to catch "/ ")
      const textBefore = state.doc.textBetween(Math.max(0, from - 10), from, "\n");

      // Check if there's a "/" followed by optional spaces/text
      const slashIndex = textBefore.lastIndexOf("/");

      if (slashIndex !== -1 && slashIndex === textBefore.length - 1) {
        // Slash is the last character typed
        const { view } = editor;
        const coords = view.coordsAtPos(from);
        const editorRect = editorRef.current?.getBoundingClientRect();

        if (editorRect) {
          // Calculate position relative to editor
          let top = coords.top - editorRect.top + 30;
          let left = coords.left - editorRect.left;

          // Menu dimensions (approximate)
          const menuWidth = window.innerWidth < 640 ? 256 : 288; // w-64 on mobile, w-72 on sm+
          const menuHeight = window.innerWidth < 640 ? 256 : 400; // smaller on mobile

          // Get editor dimensions
          const editorWidth = editorRect.width;
          const editorHeight = editorRect.height;

          // Adjust horizontal position if menu would overflow right
          if (left + menuWidth > editorWidth) {
            left = Math.max(0, editorWidth - menuWidth - 20);
          }

          // Adjust vertical position if menu would overflow bottom
          if (top + menuHeight > editorHeight) {
            // Show above the cursor instead
            top = coords.top - editorRect.top - menuHeight - 10;
            // If still overflows top, just position at top with scroll
            if (top < 0) {
              top = 10;
            }
          }

          // Ensure minimum margins
          left = Math.max(10, left);
          top = Math.max(10, top);

          setSlashMenuPosition({
            top,
            left,
          });
        }
        setShowSlashMenu(true);
      } else if (showSlashMenu && slashIndex === -1) {
        // User deleted the slash or moved away
        setShowSlashMenu(false);
      }
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter a campaign name");
      setShowErrorModal(true);
      return;
    }

    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject line");
      setShowErrorModal(true);
      return;
    }

    if (!formData.targetAll && (!formData.institutions || formData.institutions.length === 0)) {
      setErrorMessage("Please select at least one institution or enable 'Target All'");
      setShowErrorModal(true);
      return;
    }

    const content = editor?.getHTML() || "";
    if (!content || content === "<p></p>") {
      setErrorMessage("Please add email content");
      setShowErrorModal(true);
      return;
    }

    try {
      const emailContent = wrapEmailTemplate(content, formData.subject);
      const campaignData = new FormData();

      // Add basic fields
      campaignData.append("name", formData.name);
      campaignData.append("subject", formData.subject);
      campaignData.append("content", emailContent);
      campaignData.append("targetAll", String(formData.targetAll));
      campaignData.append("sendNow", String(formData.sendNow));
      campaignData.append("recurring", String(formData.recurring));
      campaignData.append("campaignType", formData.campaignType);

      // Add arrays
      if (!formData.targetAll) {
        formData.institutions.forEach((inst) => {
          campaignData.append("institutions[]", inst);
        });
        formData.departments.forEach((dept) => {
          campaignData.append("departments[]", dept);
        });
        formData.levels.forEach((level) => {
          campaignData.append("levels[]", level);
        });
      }

      // Add schedule if applicable
      if (formData.sendAt) {
        campaignData.append("sendAt", formData.sendAt);
      }

      // Add attachments
      attachments.forEach((file) => {
        campaignData.append("attachments", file);
      });

      await createCampaign(campaignData).unwrap();

      setShowSuccessModal(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          subject: "",
          targetAll: false,
          institutions: [],
          departments: [],
          levels: [],
          sendNow: true,
          sendAt: null,
          recurring: false,
          timeSlots: [],
          campaignType: "EMAIL",
          fromName: "AbS",
          fromEmail: "hello@abstechconnect.com",
        });
        setAttachments([]);
        setScheduleDate("");
        setScheduleTime("");
        editor?.commands.setContent("<p></p>");
        setShowSuccessModal(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      setErrorMessage(error?.data?.message || "Failed to create campaign. Please try again.");
      setShowErrorModal(true);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("Please enter a campaign name before saving");
      setShowErrorModal(true);
      return;
    }

    try {
      const content = editor?.getHTML() || "";
      const emailContent = wrapEmailTemplate(content, formData.subject);

      const draftData = {
        name: formData.name,
        subject: formData.subject,
        content: emailContent,
        targetAll: formData.targetAll,
        institutions: formData.institutions,
        departments: formData.departments,
        levels: formData.levels,
        campaignType: formData.campaignType,
      };

      await saveDraft(draftData).unwrap();

      alert("💾 Draft saved successfully!");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      setErrorMessage(error?.data?.message || "Failed to save draft. Please try again.");
      setShowErrorModal(true);
    }
  };

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      setErrorMessage("Please select both date and time");
      setShowErrorModal(true);
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

    if (scheduledDateTime <= new Date()) {
      setErrorMessage("Scheduled time must be in the future");
      setShowErrorModal(true);
      return;
    }

    setFormData({
      ...formData,
      sendNow: false,
      sendAt: scheduledDateTime.toISOString(),
    });

    setShowScheduleModal(false);

    // Submit the scheduled campaign
    handleSubmit();
  };

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-3 sm:py-6">
      <div className="max-w-[1600px] mx-auto px-3">
        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Campaign Settings Sidebar - Sticky on Desktop */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-6">
                <CampaignSettings
                  formData={formData}
                  setFormData={setFormData}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  fileInputRef={fileInputRef}
                  institutions={institutions}
                  isLoadingInstitutions={isLoadingInstitutions}
                />
              </div>
            </div>

            {/* Editor Section - Main Content Area */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Integrated Header with Actions - Mobile Responsive */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <img
                        src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
                        alt="ABS Logo"
                        className="h-7 sm:h-8 w-auto bg-white rounded p-1 flex-shrink-0"
                      />
                      <div className="text-white min-w-0">
                        <h1 className="text-sm sm:text-lg font-bold truncate">Email Campaign</h1>
                        <p className="text-xs text-blue-100 hidden sm:block">
                          Create engaging campaigns
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSavingDraft}
                        className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm disabled:opacity-50"
                        title="Save Draft"
                      >
                        {isSavingDraft ? (
                          <Loader2 size={16} className="animate-spin sm:mr-1" />
                        ) : (
                          <Save size={16} className="sm:mr-1" />
                        )}
                        <span className="hidden sm:inline">Draft</span>
                      </button>
                      <div className="relative">
                        <button
                          ref={scheduleButtonRef}
                          type="button"
                          onClick={() => setShowScheduleModal(!showScheduleModal)}
                          className="flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
                          title="Schedule"
                        >
                          <Calendar size={16} className="sm:mr-1" />
                          <span className="hidden lg:inline">Schedule</span>
                        </button>

                        {/* Schedule Dropdown */}
                        {showScheduleModal && (
                          <div
                            ref={scheduleDropdownRef}
                            className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-72 sm:w-80 z-50 p-4"
                          >
                            <h3 className="text-base font-bold text-gray-900 mb-3">
                              Schedule Campaign
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  value={scheduleDate}
                                  onChange={(e) => setScheduleDate(e.target.value)}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                  Time
                                </label>
                                <input
                                  type="time"
                                  value={scheduleTime}
                                  onChange={(e) => setScheduleTime(e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleSchedule}
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
                        onClick={handleSubmit}
                        disabled={isSending}
                        className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-1.5 text-xs sm:text-sm bg-white text-blue-600 hover:bg-gray-50 rounded-lg transition shadow-sm font-semibold disabled:opacity-50"
                      >
                        {isSending ? (
                          <Loader2 size={16} className="mr-1 animate-spin" />
                        ) : (
                          <Send size={16} className="mr-1" />
                        )}
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
                <Toolbar editor={editor} imageInputRef={imageInputRef} />
                <div className=" bg-gray-50 min-h-[400px] sm:min-h-[600px]">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white border-gray-200 overflow-hidden">
                      {formData.subject && (
                        <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-2 sm:py-3">
                          <p className="text-xs text-gray-500 mb-0.5">Subject:</p>
                          <p className="text-sm font-semibold text-gray-900 break-words">
                            {formData.subject}
                          </p>
                        </div>
                      )}

                      {/* Editor Content */}
                      <div
                        className="p-4 sm:p-4 relative min-h-[300px] sm:min-h-[400px]"
                        ref={editorRef}
                      >
                        <EditorContent editor={editor} />

                        {/* Bubble Menu */}
                        <EditorBubbleMenu editor={editor} imageInputRef={imageInputRef} />

                        {/* Slash Command Menu */}
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

                      {/* Email Footer Preview */}
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
                              🌐 Website
                            </a>
                            <a
                              href="https://x.com/ABSTEAM01"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              🐦 Twitter
                            </a>
                            <a
                              href="https://www.linkedin.com/company/abstechconnect1/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              💼 LinkedIn
                            </a>
                            <a
                              href="https://web.facebook.com/people/ABS-Solution/61564113997916/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              📘 Facebook
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
                      💡 Type <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">/</kbd> to
                      insert blocks
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

      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editor) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const url = event.target?.result as string;
              editor.chain().focus().setImage({ src: url }).run();
              setTimeout(() => editor.chain().focus().enter().run(), 100);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {formData.sendAt ? "Campaign Scheduled!" : "Campaign Sent!"}
              </h3>
              <p className="text-gray-600">
                {formData.sendAt
                  ? "Your email campaign has been scheduled successfully."
                  : "Your email campaign has been sent successfully."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaignPage;

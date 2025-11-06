/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from "react-router-dom";
import { wrapEmailTemplate } from "../components/emailTemplate";
import {
  CampaignFormData,
  Toast,
  MINIMUM_SCHEDULE_MS,
  MINIMUM_SCHEDULE_HOURS,
} from "../types/campaign.types";

interface HandleScheduleParams {
  scheduleDate: string;
  scheduleTime: string;
  endDate: string;
  endTime: string;
  formData: CampaignFormData;
  setFormData: (data: CampaignFormData) => void;
  setShowScheduleModal: (show: boolean) => void;
  setToast: (toast: Toast | null) => void;
}

export const handleSchedule = ({
  scheduleDate,
  scheduleTime,
  endDate,
  endTime,
  formData,
  setFormData,
  setShowScheduleModal,
  setToast,
}: HandleScheduleParams) => {
  if (!scheduleDate || !scheduleTime) {
    setToast({ message: "Please select start date and time", type: "error" });
    return;
  }

  // Create date in local timezone and preserve it
  const [year, month, day] = scheduleDate.split("-").map(Number);
  const [hours, minutes] = scheduleTime.split(":").map(Number);

  const scheduledDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  const timeDiff = scheduledDateTime.getTime() - now.getTime();

  // Check if scheduled time is at least 3 hours in the future
  if (timeDiff < MINIMUM_SCHEDULE_MS) {
    setToast({
      message: `Campaigns must be scheduled at least ${MINIMUM_SCHEDULE_HOURS} hours in advance for admin review`,
      type: "error",
    });
    return;
  }

  // Handle end date validation if provided
  let endDateTime: Date | null = null;
  let isRecurring = false;

  if (endDate && endTime) {
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    endDateTime = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes);

    // Validate end time is after start time
    if (endDateTime <= scheduledDateTime) {
      setToast({
        message: "End time must be after start time",
        type: "error",
      });
      return;
    }

    // Set recurring to true when endAt is provided
    isRecurring = true;
  }

  setFormData({
    ...formData,
    sendNow: false,
    sendAt: scheduledDateTime.toISOString(),
    endAt: endDateTime ? endDateTime.toISOString() : null,
    recurring: isRecurring,
  });

  setShowScheduleModal(false);
  setToast({
    message: `Campaign scheduled successfully! It will be reviewed by admins before sending.`,
    type: "success",
  });
};

interface HandleSaveDraftParams {
  formData: CampaignFormData;
  editor: any;
  attachments: File[];
  institutions: any[];
  draftId: string | null;
  mode: string | null;
  saveDraft: any;
  updateDraft: any;
  refetchCampaign: any;
  setDraftLoaded: (loaded: boolean) => void;
  setToast: (toast: Toast | null) => void;
  navigate: NavigateFunction;
}

export const handleSaveDraft = async ({
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
}: HandleSaveDraftParams) => {
  if (!formData.name.trim()) {
    setToast({ message: "Please enter a campaign name before saving", type: "error" });
    return;
  }

  try {
    const rawContent = editor?.getHTML() || "";

    const draftFormData = new FormData();
    draftFormData.append("name", formData.name);
    draftFormData.append("subject", formData.subject);
    draftFormData.append("content", rawContent);
    draftFormData.append("targetAll", String(formData.targetAll));
    draftFormData.append("campaignType", formData.campaignType);
    draftFormData.append("sendNow", String(formData.sendNow));
    if (formData.sendAt) draftFormData.append("sendAt", formData.sendAt);
    if (formData.endAt) draftFormData.append("endAt", formData.endAt);
    draftFormData.append("recurring", String(formData.recurring));
    formData.timeSlots.forEach((slot) => draftFormData.append("timeSlots[]", slot));

    if (!formData.targetAll) {
      const institutionNames = formData.institutions
        .map((id: string) => {
          const institution = institutions.find((inst) => inst.institutionId === id);
          return institution?.name;
        })
        .filter(Boolean);

      draftFormData.append("institutions", JSON.stringify(institutionNames));
      draftFormData.append("departments", JSON.stringify(formData.departments));
      draftFormData.append("levels", JSON.stringify(formData.levels));
    }

    attachments.forEach((file) => {
      draftFormData.append("attachments", file);
    });

    if (draftId && mode === "draft") {
      await updateDraft({ id: draftId, data: draftFormData }).unwrap();
      await refetchCampaign();
      setDraftLoaded(false);
      setToast({ message: "Draft updated successfully!", type: "success" });
    } else {
      await saveDraft(draftFormData).unwrap();
      setToast({ message: "Draft saved successfully!", type: "success" });
      setTimeout(() => navigate("/dashboard/drafts"), 1500);
    }
  } catch (error: any) {
    console.log(error?.message);
    setToast({
      message: error?.data?.message || "Failed to save draft. Please try again.",
      type: "error",
    });
  }
};

interface HandleSubmitParams {
  formData: CampaignFormData;
  editor: any;
  attachments: File[];
  institutions: any[];
  draftId: string | null;
  createCampaign: any;
  setToast: (toast: Toast | null) => void;
  resetForm: () => void;
  navigate: NavigateFunction;
}

export const handleSubmit = async ({
  formData,
  editor,
  attachments,
  institutions,
  draftId,
  createCampaign,
  setToast,
  resetForm,
  navigate,
}: HandleSubmitParams) => {
  if (!formData.name.trim()) {
    setToast({ message: "Please enter a campaign name", type: "error" });
    return;
  }
  if (!formData.subject.trim()) {
    setToast({ message: "Please enter a subject line", type: "error" });
    return;
  }
  if (!formData.targetAll && (!formData.institutions || formData.institutions.length === 0)) {
    setToast({
      message: "Please select at least one institution or enable 'Target All'",
      type: "error",
    });
    return;
  }
  const rawContent = editor?.getHTML() || "";
  if (!rawContent || rawContent === "<p></p>") {
    setToast({ message: "Please add email content", type: "error" });
    return;
  }

  // Validate schedule time if scheduled
  if (formData.sendAt) {
    const scheduledTime = new Date(formData.sendAt).getTime();
    const now = new Date().getTime();
    const timeDiff = scheduledTime - now;

    if (timeDiff < MINIMUM_SCHEDULE_MS) {
      setToast({
        message: `Scheduled campaigns must be at least ${MINIMUM_SCHEDULE_HOURS} hours in advance for admin review`,
        type: "error",
      });
      return;
    }
  }

  try {
    const finalEmailContent = wrapEmailTemplate(rawContent, formData.subject);

    const campaignData = new FormData();
    campaignData.append("name", formData.name);
    campaignData.append("subject", formData.subject);
    campaignData.append("content", finalEmailContent);
    campaignData.append("targetAll", String(formData.targetAll));
    campaignData.append("sendNow", String(formData.sendNow));
    campaignData.append("recurring", String(formData.recurring));
    campaignData.append("campaignType", formData.campaignType);

    if (draftId) {
      campaignData.append("campaignId", draftId);
    }

    if (!formData.targetAll) {
      const institutionNames = formData.institutions
        .map((id: string) => {
          const institution = institutions.find((inst) => inst.institutionId === id);
          return institution?.name;
        })
        .filter(Boolean);

      campaignData.append("institutions", JSON.stringify(institutionNames));
      campaignData.append("departments", JSON.stringify(formData.departments));
      campaignData.append("levels", JSON.stringify(formData.levels));
    }

    if (formData.sendAt) {
      campaignData.append("sendAt", formData.sendAt);
    }

    if (formData.endAt) {
      campaignData.append("endAt", formData.endAt);
    }

    if (formData.timeSlots && formData.timeSlots.length > 0) {
      campaignData.append("timeSlots", JSON.stringify(formData.timeSlots));
    }

    attachments.forEach((file) => campaignData.append("attachments", file));

    const res = await createCampaign(campaignData).unwrap();

    setToast({
      message: formData.sendAt
        ? "Campaign scheduled successfully and submitted for admin review!"
        : "Campaign submitted successfully for admin review!",
      type: "success",
    });

    setTimeout(() => {
      resetForm();
      navigate(`/dashboard/campaign/${res.data.id}`);
    }, 3000);
  } catch (error: any) {
    setToast({
      message: error?.data?.message || "Failed to create campaign. Please try again.",
      type: "error",
    });
  }
};

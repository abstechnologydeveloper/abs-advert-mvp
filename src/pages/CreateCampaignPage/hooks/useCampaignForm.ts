/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { CampaignFormData, MINIMUM_SCHEDULE_HOURS } from "../types/campaign.types";
import { useGetCampaignByIdQuery } from "../../../redux/campaign/campaign-api";

export const useCampaignForm = (editor: any, institutions: any[]) => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const draftId = params.id || searchParams.get("draftId");
  const mode = searchParams.get("mode") || (params.id ? "draft" : null);

  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    subject: "",
    targetAll: false,
    institutions: [],
    departments: [],
    levels: [],
    sendNow: true,
    sendAt: null,
    endAt: null,
    recurring: false,
    timeSlots: [],
    campaignType: "EMAIL",
    fromName: "AbS",
    fromEmail: "hello@abstechconnect.com",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const shouldFetchDraft = Boolean(draftId);
  const {
    data: campaignData,
    isLoading: isLoadingCampaign,
    refetch: refetchCampaign,
  } = useGetCampaignByIdQuery(draftId!, {
    skip: !shouldFetchDraft,
    // Force refetch when draftId changes
    refetchOnMountOrArgChange: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      targetAll: false,
      institutions: [],
      departments: [],
      levels: [],
      sendNow: true,
      sendAt: null,
      endAt: null,
      recurring: false,
      timeSlots: [],
      campaignType: "EMAIL",
      fromName: "AbS",
      fromEmail: "hello@abstechconnect.com",
    });
    setExistingAttachments([]);
    setAttachments([]);
    editor?.commands.setContent("<p></p>");
    setDraftLoaded(false);
  };

  // Reset when draftId changes or is cleared
  useEffect(() => {
    if (!draftId) {
      resetForm();
    } else {
      // Reset the draftLoaded flag when draftId changes
      setDraftLoaded(false);
    }
  }, [draftId]);

  // Load draft data
  useEffect(() => {
    if (campaignData?.data && draftId && editor && !draftLoaded && institutions.length > 0) {
      const campaign = campaignData.data;

      // Only process if this is the correct campaign
      if (campaign.id !== draftId) {
        return;
      }

      let rawContent = campaign.content || "<p></p>";

      const bodyMatch = rawContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) rawContent = bodyMatch[1];

      const footerRegex = /<div[^>]*class=["']bg-gray-900[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi;
      rawContent = rawContent.replace(footerRegex, "").trim();

      // Convert institution names back to IDs for the form
      let institutionIds: string[] = [];
      if (Array.isArray(campaign.institutions)) {
        institutionIds = campaign.institutions
          .map((nameOrId: string) => {
            const byName = institutions.find((inst) => inst.name === nameOrId);
            if (byName) return byName.institutionId;

            const byId = institutions.find((inst) => inst.institutionId === nameOrId);
            return byId?.institutionId;
          })
          .filter(Boolean) as string[];
      }

      setFormData({
        name: campaign.name || "",
        subject: campaign.subject || "",
        targetAll: campaign.targetAll || false,
        institutions: institutionIds,
        departments: Array.isArray(campaign.departments) ? campaign.departments : [],
        levels: Array.isArray(campaign.levels) ? campaign.levels : [],
        sendNow: !campaign.sendAt,
        sendAt: campaign.sendAt || null,
        endAt: campaign.endAt || null,
        recurring: campaign.recurring || false,
        timeSlots: Array.isArray(campaign.timeSlots) ? campaign.timeSlots : [],
        campaignType: campaign.campaignType || "EMAIL",
        fromName: "AbS",
        fromEmail: "hello@abstechconnect.com",
      });

      editor.commands.setContent(rawContent || "<p></p>");

      if (campaign.attachments) {
        const attachmentsArray = Array.isArray(campaign.attachments)
          ? campaign.attachments
          : [campaign.attachments].filter(Boolean);
        setExistingAttachments(attachmentsArray);
      }

      setDraftLoaded(true);
    }
  }, [campaignData, draftId, editor, draftLoaded, institutions]);

  return {
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
    draftLoaded,
    setDraftLoaded,
  };
};


export const getMaxEndDate = (startDate: string): string => {
  if (!startDate) {
    const minScheduleDateTime = new Date(Date.now() + MINIMUM_SCHEDULE_HOURS * 60 * 60 * 1000);
    const maxDate = new Date(minScheduleDateTime);
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split("T")[0];
  }
  const start = new Date(startDate);
  const maxDate = new Date(start);
  maxDate.setDate(maxDate.getDate() + 7);
  return maxDate.toISOString().split("T")[0];
};

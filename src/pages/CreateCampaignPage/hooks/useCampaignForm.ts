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
      setDraftLoaded(false);
    }
  }, [draftId]);

  // ✅ FIXED: Better content extraction to prevent mirror/doubled content
  const extractEditorContent = (htmlContent: string): string => {
    if (!htmlContent) return "<p></p>";

    // ✅ METHOD 1: Extract from the actual email template (table-based structure)
    // The real email template uses: <td style="padding: 30px 25px;"><div...>CONTENT HERE</div></td>
    const emailTableContentMatch = htmlContent.match(
      /<td[^>]*style=["'][^"']*padding:\s*30px\s+25px[^"']*["'][^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<!--\s*CTA Button\s*-->/i
    );
    
    if (emailTableContentMatch && emailTableContentMatch[1]) {
      let extracted = emailTableContentMatch[1].trim();
      // Remove the font-size wrapper div if present
      extracted = extracted.replace(/^<div[^>]*style=["'][^"']*font-size:\s*17px[^"']*["'][^>]*>([\s\S]*)<\/div>$/i, '$1');
      console.log("✅ Extracted using email table method");
      return extracted.trim();
    }

    // ✅ METHOD 2: Extract from preview component structure (div-based)
    const previewContentMatch = htmlContent.match(
      /<div[^>]*class=["'][^"']*email-editor-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
    );
    
    if (previewContentMatch && previewContentMatch[1]) {
      console.log("✅ Extracted using preview method");
      return previewContentMatch[1].trim();
    }

    // ✅ METHOD 3: Extract body content and clean up (fallback)
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let rawContent = bodyMatch ? bodyMatch[1] : htmlContent;

    // Remove common template elements
    const elementsToRemove = [
      // Remove the entire header table row with gradient background
      /<tr>\s*<td[^>]*background:\s*linear-gradient\([^)]*\)[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi,
      // Remove "What Makes AbS Special" section
      /<tr>\s*<td[^>]*background-color:\s*#f0f9ff[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi,
      // Remove footer section
      /<tr>\s*<td[^>]*background-color:\s*#1a202c[^>]*>[\s\S]*?<\/td>\s*<\/tr>/gi,
      // Remove CTA button table
      /<table[^>]*>[\s\S]*?Visit AbS[\s\S]*?<\/table>/gi,
      // Remove style tags
      /<style[\s\S]*?<\/style>/gi,
      // Remove the outer container table
      /<table[^>]*role=["']presentation["'][^>]*>[\s\S]*?$/gi,
      /^[\s\S]*?<\/table>/gi,
    ];

    elementsToRemove.forEach(regex => {
      rawContent = rawContent.replace(regex, '');
    });

    // Extract content from td with padding: 30px 25px (main content cell)
    const mainContentMatch = rawContent.match(
      /<td[^>]*padding:\s*30px\s+25px[^>]*>([\s\S]*?)<\/td>/i
    );
    
    if (mainContentMatch && mainContentMatch[1]) {
      rawContent = mainContentMatch[1];
      // Remove wrapper div
      rawContent = rawContent.replace(/^<div[^>]*>([\s\S]*)<\/div>$/i, '$1');
    }

    // Final cleanup
    rawContent = rawContent.trim();
    
    console.log("✅ Extracted using fallback method");
    return rawContent || "<p></p>";
  };

  // Load draft data
  useEffect(() => {
    if (campaignData?.data && draftId && editor && !draftLoaded && institutions.length > 0) {
      const campaign = campaignData.data;

      // Only process if this is the correct campaign
      if (campaign.id !== draftId) {
        return;
      }

      // ✅ Use the improved extraction function
      const extractedContent = extractEditorContent(campaign.content || "<p></p>");

      console.log("🔍 Extracted content length:", extractedContent.length);
      console.log("🔍 Original content length:", campaign.content?.length || 0);

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

      editor.commands.setContent(extractedContent);

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
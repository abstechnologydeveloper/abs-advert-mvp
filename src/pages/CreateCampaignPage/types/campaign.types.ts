export interface CampaignFormData {
  name: string;
  subject: string;
  targetAll: boolean;
  institutions: string[];
  departments: string[];
  levels: string[];
  sendNow: boolean;
  sendAt: string | null;
  endAt: string | null;
  recurring: boolean;
  timeSlots: string[];
  campaignType: string;
  fromName: string;
  fromEmail: string;
}

export interface Toast {
  message: string;
  type: "success" | "error";
}

export const MINIMUM_SCHEDULE_HOURS = 3;
export const MINIMUM_SCHEDULE_MS = MINIMUM_SCHEDULE_HOURS * 60 * 60 * 1000;

// ==================== types/billing.types.ts ====================
import { LucideIcon } from "lucide-react";

export interface Plan {
  name: string;
  price: number;
  dailyLimit: number;
  monthlyLimit: number;
  contactLimit?: number;
  impressionLimit?: number;
  postLimit?: number | null;
  listingLimit?: number | null;
  bookLimit?: number | null;
  userLimit: number;
  scheduleLimit: number | null;
  features: string[];
}

export interface CampaignType {
  id: string;
  label: string;
  icon: LucideIcon;
  plans: {
    Basic: Plan;
    Growth: Plan;
    Pro: Plan;
    Enterprise: Plan;
  };
}

export interface Subscription {
  planName: string;
  status: "active" | "inactive" | "expired";
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface Usage {
  dailySent: number;
  monthlySent: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  status: "completed" | "pending" | "failed";
  reference: string;
}

export interface SelectedPlanForFunding {
  campaignType: string;
  planName: string;
  shortfall: number;
}

export type CampaignTypeId =
  | "email"
  | "quills"
  | "blog"
  | "scholarship"
  | "library";

export type SubscriptionsState = Record<CampaignTypeId, Subscription | null>;
export type UsageState = Record<CampaignTypeId, Usage>;


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
  id?: string;
  isActive?: boolean;
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
  type: "CREDIT" | "DEBIT";
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  reference?: string;
  createdAt: string;
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

// API Response Types
export interface ApiPlanResponse {
  id: string;
  campaignType: string;
  planTier: string;
  monthlyPrice: number;
  dailyLimit: number;
  monthlyLimit: number;
  userLimit: number;
  scheduleLimit: number | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalanceResponse {
  success: boolean;
  data: {
    balance: number;
    studentId: string;
  };
}

export interface WalletSummaryResponse {
  success: boolean;
  data: {
    balance: number;
    totalCredited: number;
    totalDebited: number;
    pendingWithdrawals: number;
    availableBalance: number;
    recentTransactions: Transaction[];
  };
}

export interface PaymentInitResponse {
  success: boolean;
  message: string;
  data: {
    channel: string;
    fees: number;
    currency: string;
    amount: number;
    reference: string;
    status: string;
    dateCreated: string;
    paymentUrl: string;
    customer: {
      email: string;
      phone: string;
    };
  };
}

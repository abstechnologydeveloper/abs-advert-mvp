// ============================================
// FILE: src/types/index.ts
// ============================================
export interface User {
  name: string;
  email: string;
  avatar: string;
  timezone: string;
  currency: string;
}

export interface Campaign {
  id: number;
  name: string;
  date: string;
  audience: string;
  recipients?: number;
  status?: string;
}

export type PageType = "overview" | "create-campaign" | "drafts" | "history";

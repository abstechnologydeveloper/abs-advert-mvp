// ==================== utils/planTransformers.ts ====================

import { ApiPlanResponse, CampaignTypeId, Plan, Transaction } from "../types/billing.types";

/**
 * Normalize plan tier from API format (BASIC) to component format (Basic)
 */
export function normalizePlanTier(apiTier: string): string {
  return apiTier.charAt(0).toUpperCase() + apiTier.slice(1).toLowerCase();
}

/**
 * Normalize campaign type from API format (EMAIL) to component format (email)
 */
export function normalizeCampaignType(apiType: string): CampaignTypeId {
  return apiType.toLowerCase() as CampaignTypeId;
}

/**
 * Transform a single API plan to component Plan format
 */
export function transformApiPlanToComponentPlan(
  apiPlan: ApiPlanResponse
): Plan {
  return {
    name: normalizePlanTier(apiPlan.planTier),
    price: apiPlan.monthlyPrice,
    dailyLimit: apiPlan.dailyLimit,
    monthlyLimit: apiPlan.monthlyLimit,
    userLimit: apiPlan.userLimit,
    scheduleLimit: apiPlan.scheduleLimit,
    features: apiPlan.features,
    id: apiPlan.id,
    isActive: apiPlan.isActive,
  };
}

/**
 * Transform API plan data to component-friendly format
 */
export function transformApiPlansToComponentFormat(
  apiPlans: ApiPlanResponse[]
): Record<CampaignTypeId, Record<string, Plan>> {
  const transformed: Record<string, Record<string, Plan>> = {};

  apiPlans.forEach((apiPlan) => {
    const campaignType = normalizeCampaignType(apiPlan.campaignType);
    const planName = normalizePlanTier(apiPlan.planTier);

    if (!transformed[campaignType]) {
      transformed[campaignType] = {};
    }

    transformed[campaignType][planName] =
      transformApiPlanToComponentPlan(apiPlan);
  });

  return transformed as Record<CampaignTypeId, Record<string, Plan>>;
}

/**
 * Convert component format back to API format for subscription
 */
export function convertPlanNameToApiTier(planName: string): string {
  return planName.toUpperCase();
}

/**
 * Transform API transactions to component format
 */
export function transformApiTransactions(
  apiTransactions: Transaction[]
): Transaction[] {
  return apiTransactions.map((txn) => ({
    ...txn,
    date: new Date(txn.createdAt).toLocaleDateString("en-NG"),
    type: txn.type,
    status: txn.status,
  }));
}

// ==================== utils/formatters.ts ====================
import { Shield, TrendingUp, Zap, Crown, LucideIcon } from "lucide-react";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getPlanIcon = (planName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Basic: Shield,
    Growth: TrendingUp,
    Pro: Zap,
    Enterprise: Crown,
  };
  return icons[planName] || Shield;
};

export const formatNumber = (num: number, locale: string = "en-US"): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

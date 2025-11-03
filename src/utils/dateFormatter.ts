export const formatDate = (date: string, timezone: string = "UTC"): string => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: timezone,
  }).format(dateObj);
};

export const formatDateTime = (date: string, timezone: string = "UTC"): string => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(dateObj);
};

import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

// ✅ Define valid tag types here
export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Notifications",
    "Stats",
    "Preferences",
    "Campaigns",
    "Billing",
    "Drafts",
    "Plans",
    "History",
    "Stats",
    "Schools",
    "Pending",
    "Scheduled",
  ],
  endpoints: () => ({}),
});

export default api;

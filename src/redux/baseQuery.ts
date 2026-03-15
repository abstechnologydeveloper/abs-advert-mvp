/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import qs from "qs";
import { AuthStorage } from "../utils/authStorage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  prepareHeaders: (headers) => {
    const token = AuthStorage.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // NOTE: Do NOT set Content-Type here globally.
    // - For JSON bodies, fetchBaseQuery sets "application/json" automatically.
    // - For FormData bodies, the browser must set "multipart/form-data" itself
    //   (with the correct boundary string). Overriding it here would break uploads.
    return headers;
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" }),
});

const baseQueryWithErrorHandling: BaseQueryFn<any, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // ✅ Global error handler
  if (result?.error) {
    console.error("API Error:", result.error);
    const status = (result.error as any)?.status;
    const data = (result.error as any)?.data;

    // ✅ Handle unauthorized access (token expired / invalid) — NOT permission errors (403)
    if (status === 401) {
      AuthStorage.clearAuth();
      window.location.href = "/login";
    }

    // ✅ Handle custom app-level validation errors
    if (
      status === 400 &&
      (data?.message?.toLowerCase().includes("student is required") ||
        data?.error?.toLowerCase().includes("student"))
    ) {
      console.warn("Student context missing, redirecting to login...");
      AuthStorage.clearAuth();
      window.location.href = "/login";
    }
  }

  return result;
};

export default baseQueryWithErrorHandling;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authServiceApis = createApi({
  reducerPath: "authServiceApis",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json; charset=utf-8");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/ads/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    contactUs: builder.mutation({
      query: (contactData) => ({
        url: "/ads/auth/contact-us",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useContactUsMutation } = authServiceApis;

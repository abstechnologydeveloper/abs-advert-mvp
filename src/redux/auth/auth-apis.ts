/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authServiceApis = createApi({
  reducerPath: "authServiceApis",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.dev.abstechconnect.com/api/v1/ads/auth",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json; charset=utf-8");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginUserMutation } = authServiceApis;

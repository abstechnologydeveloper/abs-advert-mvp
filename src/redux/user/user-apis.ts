/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";

export const userServiceApis = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDetails: builder.query<any, void>({
      query: () => ({
        url: "/get-student",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetStudentDetailsQuery } = userServiceApis;

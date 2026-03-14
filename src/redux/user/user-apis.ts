/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../api";

export const userServiceApis = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDetails: builder.query<any, void>({
      query: () => ({ url: "/get-student", method: "GET" }),
      providesTags: ["Campaigns"],
    }),

    updateProfile: builder.mutation<any, { studentId: string; formData: FormData }>({
      query: ({ studentId, formData }) => ({
        url: `/profile/${studentId}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Campaigns"],
    }),

    changePassword: builder.mutation<
      any,
      { studentId: string; oldPassword: string; newPassword: string }
    >({
      query: ({ studentId, oldPassword, newPassword }) => ({
        url: `/change-password/${studentId}`,
        method: "PATCH",
        body: { oldPassword, newPassword },
      }),
    }),
  }),
});

export const {
  useGetStudentDetailsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userServiceApis;

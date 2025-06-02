import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { TestDive } from "@/@types/dto/TestDive";
import { TestDiveSearchParams } from "@/@types/RequestHelpers/TestDiveSearchParams";

const testdiveApi = createApi({
  reducerPath: "testdiveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Testdive"],
  endpoints: (builder) => ({
    gettestdiveAll: builder.query<
      { result: TestDive[]; meta: PaginationMeta },
      TestDiveSearchParams
    >({
      query: (params) => ({
        url: "testdives/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<TestDive[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Testdive"],
    }),

    gettestdiveById: builder.query<TestDive, number>({
      query: (testdiveId) => ({
        url: `testdives/getbyid/${testdiveId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<TestDive>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, testdiveId) => [{ type: "Testdive", testdiveId }],
    }),

    createtestdive: builder.mutation<TestDive, FormData>({
      query: (formData) => ({
        url: "testdives/create",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<TestDive>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Testdive"],
    }),

    updatetestdive: builder.mutation<TestDive, { formData: FormData; testdiveId: number }>({
      query: ({ formData, testdiveId }) => ({
        url: `testdives/update/${testdiveId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<TestDive>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: (result, error, { testdiveId }) => [{ type: "Testdive", testdiveId }],
    }),

    deletetestdive: builder.mutation<string, number>({
      query: (id) => ({
        url: `testdives/delete/${id}`,
        method: "PUT",
      }),
      transformResponse: (response: ApiResponse<string>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Testdive"],
    }),
  }),
});

export const {
  useGettestdiveAllQuery,
  useGettestdiveByIdQuery,
  useCreatetestdiveMutation,
  useUpdatetestdiveMutation,
  useDeletetestdiveMutation,
  usePrefetch,
} = testdiveApi;

export default testdiveApi;

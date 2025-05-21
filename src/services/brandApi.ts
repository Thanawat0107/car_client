import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";

const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getbrandAll: builder.query({
      query: (params) => ({
        url: "brands",
        method: "GET",
        params,
      }),
      providesTags: ["Brand"],
    }),

    getbrandById: builder.query({
      query: (brandId) => `brands/${brandId}`,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    createbrand: builder.mutation({
      query: (formData) => ({
        url: "brands",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brand"],
    }),

    updatebrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `brands/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Brand", id }],
    }),

    deletebrand: builder.mutation({
      query: (brandId) => ({
        url: `brands/${brandId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetbrandAllQuery,
  useGetbrandByIdQuery,
  useCreatebrandMutation,
  useUpdatebrandMutation,
  useDeletebrandMutation,
} = brandApi;

export default brandApi
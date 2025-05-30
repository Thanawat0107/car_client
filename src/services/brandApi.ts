import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Brand } from "@/@types/dto/Brand";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { BrandSearchParams } from "@/@types/RequestHelpers/BrandSearchParams";

const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getBrandAll: builder.query<
      { result: Brand[]; meta: PaginationMeta },
      BrandSearchParams
    >({
      query: (params) => ({
        url: "brands/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Brand[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Brand"],
    }),

    getBrandById: builder.query<Brand, number>({
      query: (brandId) => ({
        url: `brands/getbyid/${brandId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Brand>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, brandId) => [{ type: "Brand", brandId }],
    }),

    createBrand: builder.mutation<Brand, FormData>({
      query: (formData) => ({
        url: "brands/create",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<Brand>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation<
      Brand,
      { formData: FormData; brandId: number }
    >({
      query: ({ formData, brandId }) => ({
        url: `brands/update/${brandId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<Brand>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation<string, number>({
      query: (id) => ({
        url: `brands/delete/${id}`,
        method: "PUT",
      }),
      transformResponse: (response: ApiResponse<string>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandAllQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  usePrefetch
} = brandApi;

export default brandApi;

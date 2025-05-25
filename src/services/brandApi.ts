 import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { BrandDto } from "@/@types/dto/BrandDto";
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
      { result: BrandDto[]; meta: PaginationMeta },
      BrandSearchParams
    >({
      query: (params) => ({
        url: "brands/getall",
        method: "GET",
        params,
      }),
      transformResponse: async (response: ApiResponse<BrandDto[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Brand"],
    }),

    getBrandById: builder.query<BrandDto, number>({
      query: (brandId) => ({
        url: `brands/getbyid/${brandId}`,
        method: "GET",
      }),
      transformResponse: async (response: ApiResponse<BrandDto>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, brandId) => [{ type: "Brand", brandId }],
    }),

    createBrand: builder.mutation<BrandDto, FormData>({
      query: (formData) => ({
        url: "brands/create",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<BrandDto>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation<
      BrandDto,
      { formData: FormData; brandId: number }
    >({
      query: ({ formData, brandId }) => ({
        url: `brands/update/${brandId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<BrandDto>) => {
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
} = brandApi;

export default brandApi;

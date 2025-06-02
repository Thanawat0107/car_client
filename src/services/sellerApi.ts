import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Seller } from "@/@types/dto/Seller";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { SellerSearchParams } from "@/@types/RequestHelpers/SellerSearchParams";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { SellerCreateFormValues } from "@/components/pages/sellerPage/SellerFormValues";

const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Seller"],
  endpoints: (builder) => ({
    getSellerAll: builder.query<
      { result: Seller[]; meta: PaginationMeta },
      SellerSearchParams
    >({
      query: (params) => ({
        url: "sellers/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Seller[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Seller"],
    }),

    getSellerById: builder.query<Seller, number>({
      query: (sellerId) => ({
        url: `sellers/getbyid/${sellerId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Seller>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, sellerId) => [{ type: "Seller", sellerId }],
    }),

    createSeller: builder.mutation<Seller, SellerCreateFormValues>({
      query: (body) => ({
        url: "sellers/create",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Seller>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Seller"],
    }),

    updateSeller: builder.mutation<
      Seller,
      { sellerId: number; sellerData: Seller }
    >({
      query: ({ sellerId, sellerData }) => ({
        url: `sellers/update/${sellerId}`,
        method: "PUT",
        body: sellerData,
      }),
      transformResponse: (response: ApiResponse<Seller>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", sellerId },
      ],
    }),

    deleteSeller: builder.mutation<string, number>({
      query: (id) => ({
        url: `sellers/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<string>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Seller"],
    }),
  }),
});

export const {
  useGetSellerAllQuery,
  useGetSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
  usePrefetch,
} = sellerApi;

export default sellerApi;
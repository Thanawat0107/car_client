import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Seller } from "@/@types/Dto/Seller";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { SellerCreateDto, SellerUpdateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";

export const sellerApi = createApi({
  reducerPath: "sellerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Seller"],
  endpoints: (builder) => ({
    getSellerAll: builder.query<
      { result: Seller[]; meta: PaginationMeta },
      { isVerified?: boolean; pageNumber?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "sellers/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Seller[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Seller" as const, id })),
              { type: "Seller", id: "LIST" },
            ]
          : [{ type: "Seller", id: "LIST" }],
    }),

    getSellerById: builder.query<Seller, number>({
      query: (sellerId) => ({
        url: `sellers/getbyid/${sellerId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      transformResponse: unwrapResult<Seller>,
      providesTags: (result, error, sellerId) => [{ type: "Seller", id: sellerId }],
    }),

    getSellerByUserId: builder.query<Seller, string>({
      query: (userId) => ({
        url: `sellers/getbyuserid/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      transformResponse: unwrapResult<Seller>,
      providesTags: (result) =>
        result ? [{ type: "Seller", id: result.id }] : [],
    }),

    createSeller: builder.mutation<Seller, SellerCreateDto>({
      query: (body) => ({
        url: "sellers/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<Seller>,
      invalidatesTags: [{ type: "Seller", id: "LIST" }],
    }),

    updateSeller: builder.mutation<
      Seller,
      { sellerId: number; sellerData: SellerUpdateDto }
    >({
      query: ({ sellerId, sellerData }) => ({
        url: `sellers/update/${sellerId}`,
        method: "PUT",
        body: sellerData,
      }),
      transformResponse: unwrapResult<Seller>,
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", id: sellerId },
        { type: "Seller", id: "LIST" }
      ],
    }),

    deleteSeller: builder.mutation<string, number>({
      query: (id) => ({
        url: `sellers/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, id) => [
        { type: "Seller", id },
        { type: "Seller", id: "LIST" },
      ],
    }),

    verifySeller: builder.mutation<string, { sellerId: number, isVerified: boolean }>({
      query: ({ sellerId, isVerified }) => ({
        url: `sellers/verify/${sellerId}`,
        method: "PUT",
        body: isVerified, 
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, { sellerId }) => [
        { type: "Seller", id: sellerId },
        { type: "Seller", id: "LIST" }
      ],
    }),
  }),
});

export const {
  useGetSellerAllQuery,
  useGetSellerByIdQuery,
  useGetSellerByUserIdQuery,
  useCreateSellerMutation,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
  useVerifySellerMutation,
  usePrefetch,
} = sellerApi;

export default sellerApi;
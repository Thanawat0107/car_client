import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { Review, ReviewCreateDto, ReviewUpdateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
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
  tagTypes: ["Review", "Seller"],
  endpoints: (builder) => ({
    getReviewAll: builder.query<
      { result: Review[]; meta: PaginationMeta },
      { sellerId?: number; pageNumber?: number; pageSize?: number }
    >({
      query: ({ sellerId, pageNumber = 1, pageSize = 10 }) => ({
        url: "reviews/getall",
        method: "GET",
        params: { sellerId, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Review[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Review" as const, id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    getReviewById: builder.query<Review, number>({
      query: (reviewId) => ({
        url: `reviews/getbyid/${reviewId}`,
        method: "GET",
      }),
      transformResponse: unwrapResult<Review>,
      providesTags: (result, error, reviewId) => [{ type: "Review", id: reviewId }],
    }),

    createReview: builder.mutation<Review, ReviewCreateDto>({
      query: (body) => ({
        url: "reviews/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<Review>,
      invalidatesTags: (result, error, arg) => [
        { type: "Review", id: "LIST" },
        { type: "Seller", id: arg.sellerId }
      ],
    }),

    updateReview: builder.mutation<Review, { reviewId: number; updateDto: ReviewUpdateDto }>({
      query: ({ reviewId, updateDto }) => ({
        url: `reviews/update/${reviewId}`,
        method: "PUT",
        body: updateDto,
      }),
      transformResponse: unwrapResult<Review>,
      invalidatesTags: (result, error, { reviewId, updateDto }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
        { type: "Seller", id: "LIST" } 
      ],
    }),

    deleteReview: builder.mutation<string, number>({
      query: (reviewId) => ({
        url: `reviews/delete/${reviewId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, reviewId) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
        { type: "Seller", id: "LIST" } 
      ],
    }),
  }),
});

export const {
  useGetReviewAllQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;

export default reviewsApi;
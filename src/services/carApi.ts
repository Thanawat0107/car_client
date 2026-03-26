import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Car } from "@/@types/Dto/Car";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { unwrapResult, toFormData } from "../utility/apiHelpers";
import type { CarCreateDto, CarUpdateDto } from "@/@types/Dto";

export const carApi = createApi({
  reducerPath: "carApi",
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
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCarAll: builder.query<
      { result: Car[]; meta: PaginationMeta },
      { sellerId?: number; isApproved?: boolean; pageNumber?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "cars/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Car[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Car" as const, id })),
              { type: "Car", id: "LIST" },
            ]
          : [{ type: "Car", id: "LIST" }],
    }),

    getCarById: builder.query<Car, number>({
      query: (carId) => ({
        url: `cars/getbyid/${carId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      transformResponse: unwrapResult<Car>,
      providesTags: (result, error, carId) => [{ type: "Car", id: carId }],
    }),

    createCar: builder.mutation<Car, CarCreateDto>({
      query: (data) => ({
        url: "cars/create",
        method: "POST",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Car>,
      invalidatesTags: [{ type: "Car", id: "LIST" }],
    }),

    updateCar: builder.mutation<Car, { data: CarUpdateDto; carId: number }>({
      query: ({ data, carId }) => ({
        url: `cars/update/${carId}`,
        method: "PUT",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Car>,
      invalidatesTags: (result, error, { carId }) => [
        { type: "Car", id: carId },
        { type: "Car", id: "LIST" }
      ],
    }),

    deleteCar: builder.mutation<string, number>({
      query: (id) => ({
        url: `cars/delete/${id}`,
        method: "PUT",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, id) => [
        { type: "Car", id },
        { type: "Car", id: "LIST" },
      ],
    }),

    approveCar: builder.mutation<string, { carId: number; isApproved: boolean; remark?: string }>({
      query: (body) => ({
        url: "cars/ApproveCar",
        method: "PUT",
        body: {
          carId: body.carId,
          isApproved: body.isApproved,
          remark: body.remark || "",
        },
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, { carId }) => [
        { type: "Car", id: carId },
        { type: "Car", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCarAllQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useApproveCarMutation,
  usePrefetch,
} = carApi;

export default carApi;
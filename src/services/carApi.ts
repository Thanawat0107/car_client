import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Car } from "@/@types/dto/Car";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";

const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Car"],
  endpoints: (builder) => ({
    getCarAll: builder.query<
      { result: Car[]; meta: PaginationMeta },
      CarSearchParams
    >({
      query: (params) => ({
        url: "cars/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Car[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Car"],
    }),

    getCarById: builder.query<Car, number>({
      query: (carId) => ({
        url: `cars/getbyid/${carId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, // cache นานขึ้น 5 นาที
      transformResponse: async (response: ApiResponse<Car>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, carId) => [{ type: "Car", carId }],
    }),

    createCar: builder.mutation<Car, FormData>({
      query: (formData) => ({
        url: "cars/create",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<Car>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Car"],
    }),

    updateCar: builder.mutation<Car, { formData: FormData; carId: number }>({
      query: ({ formData, carId }) => ({
        url: `cars/update/${carId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<Car>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: (result, error, { carId }) => [{ type: "Car", carId }],
    }),

    deleteCar: builder.mutation<string, number>({
      query: (id) => ({
        url: `cars/delete/${id}`,
        method: "PUT",
      }),
      transformResponse: (response: ApiResponse<string>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Car"],
    }),
  }),
});

export const {
  useGetCarAllQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  usePrefetch,
} = carApi;

export default carApi;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { CarDto } from "@/types/dto/CarDto";
import { CarSearchParams } from "@/types/RequestHelpers/CarSearchParams";
import { PaginationMeta } from "@/types/Responsts/PaginationMeta";
import { ApiResponse } from "@/types/Responsts/ApiResponse";
import { CarCreateDto } from "@/types/dto/create-dto/CarCreateDto";

const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  tagTypes: ["Car"],
  endpoints: (builder) => ({

    getCarAll: builder.query<
      { result: CarDto[]; meta: PaginationMeta },
      CarSearchParams
    >({
      query: (params) => ({
        url: "cars",
        method: "GET",
        params,
      }),
      transformResponse: async (response: ApiResponse<CarDto[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: ["Car"],
    }),

    getCarById: builder.query<CarDto, number>({
      query: (carId) => ({
        url: `cars/${carId}`,
        method: "GET",
      }),
      transformResponse: async (response: ApiResponse<CarDto>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      providesTags: (result, error, carId) => [{ type: "Car", carId }],
    }),

    createCar: builder.mutation<CarCreateDto, FormData>({
      query: (formData) => ({
        url: "cars",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<CarCreateDto>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: ["Car"],
    }),

    updateCar: builder.mutation<
      CarCreateDto,
      { carId: number; formData: FormData }
    >({
      query: ({ carId, formData }) => ({
        url: `cars/${carId}`,
        method: "PUT",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<CarCreateDto>) => {
        if (response.result) return response.result;
        throw new Error(response.message);
      },
      invalidatesTags: (result, error, { carId }) => [{ type: "Car", carId }],
    }),

    deleteCar: builder.mutation<string, number>({
      query: (id) => ({
        url: `cars/${id}`,
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
} = carApi;

export default carApi;

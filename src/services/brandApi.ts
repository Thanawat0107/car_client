import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { Brand } from "@/@types/Dto/Brand";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { unwrapResult, toFormData } from "../utility/apiHelpers";
import type { BrandCreateDto, BrandUpdateDto } from "@/@types/Dto";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
    // 🌟 1. แนบ Token ทุกครั้งที่เรียก API เพื่อความปลอดภัย (เผื่ออนาคตล็อคสิทธิ์แอดมิน)
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getBrandAll: builder.query<
      { result: Brand[]; meta: PaginationMeta },
      { pageNumber?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "brands/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, 
      transformResponse: async (response: ApiResponse<Brand[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      // 🌟 2. กระจาย Tag ตาม ID ของแบรนด์ และใส่ Tag ก้อนใหญ่ชื่อ "LIST"
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Brand" as const, id })),
              { type: "Brand", id: "LIST" },
            ]
          : [{ type: "Brand", id: "LIST" }],
    }),

    getBrandById: builder.query<Brand, number>({
      query: (brandId) => ({
        url: `brands/getbyid/${brandId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, 
      transformResponse: unwrapResult<Brand>,
      // 🌟 ใช้คีย์ 'id' ให้เป็นมาตรฐาน
      providesTags: (result, error, brandId) => [{ type: "Brand", id: brandId }],
    }),

    createBrand: builder.mutation<Brand, BrandCreateDto>({
      query: (data) => ({
        url: "brands/create",
        method: "POST",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Brand>,
      // 🌟 สร้างแบรนด์ใหม่ ให้เคลียร์แค่หน้า LIST เพื่อให้ตารางแบรนด์โหลดข้อมูลใหม่
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),

    updateBrand: builder.mutation<
      Brand,
      { data: BrandUpdateDto; brandId: number }
    >({
      query: ({ data, brandId }) => ({
        url: `brands/update/${brandId}`,
        method: "PUT",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Brand>,
      // 🌟 อัปเดตแบรนด์ ให้เคลียร์ข้อมูลแบรนด์นั้น และเคลียร์ LIST ด้วย (เพราะชื่อหรือรูปโลโก้อาจจะเปลี่ยน)
      invalidatesTags: (result, error, { brandId }) => [
        { type: "Brand", id: brandId },
        { type: "Brand", id: "LIST" }
      ],
    }),

    deleteBrand: builder.mutation<string, number>({
      query: (id) => ({
        url: `brands/delete/${id}`,
        method: "PUT", // 🌟 ใช้ PUT ถูกต้องแล้วตามที่ Backend ออกแบบ (Soft Delete)
      }),
      transformResponse: unwrapResult<string>,
      // 🌟 ลบแบรนด์ ให้เคลียร์แบรนด์นั้นออก และรีเฟรชหน้า LIST
      invalidatesTags: (result, error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
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
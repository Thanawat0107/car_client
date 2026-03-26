import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { CarMaintenance, CarMaintenanceCreateDto, CarMaintenanceUpdateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";

export const carMaintenancesApi = createApi({
  reducerPath: "carMaintenancesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
    // 🌟 1. แนบ Token เพื่อความปลอดภัย (ข้อมูลซ่อมบำรุงมักจะเป็นของ Seller หรือ Admin ที่ต้องล็อกอิน)
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // 🌟 2. เพิ่ม "Car" เข้ามาใน tagTypes เพื่อทำ Cross-Tag Invalidation
  tagTypes: ["CarMaintenance", "Car"],
  endpoints: (builder) => ({
    getCarMaintenanceAll: builder.query<
      { result: CarMaintenance[]; meta: PaginationMeta },
      { carId?: number; pageNumber?: number; pageSize?: number }
    >({
      query: ({ carId, pageNumber = 1, pageSize = 10 }) => ({
        url: "carMaintenances/getall",
        method: "GET",
        params: { carId, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<CarMaintenance[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      // 🌟 3. กระจาย Tag แยกตาม ID ของรายการซ่อมบำรุง
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "CarMaintenance" as const, id })),
              { type: "CarMaintenance", id: "LIST" },
            ]
          : [{ type: "CarMaintenance", id: "LIST" }],
    }),

    createCarMaintenance: builder.mutation<CarMaintenance, CarMaintenanceCreateDto>({
      query: (body) => ({
        url: "carMaintenances/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<CarMaintenance>,
      // 🌟 เพิ่มประวัติซ่อมสำเร็จ -> รีเฟรชตารางซ่อม (LIST) และสั่งรีเฟรชข้อมูลรถคันนั้นด้วย
      invalidatesTags: (result, error, arg) => [
        { type: "CarMaintenance", id: "LIST" },
        { type: "Car", id: arg.carId } // รีเฟรชหน้ารายละเอียดรถที่มี ID ตรงกับคันที่เพิ่งซ่อม
      ],
    }),

    updateCarMaintenance: builder.mutation<
      CarMaintenance,
      { carMaintenanceId: number; data: CarMaintenanceUpdateDto }
    >({
      query: ({ carMaintenanceId, data }) => ({
        url: `carMaintenances/update/${carMaintenanceId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: unwrapResult<CarMaintenance>,
      // 🌟 แก้ไขสำเร็จ -> รีเฟรชเฉพาะรายการที่แก้, ตารางรวม, และข้อมูลรถคันนั้น
      invalidatesTags: (result, error, { carMaintenanceId, data }) => [
        { type: "CarMaintenance", id: carMaintenanceId },
        { type: "CarMaintenance", id: "LIST" },
        { type: "Car", id: data.carId } 
      ],
    }),

    deleteCarMaintenance: builder.mutation<string, number>({
      query: (carMaintenanceId) => ({
        url: `carMaintenances/delete/${carMaintenanceId}`,
        method: "PUT",
      }),
      transformResponse: unwrapResult<string>,
      // 🌟 ลบสำเร็จ -> รีเฟรชเฉพาะตารางรวมและรายการที่ถูกลบ
      invalidatesTags: (result, error, carMaintenanceId) => [
        { type: "CarMaintenance", id: carMaintenanceId },
        { type: "CarMaintenance", id: "LIST" },
        { type: "Car", id: "LIST" } // สั่งรีเฟรชตารางรถรวมเผื่อหน้าเว็บนับจำนวนครั้งที่ซ่อม
      ],
    }),
  }),
});

export const {
  useGetCarMaintenanceAllQuery,
  useCreateCarMaintenanceMutation,
  useUpdateCarMaintenanceMutation,
  useDeleteCarMaintenanceMutation,
} = carMaintenancesApi;

export default carMaintenancesApi;
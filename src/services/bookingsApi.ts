import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { Booking, BookingCreateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";
import signalrService from "../services/signalrService";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
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
  tagTypes: ["Booking", "Car"],
  endpoints: (builder) => ({
    getBookingAll: builder.query<
      { result: Booking[]; meta: PaginationMeta },
      { userId?: string; sellerId?: number; pageNumber?: number; pageSize?: number }
    >({
      query: ({ userId, sellerId, pageNumber = 1, pageSize = 10 }) => ({
        url: "bookings/getall",
        method: "GET",
        params: { userId, sellerId, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Booking[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Booking" as const, id })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],

      // =========================================================
      // 🌟 2. พลังแห่ง RTK Query + SignalR (ฉบับดักฟัง Global)
      // =========================================================
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch } // ดึง dispatch มาใช้ได้ด้วย!
      ) {
        try {
          // รอให้ดึงข้อมูลรายการจองรอบแรกเสร็จก่อน
          await cacheDataLoaded;

          // ดึง Connection ที่เชื่อมต่อไว้แล้วจาก SignalRProvider มาใช้
          const connection = signalrService.notificationConnection;

          if (connection) {
            // 🎯 กรณี 1: มีแจ้งเตือนเข้ามา (เช่น เตือนร้านค้าว่ามีคนจอง, เตือนลูกค้าว่าสลิปผ่าน)
            const handleNotification = (notification: any) => {
              // ถ้าแจ้งเตือนนั้นเกี่ยวข้องกับการจอง (มี BookingId แนบมาด้วยจาก Backend)
              if (notification.bookingId) {
                console.log("🔄 กำลังรีเฟรชรายการจองอัตโนมัติ...");
                // 🌟 ท่าไม้ตาย! สั่ง Invalidate Cache แบบเจาะจง ให้ RTK ไปโหลดข้อมูลหลังบ้านมาใหม่ทันที
                dispatch(bookingsApi.util.invalidateTags([{ type: "Booking", id: "LIST" }]));
              }
            };

            // 🎯 กรณี 2: มีคนกดจองรถคันที่เราดูอยู่ (สถานะรถเปลี่ยน)
            const handleCarStatusChanged = (data: { carId: number, newStatus: string }) => {
              updateCachedData((draft) => {
                // วนลูปดูว่าในรายการจองที่เราเปิดดูอยู่ มีรถคันที่สถานะเปลี่ยนไหม
                draft.result.forEach((booking) => {
                  if (booking.carId === data.carId && booking.car) {
                    booking.car.carStatus = data.newStatus; // แอบเปลี่ยนสถานะรถในหน้าจอทันที
                  }
                });
              });
            };

            // 📌 นำฟังก์ชันไปผูก (Listen) กับ SignalR
            connection.on("ReceiveNotification", handleNotification);
            connection.on("CarStatusChanged", handleCarStatusChanged);

            // รอจนกว่าผู้ใช้จะออกจากหน้านี้ (Unmount)
            await cacheEntryRemoved;

            // 🧹 Cleanup: ถอด Listener ออก เพื่อไม่ให้มันทำงานซ้ำซ้อนเวลาเปิดหน้าเว็บใหม่
            connection.off("ReceiveNotification", handleNotification);
            connection.off("CarStatusChanged", handleCarStatusChanged);
          }
        } catch (err) {
          console.error("SignalR Booking Error:", err);
        }
      },
      // =========================================================
    }),

    getBookingById: builder.query<Booking, number>({
      query: (bookingId) => ({
        url: `bookings/getbyid/${bookingId}`,
        method: "GET",
      }),
      transformResponse: unwrapResult<Booking>,
      providesTags: (result, error, bookingId) => [{ type: "Booking", id: bookingId }],
    }),

    createBooking: builder.mutation<Booking, BookingCreateDto>({
      query: (body) => ({
        url: "bookings/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<Booking>,
      invalidatesTags: (result, error, arg) => [
        { type: "Booking", id: "LIST" },
        { type: "Car", id: arg.carId } 
      ],
    }),

    cancelBooking: builder.mutation<string, number>({
      query: (bookingId) => ({
        url: `bookings/cancel/${bookingId}`,
        method: "PUT",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, bookingId) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "LIST" },
        { type: "Car", id: "LIST" } 
      ],
    }),

    deleteBooking: builder.mutation<string, number>({
      query: (bookingId) => ({
        url: `bookings/delete/${bookingId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, bookingId) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBookingAllQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;

export default bookingsApi;
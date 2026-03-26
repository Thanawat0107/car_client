import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { Payment, PaymentCreateDto, PaymentUpdateDto } from "@/@types/Dto";
import { unwrapResult, toFormData } from "../utility/apiHelpers";
import signalrService from "../services/signalrService"; // 🌟 1. นำเข้า Service

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
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
  tagTypes: ["Payment", "Booking"],
  endpoints: (builder) => ({
    getPaymentAll: builder.query<
      { result: Payment[]; meta: PaginationMeta },
      { userId?: string; sellerId?: number; pageNumber?: number; pageSize?: number }
    >({
      query: ({ userId, sellerId, pageNumber = 1, pageSize = 10 }) => ({
        url: "payments/getall",
        method: "GET",
        params: { userId, sellerId, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Payment[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Payment" as const, id })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],

      // =========================================================
      // 🌟 2. ดักฟัง SignalR เพื่อรีเฟรชหน้าตารางชำระเงินอัตโนมัติ
      // =========================================================
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        try {
          await cacheDataLoaded;
          const connection = signalrService.notificationConnection;

          if (connection) {
            const handleNotification = (notification: any) => {
              // ถ้าแจ้งเตือนนั้นเป็นเรื่องเกี่ยวกับการจอง/ชำระเงิน (มี BookingId แนบมา)
              const bookingId = notification.bookingId || notification.BookingId;
              
              if (bookingId) {
                console.log("🔄 พบการเคลื่อนไหวของสลิป! กำลังรีเฟรชตารางชำระเงิน...");
                // เตะ Cache ของ Payment เพื่อดึงข้อมูลสถานะสลิปล่าสุดมาโชว์ทันที
                dispatch(paymentsApi.util.invalidateTags([{ type: "Payment", id: "LIST" }]));
              }
            };

            connection.on("ReceiveNotification", handleNotification);
            await cacheEntryRemoved;
            connection.off("ReceiveNotification", handleNotification);
          }
        } catch (err) {
          console.error("SignalR Payment Error:", err);
        }
      },
      // =========================================================
    }),

    getPaymentById: builder.query<Payment, number>({
      query: (paymentId) => ({
        url: `payments/getbyid/${paymentId}`,
        method: "GET",
      }),
      transformResponse: unwrapResult<Payment>,
      providesTags: (result, error, paymentId) => [{ type: "Payment", id: paymentId }],
    }),

    createPayment: builder.mutation<Payment, PaymentCreateDto>({
      query: (data) => ({
        url: "payments/create",
        method: "POST",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Payment>,
      invalidatesTags: (result, error, arg) => [
        { type: "Payment", id: "LIST" },
        { type: "Booking", id: arg.bookingId } 
      ],
    }),

    confirmPayment: builder.mutation<string, number>({
      query: (paymentId) => ({
        url: `payments/confirm/${paymentId}`,
        method: "POST",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, paymentId) => [
        { type: "Payment", id: paymentId },
        { type: "Payment", id: "LIST" },
        { type: "Booking", id: "LIST" } 
      ],
    }),

    updatePayment: builder.mutation<Payment, { paymentId: number; data: PaymentUpdateDto }>({
      query: ({ paymentId, data }) => ({
        url: `payments/update/${paymentId}`,
        method: "PUT",
        body: toFormData(data),
      }),
      transformResponse: unwrapResult<Payment>,
      invalidatesTags: (result, error, { paymentId }) => [
        { type: "Payment", id: paymentId },
        { type: "Payment", id: "LIST" },
        { type: "Booking", id: "LIST" }
      ],
    }),
  }),
});

export const {
  useGetPaymentAllQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useConfirmPaymentMutation,
  useUpdatePaymentMutation,
} = paymentsApi;

export default paymentsApi;
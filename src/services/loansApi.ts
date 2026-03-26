import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { Loan, LoanCreateDto, LoanUpdateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";
import signalrService from "../services/signalrService";

export const loansApi = createApi({
  reducerPath: "loansApi",
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
  tagTypes: ["Loan"],
  endpoints: (builder) => ({
    getLoanAll: builder.query<
      { result: Loan[]; meta: PaginationMeta },
      { carId?: number; userId?: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ carId, userId, pageNumber = 1, pageSize = 10 }) => ({
        url: "loans/getall",
        method: "GET",
        params: { carId, userId, pageNumber, pageSize },
      }),
      keepUnusedDataFor: 300,
      transformResponse: async (response: ApiResponse<Loan[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "Loan" as const, id })),
              { type: "Loan", id: "LIST" },
            ]
          : [{ type: "Loan", id: "LIST" }],

      // =========================================================
      // 🌟 2. ดักฟังแจ้งเตือนจาก SignalR เพื่ออัปเดตตารางสินเชื่อแบบ Real-time
      // =========================================================
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, cacheEntryRemoved, dispatch } // ดึง dispatch มาใช้สั่ง Invalidate
      ) {
        try {
          // รอให้โหลดข้อมูลรอบแรกเสร็จก่อน
          await cacheDataLoaded;

          // ดึง Connection จาก Global Notification Hub
          const connection = signalrService.notificationConnection;

          if (connection) {
            // 🎯 ฟังก์ชันดักจับแจ้งเตือน
            const handleNotification = (notification: any) => {
              // เช็คว่าแจ้งเตือนที่ส่งมา มี Property ชื่อ loanId แนบมาด้วยหรือไม่ 
              // (รองรับทั้งตัวพิมพ์เล็กและใหญ่ เผื่อ Backend ส่งมาแบบ PascalCase หรือ camelCase)
              const loanId = notification.loanId || notification.LoanId;

              if (loanId) {
                console.log("🔄 มีการอัปเดตสินเชื่อ! กำลังรีเฟรชตารางอัตโนมัติ...");
                // สั่งเตะ Cache ให้ RTK Query ไปดึงข้อมูลใหม่จากฐานข้อมูลทันที
                dispatch(loansApi.util.invalidateTags([{ type: "Loan", id: "LIST" }]));
              }
            };

            // 📌 นำฟังก์ชันไปผูก (Listen) กับ SignalR Event
            connection.on("ReceiveNotification", handleNotification);

            // รอจนกว่าผู้ใช้จะเปลี่ยนหน้า (Component Unmount)
            await cacheEntryRemoved;

            // 🧹 Cleanup: ถอด Listener ออกเพื่อป้องกันการทำงานซ้ำซ้อน
            connection.off("ReceiveNotification", handleNotification);
          }
        } catch (err) {
          console.error("SignalR Loan Error:", err);
        }
      },
      // =========================================================
    }),

    getLoanById: builder.query<Loan, number>({
      query: (loanId) => ({
        url: `loans/getbyid/${loanId}`,
        method: "GET",
      }),
      transformResponse: unwrapResult<Loan>,
      providesTags: (result, error, loanId) => [{ type: "Loan", id: loanId }],
    }),

    createLoan: builder.mutation<Loan, LoanCreateDto>({
      query: (body) => ({
        url: "loans/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<Loan>,
      invalidatesTags: [{ type: "Loan", id: "LIST" }],
    }),

    updateLoanStatus: builder.mutation<Loan, { loanId: number; updateDto: LoanUpdateDto }>({
      query: ({ loanId, updateDto }) => ({
        url: `loans/update-status/${loanId}`,
        method: "PUT",
        body: updateDto,
      }),
      transformResponse: unwrapResult<Loan>,
      invalidatesTags: (result, error, { loanId }) => [
        { type: "Loan", id: loanId },
        { type: "Loan", id: "LIST" }
      ],
    }),

    deleteLoan: builder.mutation<string, number>({
      query: (loanId) => ({
        url: `loans/delete/${loanId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, loanId) => [
        { type: "Loan", id: loanId },
        { type: "Loan", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLoanAllQuery,
  useGetLoanByIdQuery,
  useCreateLoanMutation,
  useUpdateLoanStatusMutation,
  useDeleteLoanMutation,
} = loansApi;

export default loansApi;
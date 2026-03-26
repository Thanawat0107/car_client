import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { TestDrive, TestDriveCreateDto, TestDriveUpdateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";
import signalrService from "../services/signalrService";

export const testDriveApi = createApi({
  reducerPath: "testDriveApi",
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
  tagTypes: ["TestDrive"],
  endpoints: (builder) => ({
    getTestDriveAll: builder.query<
      { result: TestDrive[]; meta: PaginationMeta },
      { userId?: string; sellerId?: number; pageNumber?: number; pageSize?: number }
    >({
      query: (params) => ({
        url: "testdrives/getall",
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 300, 
      transformResponse: async (response: ApiResponse<TestDrive[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "TestDrive" as const, id })),
              { type: "TestDrive", id: "LIST" },
            ]
          : [{ type: "TestDrive", id: "LIST" }],

      // =========================================================
      // 🌟 2. ดักฟัง SignalR เพื่อรีเฟรชตารางนัดหมายอัตโนมัติ
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
              // เช็คว่าแจ้งเตือนที่ส่งมาเกี่ยวข้องกับคิวทดลองขับหรือไม่
              const testDriveId = notification.testDriveId || notification.TestDriveId;

              if (testDriveId) {
                console.log("🔄 พบการอัปเดตคิวทดลองขับ! กำลังรีเฟรชตาราง...");
                // เตะ Cache เพื่อให้โหลดข้อมูลใหม่ทันที
                dispatch(testDriveApi.util.invalidateTags([{ type: "TestDrive", id: "LIST" }]));
              }
            };

            connection.on("ReceiveNotification", handleNotification);
            await cacheEntryRemoved;
            connection.off("ReceiveNotification", handleNotification);
          }
        } catch (err) {
          console.error("SignalR TestDrive Error:", err);
        }
      },
      // =========================================================
    }),

    getTestDriveById: builder.query<TestDrive, number>({
      query: (testDriveId) => ({
        url: `testdrives/getbyid/${testDriveId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 300, 
      transformResponse: unwrapResult<TestDrive>,
      providesTags: (result, error, testDriveId) => [{ type: "TestDrive", id: testDriveId }],
    }),

    createTestDrive: builder.mutation<TestDrive, TestDriveCreateDto>({
      query: (body) => ({
        url: "testdrives/create",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<TestDrive>,
      invalidatesTags: [{ type: "TestDrive", id: "LIST" }],
    }),

    updateTestDrive: builder.mutation<TestDrive, { data: TestDriveUpdateDto; testDriveId: number }>({
      query: ({ data, testDriveId }) => ({
        url: `testdrives/update/${testDriveId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: unwrapResult<TestDrive>,
      invalidatesTags: (result, error, { testDriveId }) => [
        { type: "TestDrive", id: testDriveId },
        { type: "TestDrive", id: "LIST" }
      ],
    }),

    deleteTestDrive: builder.mutation<string, number>({
      query: (id) => ({
        url: `testdrives/delete/${id}`,
        method: "DELETE", 
      }),
      transformResponse: unwrapResult<string>,
      invalidatesTags: (result, error, id) => [
        { type: "TestDrive", id },
        { type: "TestDrive", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTestDriveAllQuery,
  useGetTestDriveByIdQuery,
  useCreateTestDriveMutation,
  useUpdateTestDriveMutation,
  useDeleteTestDriveMutation,
  usePrefetch,
} = testDriveApi;

export default testDriveApi;
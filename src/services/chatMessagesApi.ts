import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../utility/SD";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { PaginationMeta } from "@/@types/Responsts/PaginationMeta";
import { ChatMessage, ChatMessageCreateDto } from "@/@types/Dto";
import { unwrapResult } from "../utility/apiHelpers";
import signalrService from "../services/signalrService";

export const chatMessagesApi = createApi({
  reducerPath: "chatMessagesApi",
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
  tagTypes: ["ChatMessage"],
  endpoints: (builder) => ({
    getChatMessageAll: builder.query<
      { result: ChatMessage[]; meta: PaginationMeta },
      { userId1: string; userId2: string; pageNumber?: number; pageSize?: number }
    >({
      query: ({ userId1, userId2, pageNumber = 1, pageSize = 50 }) => ({
        url: "chatMessages/getall",
        method: "GET",
        params: { userId1, userId2, pageNumber, pageSize },
      }),
      transformResponse: async (response: ApiResponse<ChatMessage[]>) => ({
        result: response.result ?? [],
        meta: response.meta as PaginationMeta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.result.map(({ id }) => ({ type: "ChatMessage" as const, id })),
              { type: "ChatMessage", id: "LIST" },
            ]
          : [{ type: "ChatMessage", id: "LIST" }],

      // =========================================================
      // 🌟 2. เริ่มเปิดใช้งาน SignalR ควบคู่กับ RTK Query Cache
      // =========================================================
      async onCacheEntryAdded(
        arg, // arg จะมีค่า userId1 และ userId2 ที่เราส่งเข้ามาตอนเรียก Query
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          // รอให้โหลดประวัติแชทเก่าจาก API (REST) เสร็จก่อน
          await cacheDataLoaded;

          // สมมติว่า userId1 คือ ID ของเรา (คนที่กำลังล็อกอินและเปิดหน้านี้อยู่)
          const currentUserId = arg.userId1;

          // สั่งเชื่อมต่อ SignalR
          await signalrService.startChatHub(currentUserId, {
            
            // 🎯 กรณี 1: มีแชทใหม่เด้งเข้ามา
            onReceiveNewMessage: (newMessage: ChatMessage) => {
              updateCachedData((draft) => {
                // 🛡️ เช็คความปลอดภัย: ข้อความใหม่นี้ เป็นของคนที่เรากำลังคุยด้วย (userId2) หรือเปล่า?
                const isRelevantMessage = 
                  (newMessage.senderId === arg.userId1 && newMessage.receiverId === arg.userId2) ||
                  (newMessage.senderId === arg.userId2 && newMessage.receiverId === arg.userId1);

                if (isRelevantMessage) {
                  // ถ่ายเทข้อมูลใหม่ไปต่อท้าย Array เดิมใน Cache
                  draft.result.push(newMessage);
                }
              });
            },

            // 🎯 กรณี 2: อีกฝั่งกดอ่านข้อความแล้ว
            onMessageRead: (messageId: number) => {
              updateCachedData((draft) => {
                // ค้นหาข้อความใน Cache ด้วย ID
                const msg = draft.result.find((m) => m.id === messageId);
                if (msg) {
                  msg.isRead = true; // อัปเดตสถานะให้อ่านแล้ว (UI จะเปลี่ยนตามทันที)
                }
              });
            },

            // 🎯 กรณี 3: อีกฝั่งกดยกเลิก/ลบข้อความ
            onMessageDeleted: (messageId: number) => {
              updateCachedData((draft) => {
                // กรองเอาข้อความที่โดนลบ ออกจาก Cache
                draft.result = draft.result.filter((m) => m.id !== messageId);
              });
            },
          });
        } catch (error) {
          console.error("SignalR in RTK Query Error:", error);
        }

        // 🌟 3. Cleanup: เมื่อเราเปลี่ยนหน้าเว็บ หรือออกจากหน้าแชท (Cache ตัวนี้ถูกทำลาย)
        await cacheEntryRemoved;
        signalrService.stopChatHub(); // สั่งปิด SignalR ของแชท เพื่อคืนทรัพยากรให้เซิร์ฟเวอร์
      },
      // =========================================================
    }),

    sendChatMessage: builder.mutation<ChatMessage, ChatMessageCreateDto>({
      query: (body) => ({
        url: "chatMessages/send",
        method: "POST",
        body,
      }),
      transformResponse: unwrapResult<ChatMessage>,
    }),

    markChatMessageAsRead: builder.mutation<string, number>({
      query: (messageId) => ({
        url: `chatMessages/markasread/${messageId}`,
        method: "PUT",
      }),
      transformResponse: unwrapResult<string>,
    }),

    deleteChatMessage: builder.mutation<string, number>({
      query: (messageId) => ({
        url: `chatMessages/delete/${messageId}`,
        method: "DELETE",
      }),
      transformResponse: unwrapResult<string>,
    }),
  }),
});

export const {
  useGetChatMessageAllQuery,
  useSendChatMessageMutation,
  useMarkChatMessageAsReadMutation,
  useDeleteChatMessageMutation,
} = chatMessagesApi;

export default chatMessagesApi;
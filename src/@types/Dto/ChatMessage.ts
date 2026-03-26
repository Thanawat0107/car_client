export interface ChatMessage {
  id: number;
  senderId?: string;
  receiverId?: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
}

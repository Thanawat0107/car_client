import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import { baseUrl } from '@/utility/SD';

const API_BASE_URL = baseUrl;

// 🌟 1. สร้าง Interface เพื่อกำหนดโครงสร้างของ Callback Functions
export interface NotificationCallbacks {
    onReceiveNotification?: (notification: any) => void; // เปลี่ยน any เป็น Type ของ Notification ได้ถ้ามี
    onCarStatusChanged?: (data: { carId: number, newStatus: string }) => void;
}

export interface ChatCallbacks {
    onReceiveNewMessage?: (message: any) => void; // เปลี่ยน any เป็น ChatMessageDto ได้ถ้ามี
    onMessageRead?: (messageId: number) => void;
    onMessageDeleted?: (messageId: number) => void;
}

class SignalRService {
    public notificationConnection: HubConnection | null;
    public chatConnection: HubConnection | null;

    constructor() {
        this.notificationConnection = null;
        this.chatConnection = null;
    }

    // ==========================================
    // 1. ระบบแจ้งเตือน (Notification Hub)
    // ==========================================
    public async startNotificationHub(userId?: string | null, callbacks?: NotificationCallbacks): Promise<void> {
        if (this.notificationConnection) return;

        try {
            const token = localStorage.getItem('token');

            this.notificationConnection = new HubConnectionBuilder()
                .withUrl(`${API_BASE_URL}/notificationHub`, {
                    accessTokenFactory: () => token || '',
                    withCredentials: true,
                    transport: 2 // Auto negotiate connection
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect([0, 0, 0, 5000, 10000, 30000])
                .build();

            this.notificationConnection.on("ReceiveNotification", (notification: any) => {
                if (callbacks?.onReceiveNotification) callbacks.onReceiveNotification(notification);
            });

            this.notificationConnection.on("CarStatusChanged", (data: { carId: number, newStatus: string }) => {
                if (callbacks?.onCarStatusChanged) callbacks.onCarStatusChanged(data);
            });

            this.notificationConnection.onreconnecting(() => {
                console.log("🟡 Notification Hub Reconnecting...");
            });

            this.notificationConnection.onreconnected(() => {
                console.log("🟢 Notification Hub Reconnected");
                if (userId) {
                    this.notificationConnection?.invoke("JoinNotificationRoom", userId).catch(err =>
                        console.error("❌ Error joining notification room:", err)
                    );
                }
            });

            this.notificationConnection.onclose(() => {
                console.log("🔴 Notification Hub Disconnected");
                this.notificationConnection = null;
            });

            await this.notificationConnection.start();
            console.log("🟢 Notification Hub Connected Successfully");

            if (userId) {
                await this.notificationConnection.invoke("JoinNotificationRoom", userId);
                console.log(`✅ Joined notification room for user: ${userId}`);
            }
        } catch (err) {
            console.error("🔴 Error connecting to Notification Hub:", err);
            this.notificationConnection = null;
        }
    }

    public stopNotificationHub(): void {
        if (this.notificationConnection) {
            this.notificationConnection.stop();
            this.notificationConnection = null;
        }
    }

    // ==========================================
    // 2. ระบบแชท (Chat Hub)
    // ==========================================
    public async startChatHub(userId?: string | null, callbacks?: ChatCallbacks): Promise<void> {
        if (this.chatConnection) return;

        try {
            const token = localStorage.getItem('token');

            this.chatConnection = new HubConnectionBuilder()
                .withUrl(`${API_BASE_URL}/chatHub`, {
                    accessTokenFactory: () => token || '',
                    withCredentials: true,
                    transport: 2 // Auto negotiate connection
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect([0, 0, 0, 5000, 10000, 30000])
                .build();

            this.chatConnection.on("ReceiveNewMessage", (message: any) => {
                if (callbacks?.onReceiveNewMessage) callbacks.onReceiveNewMessage(message);
            });

            this.chatConnection.on("MessageRead", (messageId: number) => {
                if (callbacks?.onMessageRead) callbacks.onMessageRead(messageId);
            });

            this.chatConnection.on("MessageDeleted", (messageId: number) => {
                if (callbacks?.onMessageDeleted) callbacks.onMessageDeleted(messageId);
            });

            this.chatConnection.onreconnecting(() => {
                console.log("🟡 Chat Hub Reconnecting...");
            });

            this.chatConnection.onreconnected(() => {
                console.log("🟢 Chat Hub Reconnected");
                if (userId) {
                    this.chatConnection?.invoke("JoinPersonalRoom", userId).catch(err =>
                        console.error("❌ Error joining chat room:", err)
                    );
                }
            });

            this.chatConnection.onclose(() => {
                console.log("🔴 Chat Hub Disconnected");
                this.chatConnection = null;
            });

            await this.chatConnection.start();
            console.log("🟢 Chat Hub Connected Successfully");

            if (userId) {
                await this.chatConnection.invoke("JoinPersonalRoom", userId);
                console.log(`✅ Joined personal room for user: ${userId}`);
            }
        } catch (err) {
            console.error("🔴 Error connecting to Chat Hub:", err);
            this.chatConnection = null;
        }
    }

    public stopChatHub(): void {
        if (this.chatConnection) {
            this.chatConnection.stop();
            this.chatConnection = null;
        }
    }
}

const signalrService = new SignalRService();
export default signalrService;
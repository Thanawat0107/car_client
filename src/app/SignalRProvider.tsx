"use client";

import React, { useEffect, useState } from 'react';
import signalrService from '@/services/signalrService'; // ปรับ path ให้ตรงกับของคุณ

export default function SignalRProvider({ children }: { children: React.ReactNode }) {
    
    useEffect(() => {
        // 1. ดึง Token หรือ UserId ของคนที่ล็อกอินอยู่
        // (ปกติคุณอาจจะดึงจาก AuthContext หรือ LocalStorage ก็ได้ครับ)
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // สมมติว่าเก็บ userId ไว้ด้วย

        // 2. ถ้าล็อกอินอยู่ ให้เริ่มเชื่อมต่อ Notification Hub
        if (token && userId) {
            signalrService.startNotificationHub(userId, {
                onReceiveNotification: (notification) => {
                    // 🌟 จัดการเมื่อมีแจ้งเตือนเด้งเข้ามา
                    console.log("🔔 แจ้งเตือน Global:", notification);
                    // แนะนำให้เรียกใช้ไลบรารี Toast ตรงนี้เลยครับ เช่น:
                    // toast.info(notification.message);
                },
                onCarStatusChanged: (data) => {
                    console.log("🚗 สถานะรถเปลี่ยน Global:", data);
                }
            });
        }

        // 3. Cleanup ตอนผู้ใช้ปิดเว็บ หรือ Logout
        return () => {
            signalrService.stopNotificationHub();
        };
    }, []); // ทำงานครั้งเดียวตอนโหลดแอป

    return (
        <>
            {children}
        </>
    );
}
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { stripePromise } from "@/app/StripeProvider";
import { baseUrlAPI } from "@/utility/SD";
import Link from "next/link";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    const paymentIntentId = searchParams.get("payment_intent");

    if (!clientSecret || !paymentIntentId) {
      setStatus("failed");
      setMessage("ไม่พบข้อมูลการชำระเงิน");
      return;
    }

    stripePromise.then(async (stripe) => {
      if (!stripe) { setStatus("failed"); setMessage("ไม่สามารถโหลด Stripe"); return; }

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      if (paymentIntent?.status === "succeeded") {
        // แจ้ง backend ยืนยัน + อัปสถานะ booking
        try {
          const token = localStorage.getItem("token");
          await fetch(`${baseUrlAPI}stripePayments/confirm`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ paymentIntentId }),
          });
        } catch { /* idempotent — ไม่ต้องหยุดแม้ error */ }

        setStatus("success");
        setMessage("ชำระเงินสำเร็จ! การจองของคุณได้รับการยืนยันแล้ว");
        setTimeout(() => router.push("/booking"), 4000);
      } else if (paymentIntent?.status === "processing") {
        setStatus("loading");
        setMessage("กำลังดำเนินการชำระเงิน กรุณารอสักครู่...");
      } else {
        setStatus("failed");
        setMessage("การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center space-y-5">
        {status === "loading" && (
          <>
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-gray-600 font-medium">{message || "กำลังตรวจสอบสถานะการชำระเงิน..."}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-emerald-700">ชำระเงินสำเร็จ</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">กำลังพาคุณไปยังหน้าการจอง...</p>
            <Link href="/booking" className="btn btn-primary btn-sm mt-2">
              ไปหน้าการจองเลย
            </Link>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-red-600">การชำระเงินไม่สำเร็จ</h2>
            <p className="text-gray-600">{message}</p>
            <Link href="/booking" className="btn btn-primary btn-sm mt-2">
              กลับหน้าการจอง
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

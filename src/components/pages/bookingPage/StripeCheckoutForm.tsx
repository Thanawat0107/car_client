"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/StripeProvider";
import { useCreatePaymentIntentMutation, useConfirmStripePaymentMutation } from "@/services/stripePaymentsApi";
import { Booking } from "@/@types/Dto";
import { CreditCard, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ─────────────────────────────────────────────
// Inner form (ต้องอยู่ภายใน <Elements>)
// ─────────────────────────────────────────────
interface InnerProps {
  booking: Booking;
  onSuccess: () => void;
}

function StripePaymentForm({ booking, onSuccess }: InnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [confirmStripePayment] = useConfirmStripePaymentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // URL ที่ Stripe จะ redirect ไปหลังจาก 3D Secure
          return_url: `${window.location.origin}/payment/callback?bookingId=${booking.id}`,
        },
        // ถ้าบัตรไม่ต้องการ 3DS ให้ไม่ redirect แต่ return ผล ณ ที่นั่น
        redirect: "if_required",
      });

      if (error) {
        await MySwal.fire({
          icon: "error",
          title: "ชำระเงินไม่สำเร็จ",
          text: error.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        });
      } else if (paymentIntent?.status === "succeeded") {
        // แจ้ง backend ยืนยัน payment + อัปสถานะ booking
        await confirmStripePayment({ paymentIntentId: paymentIntent.id }).unwrap();
        await MySwal.fire({
          icon: "success",
          title: "ชำระเงินสำเร็จ!",
          text: "ระบบได้รับการชำระเงินของคุณแล้ว กำลังยืนยันการจอง...",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe PaymentElement (card, PromptPay, etc.) */}
      <PaymentElement
        options={{
          layout: "accordion",
          defaultValues: {
            billingDetails: {
              name: booking.user?.fullName ?? "",
              email: booking.user?.email ?? "",
            },
          },
        }}
      />

      {/* ยอดชำระ */}
      <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
        <span className="text-gray-500">ยอดชำระ</span>
        <span className="font-bold text-emerald-700">
          {(booking.car?.bookingPrice ?? 0).toLocaleString()} ฿
        </span>
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="btn w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CreditCard size={18} />
            ชำระเงินด้วยบัตร {(booking.car?.bookingPrice ?? 0).toLocaleString()} ฿
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 ปลอดภัยด้วย Stripe — ข้อมูลบัตรของคุณได้รับการเข้ารหัสทุกขั้นตอน
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────
// Outer: fetch clientSecret → wrap Elements → render form
// ─────────────────────────────────────────────
interface Props {
  booking: Booking;
  onSuccess: () => void;
}

export default function StripeCheckoutForm({ booking, onSuccess }: Props) {
  const [createIntent] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    createIntent({ bookingId: booking.id })
      .unwrap()
      .then((data) => {
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]);

  if (loadError)
    return (
      <div className="text-center py-6 text-red-500 text-sm font-medium">
        ไม่สามารถเชื่อมต่อกับระบบชำระเงินได้ กรุณาลองใหม่อีกครั้ง
      </div>
    );

  if (!clientSecret)
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
        <Loader2 size={32} className="animate-spin" />
        <p className="text-sm">กำลังเตรียมระบบชำระเงิน...</p>
      </div>
    );

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
        locale: "th",
      }}
    >
      <StripePaymentForm booking={booking} onSuccess={onSuccess} />
    </Elements>
  );
}

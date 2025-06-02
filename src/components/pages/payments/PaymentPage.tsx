// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import Swal from "sweetalert2";

// export default function PaymentPage() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const searchParams = useSearchParams();
//   const reservationId = searchParams.get("reservationId");

//   const [clientSecret, setClientSecret] = useState<string | null>(null);

//   // ดึง clientSecret จาก backend
//   useEffect(() => {
//     if (!reservationId) return;

//     fetch("/api/stripepayments/create-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ reservationId: parseInt(reservationId) }),
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setClientSecret(data.data.clientSecret);
//         else Swal.fire("เกิดข้อผิดพลาด", data.message, "error");
//       });
//   }, [reservationId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements || !clientSecret) return;

//     const result = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/payment/success`, // หน้าหลังจากจ่ายเสร็จ
//       },
//     });

//     if (result.error) {
//       Swal.fire("ไม่สำเร็จ", result.error.message || "เกิดข้อผิดพลาด", "error");
//     }
//   };

//   if (!clientSecret) return <p>กำลังโหลด...</p>;

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-md shadow">
//       <PaymentElement />
//       <button
//         type="submit"
//         className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         disabled={!stripe || !elements}
//       >
//         ชำระเงิน
//       </button>
//     </form>
//   );
// }
import React from 'react'

export default function PaymentPage() {
  return (
    <div>PaymentPage</div>
  )
}

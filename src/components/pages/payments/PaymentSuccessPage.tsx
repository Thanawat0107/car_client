// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";

// export default function PaymentSuccessPage() {
//   const router = useRouter();

//   useEffect(() => {
//     Swal.fire("ชำระเงินสำเร็จ!", "ระบบได้รับการชำระเงินของคุณแล้ว", "success").then(() => {
//       router.push("/reservations"); // ไปยังหน้ารายการจองหรือหน้าหลัก
//     });
//   }, []);

//   return <p>กำลังดำเนินการ...</p>;
// }
import React from 'react'

export default function PaymentSuccessPage() {
  return (
    <div>PaymentSuccessPage</div>
  )
}

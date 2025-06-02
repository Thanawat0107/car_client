"use client";

import RegisterSellerForm from "./RegisterSellerForm";

export default function RegisterSellerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex items-center justify-center px-4 py-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        {/* ฝั่งซ้าย: ข้อมูลโปรโมท */}
        <div className="lg:w-1/2 bg-neutral text-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">พร้อมขายของหรือยัง?</h2>
          <p className="mb-6 text-lg">
            สมัครเป็นผู้ขายเพื่อเริ่มต้นธุรกิจของคุณบนแพลตฟอร์มของเรา 💼
          </p>
        </div>

        {/* ฝั่งขวา: ฟอร์ม */}
        <div className="lg:w-1/2 p-10">
          <RegisterSellerForm />
        </div>
      </div>
    </div>
  );
}

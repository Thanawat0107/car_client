"use client";

import { useRouter } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex items-center justify-center px-4 pt-4 pb-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        {/* ฝั่งซ้าย */}
        <div className="lg:w-1/2 bg-neutral text-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">ยินดีต้อนรับ!</h2>
          <p className="mb-6 text-lg">
            สมัครสมาชิกเพื่อเข้าถึงบริการสุดพิเศษจากเรา 🚀
          </p>
          <button
            className="btn btn-outline text-white"
            onClick={() => router.push("/login")}
          >
            เข้าสู่ระบบ
          </button>
        </div>

        {/* ฝั่งขวา: ใส่ form */}
        <div className="lg:w-1/2 p-10">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

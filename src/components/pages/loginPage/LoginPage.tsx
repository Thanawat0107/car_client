/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useLoginMutation } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/hooks/useAppHookState";
import { setCredentials } from "@/stores/slices/authSlice";
import { RegisterResponse } from "@/@types/Responsts/RegisterResponse";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { LoginForm } from "./LoginForm";

const MySwal = withReactContent(Swal);
const redirectPath = "/";
const register = "/register";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values: { userName: string; password: string }) => {
    try {
      const response = await loginUser(values).unwrap();
      const token = response.token;
      const decoded = jwtDecode<RegisterResponse & { exp?: number }>(token);

      dispatch(
        setCredentials({
          ...decoded,
          userId: decoded.userId,
          userName: decoded.userName,
          token,
        })
      );
      localStorage.setItem("token", token);

      await MySwal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        confirmButtonText: "ไปหน้าหลัก",
      });

      router.push(redirectPath)
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: err?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-1/2 bg-neutral text-white p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">ยินดีต้อนรับอีกครั้ง!</h2>
          <p className="mb-6 text-lg">ยังไม่มีบัญชี? สมัครเลยตอนนี้ 💥</p>
          <button
            className="btn btn-outline text-white"
            onClick={() => router.push(register)}
          >
            สมัครสมาชิก
          </button>
        </div>

        <div className="lg:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center mb-6">เข้าสู่ระบบ</h2>
          <LoginForm onSubmit={handleSubmit} isSubmitting={isLoading} />
        </div>
      </div>
    </div>
  );
}

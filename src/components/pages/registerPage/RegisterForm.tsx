"use client";

import { Register } from "@/@types/dto/Register";
import { useRegisterMutation } from "@/services/authApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { validationSchema } from "./validationSchema";
import { useFormik } from "formik";
import { InputField } from "../inputField/InputField";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";

const MySwal = withReactContent(Swal);
const redirectPath = "/login";

export default function RegisterForm() {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      userName: "",
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      role: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: Register = {
          ...values,
          createdAt: new Date().toISOString(),
        };

        await register(payload).unwrap();

        await MySwal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          confirmButtonText: "ไปหน้าเข้าสู่ระบบ",
        });

        router.push(redirectPath);
      } catch (err: unknown) {
        const error = err as { data?: ApiResponse<unknown> };
        await MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error?.data?.message || "สมัครไม่สำเร็จ",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">ลงทะเบียน</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        {[
          {
            label: "ชื่อผู้ใช้",
            name: "userName",
            type: "text",
            placeholder: "เช่น kengdev123",
          },
          {
            label: "ชื่อ-นามสกุล",
            name: "fullName",
            type: "text",
            placeholder: "เช่น เก่ง กล้าหาญ",
          },
          {
            label: "เบอร์โทรศัพท์",
            name: "phoneNumber",
            type: "tel",
            placeholder: "เช่น 0891234567",
          },
          {
            label: "อีเมล์",
            name: "email",
            type: "email",
            placeholder: "เช่น keng@example.com",
          },
          {
            label: "รหัสผ่าน",
            name: "password",
            type: "password",
            placeholder: "กรอกรหัสผ่านอย่างน้อย 6 ตัว",
          },
          {
            label: "ยืนยันรหัสผ่าน",
            name: "confirmPassword",
            type: "password",
            placeholder: "พิมพ์รหัสผ่านอีกครั้ง",
          },
        ].map(({ label, name, type, placeholder }) => (
          <InputField
            key={name}
            label={label}
            name={name}
            type={type}
            value={formik.values[name as keyof typeof formik.values]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors[name as keyof typeof formik.errors]}
            touched={formik.touched[name as keyof typeof formik.touched]}
            placeholder={placeholder}
          />
        ))}

        <button
          type="submit"
          className="btn btn-neutral w-full mt-2"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>
    </>
  );
}

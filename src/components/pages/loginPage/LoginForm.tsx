"use client"

import { useFormik } from "formik";
import { InputField } from "../inputField/InputField";
import { LoginSchema } from "./validationSchema";

interface LoginFormProps {
  onSubmit: (values: { userName: string; password: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit,
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <InputField
        label="ชื่อผู้ใช้"
        name="userName"
        type="text"
        value={formik.values.userName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.userName}
        touched={formik.touched.userName}
        placeholder="เช่น kengdev123"
      />

      <InputField
        label="รหัสผ่าน"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.password}
        touched={formik.touched.password}
        placeholder="กรอกรหัสผ่านของคุณ"
      />

      <div className="flex justify-between items-center">
        <label className="label cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-sm mr-2" />
          จดจำฉันไว้
        </label>
        <a href="/forgot-password" className="link text-sm">
          ลืมรหัสผ่าน?
        </a>
      </div>

      <button
        type="submit"
        className="btn btn-neutral w-full mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
};

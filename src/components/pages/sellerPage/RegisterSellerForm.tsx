 "use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useCreateSellerMutation } from "@/services/sellerApi";
import { validationSchema } from "./validationSchema";
import { InputField } from "../inputField/InputField";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { SellerCreateFormValues } from "./SellerFormValues";
import { useAppSelector } from "@/hooks/useAppHookState";

const MySwal = withReactContent(Swal);
const redirectPath = "/";

type SellerFormField = keyof SellerCreateFormValues;

const fields: {
  label: string;
  name: SellerFormField;
  type: string;
  placeholder: string;
}[] = [
  {
    label: "User ID",
    name: "userId",
    type: "text",
    placeholder: "กรอก ID ผู้ใช้",
  },
  {
    label: "เลขบัตรประชาชน",
    name: "identityNumber",
    type: "text",
    placeholder: "เช่น 1234567890123",
  },
  {
    label: "ที่อยู่",
    name: "address",
    type: "text",
    placeholder: "กรอกที่อยู่ติดต่อ",
  },
];

export default function RegisterSellerForm() {
  const { userName, fullName, email, userId, role, phoneNumber } =
    useAppSelector((state) => state.auth);

    console.log("role, userId", role, userId);

  const router = useRouter();
  const [createSeller] = useCreateSellerMutation();

  const formik = useFormik<SellerCreateFormValues>({
    initialValues: {
      userId: userId || "",
      identityNumber: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          ...values,
          isVerified: false,
        };

        await createSeller(payload).unwrap();

        await MySwal.fire({
          icon: "success",
          title: "สมัครเป็นผู้ขายสำเร็จ",
          text: "ระบบจะทำการตรวจสอบก่อนเปิดใช้งาน",
          confirmButtonText: "กลับเข้าสู่ระบบ",
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
      <h2 className="text-3xl font-bold text-center mb-6">ลงทะเบียนผู้ขาย</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <InputField
          label="ชื่อผู้ใช้"
          name="userName"
          type="text"
          value={userName}
          onChange={() => {}}
          readOnly
          disabled
        />

        <InputField
          label="ชื่อ-นามสกุล"
          name="fullName"
          type="text"
          value={fullName}
          onChange={() => {}}
          readOnly
          disabled
        />

        <InputField
          label="อีเมล"
          name="email"
          type="text"
          value={email}
          onChange={() => {}}
          readOnly
          disabled
        />
        <InputField
          label="เบอร์โทร"
          name="phoneNumber"
          type="text"
          value={phoneNumber as string}
          onChange={() => {}}
          readOnly
          disabled
        />
        {fields.map(({ label, name, type, placeholder }) => (
          <InputField
            key={name}
            label={label}
            name={name}
            type={type}
            value={formik.values[name]}
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
          {formik.isSubmitting ? "กำลังสมัคร..." : "สมัครเป็นผู้ขาย"}
        </button>
      </form>
    </>
  );
}

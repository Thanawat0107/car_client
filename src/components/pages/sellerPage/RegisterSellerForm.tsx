"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useCreateSellerMutation } from "@/services/sellerApi";
import { validationSchema } from "./validationSchema";
import { InputField } from "../inputField/InputField";
import { ApiResponse } from "@/@types/Responsts/ApiResponse";
import { SellerCreateDto } from "@/@types/Dto";
import { useAppSelector } from "@/hooks/useAppHookState";

const MySwal = withReactContent(Swal);
const redirectPath = "/";

type SellerCreateFormValues = Omit<SellerCreateDto, 'isVerified' | 'id'>;

const fields: {
  label: string;
  name: keyof SellerCreateFormValues;
  type: string;
  placeholder: string;
}[] = [
  {
    label: "เลขประจำตัวประชาชน (13 หลัก)",
    name: "identityNumber",
    type: "text",
    placeholder: "เช่น 1234567890123",
  },
  {
    label: "ที่อยู่สำหรับติดต่อ",
    name: "address",
    type: "text",
    placeholder: "บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์",
  },
];

export default function RegisterSellerForm() {
  const { userName, fullName, email, userId, phoneNumber } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [createSeller] = useCreateSellerMutation();

  const formik = useFormik<SellerCreateFormValues>({
    enableReinitialize: true,
    initialValues: {
      userId: userId || "",
      identityNumber: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: SellerCreateDto = {
          ...values,
          isVerified: false,
        };

        await createSeller(payload).unwrap();

        await MySwal.fire({
          icon: "success",
          title: "สมัครเป็นผู้ขายสำเร็จ",
          text: "ระบบกำลังดำเนินการ โปรดรอผู้ดูแลระบบตรวจสอบข้อมูลของคุณ",
          confirmButtonText: "กลับสู่หน้าหลัก",
        });

        router.push(redirectPath);
      } catch (err: unknown) {
        const error = err as { data?: ApiResponse<unknown> };
        await MySwal.fire({
          icon: "error",
          title: "ลงทะเบียนไม่สำเร็จ",
          text: error?.data?.message || "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">ลงทะเบียนเป็นผู้ขาย</h2>
        <p className="text-gray-500 mt-2">กรอกข้อมูลให้ครบถ้วนเพื่อเริ่มลงขายรถยนต์กับ CarMS</p>
      </div>

      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        
        {/* กล่องข้อมูลบัญชี (Read-Only) */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">ข้อมูลบัญชีของคุณ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="ชื่อผู้ใช้ (Username)"
              name="userName"
              type="text"
              value={userName || "-"}
              onChange={() => {}}
              readOnly
              disabled
            />
            <InputField
              label="ชื่อ-นามสกุล"
              name="fullName"
              type="text"
              value={fullName || "-"}
              onChange={() => {}}
              readOnly
              disabled
            />
            <InputField
              label="อีเมล"
              name="email"
              type="text"
              value={email || "-"}
              onChange={() => {}}
              readOnly
              disabled
            />
            <InputField
              label="เบอร์โทรศัพท์"
              name="phoneNumber"
              type="text"
              value={(phoneNumber as string) || "-"}
              onChange={() => {}}
              readOnly
              disabled
            />
          </div>
        </div>

        {/* กล่องข้อมูลสำหรับการลงทะเบียนผู้ขาย */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-primary mb-2 border-b pb-2">ข้อมูลยืนยันตัวตนผู้ขาย</h3>
          
          {fields.map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <InputField
                label={label}
                name={name}
                type={type}
                value={formik.values[name] as string}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={placeholder}
                /* 🚀 ส่ง error/touched ไปให้ InputField จัดการ (ถ้า InputField คุณรองรับ)
                   ถ้า InputField ไม่รองรับ ให้เปิดใช้ <p> แจ้งเตือนแบบเดิมครับ */
                error={formik.errors[name] as string}
                touched={formik.touched[name] as boolean}
              />
              
              {/* 💡 หมายเหตุ: หาก InputField ของคุณไม่ได้แสดงข้อความ Error อัตโนมัติ ให้ใช้โค้ดด้านล่างนี้แทน */}
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {formik.errors[name] as string}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ปุ่ม Submit พร้อม Loading State */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary w-full text-lg shadow-md"
            // 🚀 Disable ถ้ากำลังโหลด, หรือฟอร์มมี Error, หรือยังไม่ได้พิมพ์อะไรเลย
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
          >
            {formik.isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                กำลังส่งข้อมูล...
              </>
            ) : (
              "ยืนยันการสมัคร"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
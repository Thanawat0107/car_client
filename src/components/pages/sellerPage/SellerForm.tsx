"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useCreateSellerMutation,
  useGetSellerByIdQuery,
  useUpdateSellerMutation,
} from "@/services/sellerApi";
import { validationSchema } from "./validationSchema";
import { SellerCreateDto, SellerUpdateDto } from "@/@types/Dto";
import { InputField } from "../inputField/InputField";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/seller";

type SellerFormValues = {
  userId: string;
  identityNumber: string;
  address: string;
  isVerified: boolean;
};

const baseInitialValues: SellerFormValues = {
  userId: "",
  identityNumber: "",
  address: "",
  isVerified: false,
};

export default function SellerForm() {
  const router = useRouter();
  const params = useParams();
  const sellerId = params?.id;
  const isEditMode = Boolean(sellerId);

  const { data: result, isLoading } = useGetSellerByIdQuery(Number(sellerId), {
    skip: !isEditMode,
  });

  const [createSeller] = useCreateSellerMutation();
  const [updateSeller] = useUpdateSellerMutation();

  const [initialValues, setInitialValues] = useState<SellerFormValues>(baseInitialValues);

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        userId: result.userId || "",
        identityNumber: result.identityNumber || "",
        address: result.address || "",
        isVerified: result.isVerified ?? false,
      });
    }
  }, [isEditMode, result]);

  const showAlert = (message: string, isError = false) =>
    MySwal.fire({
      icon: isError ? "error" : "success",
      title: isError ? "เกิดข้อผิดพลาด" : "สำเร็จ",
      text: message,
      timer: isError ? undefined : 1500,
      showConfirmButton: isError,
    });

  const formik = useFormik<SellerFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema, // 🚀 ถ้ามีแยก create/update schema สามารถใส่เงื่อนไขแบบเดิมได้
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEditMode) {
          // 🚀 ตอนอัปเดต API รับแค่ SellerUpdateDto (identityNumber, address) (หรืออาจรวม isVerified ถ้า API รองรับ)
          const updatePayload: SellerUpdateDto & { isVerified?: boolean } = {
            identityNumber: values.identityNumber,
            address: values.address,
            // เพิ่ม isVerified ใน Payload ถ้า Backend ของคุณยอมให้อัปเดตสถานะด้วย Route นี้นะครับ
            // (ถ้า API แยก Route สำหรับอนุมัติ ก็ไม่ต้องส่งฟิลด์นี้ไป)
            isVerified: values.isVerified, 
          };

          await updateSeller({
            sellerId: Number(sellerId),
            sellerData: updatePayload as SellerUpdateDto, // Cast เพื่อป้องกัน Type Error
          }).unwrap();

          await showAlert("อัปเดตข้อมูลผู้ขายสำเร็จ");
        } else {
          // 🚀 ตอนสร้างใหม่ ส่งข้อมูลแบบเต็มตาม SellerCreateDto
          const createPayload: SellerCreateDto = {
            userId: values.userId,
            identityNumber: values.identityNumber,
            address: values.address,
            isVerified: values.isVerified,
          };

          await createSeller(createPayload).unwrap();
          await showAlert("เพิ่มข้อมูลผู้ขายสำเร็จ");
        }

        router.push(redirectPath);
      } catch (error) {
        console.error(error);
        showAlert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง", true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "แก้ไขข้อมูลผู้ขาย" : "เพิ่มข้อมูลผู้ขาย"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">จัดการข้อมูลและสถานะการยืนยันตัวตนของผู้ขาย</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            
            <InputField
              label="User ID (รหัสผู้ใช้)"
              name="userId"
              type="text"
              placeholder="กรอกรหัสอ้างอิง User ID"
              value={formik.values.userId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.userId}
              touched={formik.touched.userId}
              disabled={isEditMode}
            />

            <InputField
              label="เลขประจำตัวประชาชน"
              name="identityNumber"
              type="text"
              placeholder="เช่น 1234567890123"
              value={formik.values.identityNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.identityNumber}
              touched={formik.touched.identityNumber}
            />

            <div className="form-control w-full">
              <label className="label font-semibold text-sm">ที่อยู่ติดต่อ</label>
              <textarea
                name="address"
                placeholder="กรอกที่อยู่แบบเต็ม"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`textarea textarea-bordered w-full text-base ${
                  formik.touched.address && formik.errors.address ? "textarea-error" : ""
                }`}
                rows={3}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-xs font-medium mt-1">
                  {formik.errors.address}
                </p>
              )}
            </div>

            {isEditMode && (
              <div className="form-control bg-gray-50 p-4 rounded-xl border border-gray-200 mt-6">
                <label className="cursor-pointer flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={formik.values.isVerified}
                    onChange={formik.handleChange}
                    className="toggle toggle-success"
                  />
                  <div>
                    <span className="font-bold text-gray-800 block">ยืนยันตัวตนผู้ขาย (Verified)</span>
                    <span className="text-xs text-gray-500">หากเปิดใช้งาน ผู้ขายจะสามารถลงประกาศขายรถยนต์ได้</span>
                  </div>
                </label>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                className="btn btn-primary w-full text-lg shadow-md"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    กำลังบันทึกข้อมูล...
                  </>
                ) : isEditMode ? (
                  "อัปเดตข้อมูลผู้ขาย"
                ) : (
                  "เพิ่มผู้ขาย"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
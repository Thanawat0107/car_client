/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useCreateBrandMutation,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/services/brandApi";
import { baseUrl } from "@/utility/SD";
import { createValidationSchema, updateValidationSchema } from "./validationSchema";
import { BrandCreateDto, BrandUpdateDto } from "@/@types/Dto";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/brand";
const MAX_FILE_SIZE_MB = 5;

type BrandFormValues = typeof baseInitialValues & {
  isDelete?: boolean;
};

const baseInitialValues = {
  name: "",
  isUsed: false,
  imageFile: undefined as File | undefined,
};

export default function BrandForm() {
  const router = useRouter();
  const brandId = useParams()?.id;
  const isEditMode = Boolean(brandId);

  const { data: result, isLoading } = useGetBrandByIdQuery(Number(brandId), { skip: !isEditMode });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<BrandFormValues>({
    ...baseInitialValues,
    ...(isEditMode && { isDelete: false }),
  });

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        ...baseInitialValues,
        ...result,
        imageFile: undefined, // เคลียร์ไฟล์รูปเมื่อโหลดข้อมูลเก่า
        name: result.name ?? "",
        isUsed: result.isUsed ?? false,
        isDelete: result.isDelete ?? false,
      });
    }
  }, [isEditMode, result]);

  useEffect(() => {
    // 🚀 ใช้ฟิลด์ carImages ให้ตรงกับ Interface
    if (isEditMode && result?.carImages) {
      setPreviewUrl(baseUrl + result.carImages);
    }
  }, [isEditMode, result?.carImages]);

  // Cleanup Object URL เหมือนใน CarForm
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (values: BrandFormValues) => {
    try {
      if (isEditMode) {
        const updatePayload: BrandUpdateDto = {
          name: values.name,
          imageFile: values.imageFile,
          isUsed: values.isUsed,
          isDelete: values.isDelete ?? false,
        };

        await updateBrand({ brandId: Number(brandId), data: updatePayload }).unwrap();
        await showAlert("อัปเดตแบรนด์สำเร็จ");
      } else {
        const createPayload: BrandCreateDto = {
          name: values.name,
          imageFile: values.imageFile,
          isUsed: values.isUsed,
        };

        await createBrand(createPayload).unwrap();
        await showAlert("เพิ่มแบรนด์สำเร็จ");
      }
      router.push(redirectPath);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      });
      console.error(error);
    }
  };

  const showAlert = (message: string) =>
    MySwal.fire({ icon: "success", title: "สำเร็จ", text: message, timer: 1500, showConfirmButton: false });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;

    if (file) {
      // เช็กขนาดไฟล์เหมือนใน CarForm
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        MySwal.fire({
          icon: "warning",
          title: "ไฟล์มีขนาดใหญ่เกินไป",
          text: `กรุณาอัปโหลดรูปภาพที่มีขนาดไม่เกิน ${MAX_FILE_SIZE_MB}MB`,
        });
        event.target.value = "";
        return;
      }

      formik.setFieldValue("imageFile", file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      formik.setFieldValue("imageFile", undefined);
      
      // ถ้ายกเลิกไฟล์ ให้กลับไปโชว์รูปเดิมถ้ามี
      if (isEditMode && result?.carImages) {
        setPreviewUrl(baseUrl + result.carImages);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const formik = useFormik<BrandFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: isEditMode ? updateValidationSchema : createValidationSchema,
    onSubmit: handleSubmit,
  });

  if (isEditMode && isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="w-full max-w-7xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* พรีวิวภาพ */}
          <div className="bg-base-300 p-6 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-xl shadow w-full h-96 object-contain bg-white p-2"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center border border-dashed border-gray-400 rounded-xl">
                <span className="text-gray-500">ไม่มีภาพ</span>
              </div>
            )}
          </div>

          {/* ฟอร์ม */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              {isEditMode ? "แก้ไขแบรนด์รถยนต์" : "เพิ่มแบรนด์ใหม่"}
            </h2>

            {/* โครงสร้าง Form เลียนแบบ CarForm (Grid 1 คอลัมน์เพราะมีฟิลด์น้อยกว่า) */}
            <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-6">
              
              {/* ชื่อแบรนด์ */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ชื่อแบรนด์
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="กรอกชื่อแบรนด์"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.name as string}</p>
                )}
              </div>

              {/* Checkboxes ด้านล่าง (ใช้งาน / ลบ) เลียนแบบ CarForm */}
              <div className="col-span-1 flex flex-wrap gap-6 mt-2">
                <label className="label cursor-pointer flex gap-2">
                  <input
                    type="checkbox"
                    name="isUsed"
                    checked={formik.values.isUsed}
                    onChange={formik.handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">เปิดใช้งานแบรนด์นี้</span>
                </label>

                {isEditMode && (
                  <label className="label cursor-pointer flex gap-2">
                    <input
                      type="checkbox"
                      name="isDelete"
                      checked={formik.values.isDelete}
                      onChange={formik.handleChange}
                      className="checkbox checkbox-error"
                    />
                    <span className="label-text text-error">ลบแบรนด์นี้</span>
                  </label>
                )}
              </div>

              {/* อัปโหลดรูป */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  อัปโหลดโลโก้แบรนด์
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                />
                {formik.touched.imageFile && formik.errors.imageFile && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.imageFile as string}</p>
                )}
              </div>

              {/* ปุ่ม Submit */}
              <div className="col-span-1 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg flex justify-center items-center gap-2"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting && <span className="loading loading-spinner loading-sm"></span>}
                  {isEditMode ? "อัปเดตแบรนด์" : "บันทึกแบรนด์"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
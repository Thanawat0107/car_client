/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useCreateBrandMutation,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/services/brandApi";
import { BrandFormValues } from "./BrandFormValues";
import { validationSchema } from "./validationSchema";

const path = "/manages/brand"; 

const MySwal = withReactContent(Swal);

export default function BrandForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandId = searchParams.get("id");

  const isEditMode = !!brandId;

  const { data: result, isLoading } = useGetBrandByIdQuery(Number(brandId), {
    skip: !isEditMode,
  });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  const [initialValues, setInitialValues] = useState<BrandFormValues>({
    name: "",
    imageFile: null,
    isUsed: false,
    isDelete: false,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        name: result.name ?? "",
        imageFile: null,
        isUsed: result.isUsed,
        isDelete: result.isDelete,
      });
      if (result.imageUrl) {
        setPreviewUrl(result.imageUrl);
      }
    }
  }, [isEditMode, result]);

  const formik = useFormik<BrandFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
     formData.append("name", values.name);
     if (values.imageFile) {
       formData.append("imageFile", values.imageFile);
     }
     formData.append("isUsed", String(values.isUsed));
     formData.append("isDelete", String(values.isDelete));

      try {
        if (isEditMode) {
          await updateBrand({ brandId: Number(brandId), formData }).unwrap();
          await MySwal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "อัปเดตแบรนด์สำเร็จ",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          await createBrand(formData).unwrap();
          await MySwal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "เพิ่มแบรนด์สำเร็จ",
            timer: 1500,
            showConfirmButton: false,
          });
        }

        router.push(path);
      } catch (error) {
        await MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถบันทึกแบรนด์ได้",
        });
      }
    },
  });

  if (isEditMode && isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* รูปภาพ Preview */}
          <div className="bg-base-300 p-6 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-xl shadow w-full h-80 object-contain bg-white p-2"
              />
            ) : (
              <div className="w-full h-80 flex items-center justify-center border border-dashed border-gray-400 rounded-xl">
                <span className="text-gray-500">ไม่มีภาพ</span>
              </div>
            )}
          </div>

          {/* ฟอร์ม */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isEditMode ? "แก้ไขแบรนด์" : "เพิ่มแบรนด์"}
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  ชื่อแบรนด์
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                  placeholder="กรอกชื่อแบรนด์"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.name}
                  </p>
                )}
              </div>

              {/* เพิ่ม Checkbox สำหรับ isUsed */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">ใช้งานแบรนด์นี้</span>
                  <input
                    type="checkbox"
                    name="isUsed"
                    checked={formik.values.isUsed}
                    onChange={formik.handleChange}
                    className="checkbox checkbox-primary ml-2"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  รูปภาพ (ถ้ามี)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0] || null;
                    formik.setFieldValue("imageFile", file);

                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {isEditMode ? "อัปเดต" : "บันทึก"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

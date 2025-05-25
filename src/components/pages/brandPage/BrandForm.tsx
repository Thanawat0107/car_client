/* eslint-disable @next/next/no-img-element */
 
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useCreateBrandMutation,
  useGetBrandByIdQuery,
  useUpdateBrandMutation,
} from "@/services/brandApi";
import { BrandCreateFormValues, BrandUpdateFormValues } from "./BrandFormValues";
import { createValidationSchema, updateValidationSchema } from "./validationSchema";
import { baseUrl } from "@/utility/SD";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/brand";

export default function BrandForm() {
  const router = useRouter();
  const params = useParams();
  const brandId = params?.id;
  const isEditMode = Boolean(brandId);

  const { data: result, isLoading } = useGetBrandByIdQuery(Number(brandId), {
    skip: !isEditMode,
  });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<
    BrandCreateFormValues | BrandUpdateFormValues
  >(
    isEditMode
      ? {
          name: "",
          imageFile: null,
          isUsed: false,
          isDelete: false,
        }
      : {
          name: "",
          imageFile: null,
          isUsed: false,
        }
  );

useEffect(() => {
  if (isEditMode && result) {
    setInitialValues({
      name: result.name ?? "",
      imageFile: null,
      isUsed: result.isUsed,
      isDelete: result.isDelete,
    } satisfies BrandUpdateFormValues);
  }
}, [isEditMode, result]);

useEffect(() => {
  if (isEditMode && result?.imageUrl) {
    setPreviewUrl(baseUrl + result.imageUrl);
  }
}, [isEditMode, result?.imageUrl]);

  const handleSubmit = async (values: BrandCreateFormValues | BrandUpdateFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("isUsed", String((values as BrandCreateFormValues).isUsed));
    if (values.imageFile) formData.append("imageFile", values.imageFile);

    if (isEditMode) {
      formData.append("isUsed", String((values as BrandUpdateFormValues).isUsed));
      formData.append("isDelete", String((values as BrandUpdateFormValues).isDelete));
      await updateBrand({ brandId: Number(brandId), formData }).unwrap();
      await showAlert("อัปเดตแบรนด์สำเร็จ");
    } else {
      await createBrand(formData).unwrap();
      await showAlert("เพิ่มแบรนด์สำเร็จ");
    }

    router.push(redirectPath);
  };

  const showAlert = (message: string) =>
    MySwal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue("imageFile", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

const formik = useFormik<BrandCreateFormValues | BrandUpdateFormValues>({
  enableReinitialize: true,
  initialValues,
  validationSchema: isEditMode
    ? updateValidationSchema
    : createValidationSchema,
  onSubmit: handleSubmit,
});

  if (isEditMode && isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Preview */}
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

          {/* Form Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isEditMode ? "แก้ไขแบรนด์" : "เพิ่มแบรนด์"}
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Name */}
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

              {/* isUsed */}
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

              {isEditMode && (
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text text-red-500">ลบแบรนด์นี้</span>
                    <input
                      type="checkbox"
                      name="isDelete"
                      checked={
                        (formik.values as BrandUpdateFormValues).isDelete
                      }
                      onChange={formik.handleChange}
                      className="checkbox checkbox-error ml-2"
                    />
                  </label>
                </div>
              )}

              {/* Image File */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  รูปภาพ (ถ้ามี)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={formik.isSubmitting}
              >
                {isEditMode ? "อัปเดต" : "บันทึก"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

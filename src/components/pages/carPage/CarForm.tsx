/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CarType, EngineType, GearType, Status } from "@/@types/Enum";
import {
  useCreateCarMutation,
  useGetCarByIdQuery,
  useUpdateCarMutation,
} from "@/services/carApi";
import { baseUrl } from "@/utility/SD";
import { CarCreateFormValues, CarUpdateFormValues } from "./CarFormValues";
import {
  createValidationSchema,
  updateValidationSchema,
} from "./validationSchema";
import { SelectField } from "../selectField/SelectField";
import { enumToOptionsWithLabels } from "@/utility/enumHelpers";
import {
  carTypeLabels,
  engineTypeLabels,
  GearTypeLabels,
  statusLabels,
} from "../filters/CarFilters";
import { useGetBrandAllQuery } from "@/services/brandApi";
import { SelectFieldWithImage } from "../selectField/SelectFieldWithImage";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/car";
const baseInitialValues = {
  brandId: "",
  sellerId: 1,
  carRegistrationNumber: "",
  carIdentificationNumber: "",
  engineNumber: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  color: "",
  engineType: 0,
  gearType: 0,
  carType: 0,
  status: 0,
  description: "",
  imageFile: null,
};

export default function CarForm() {
  const router = useRouter();
  const params = useParams();
  const carId = params?.id;
  const isEditMode = Boolean(carId);

  const { data: result, isLoading } = useGetCarByIdQuery(Number(carId), {
    skip: !isEditMode,
  });

  const { data: brands } = useGetBrandAllQuery({
    pageNumber: 1,
    pageSize: 100,
  });
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<
    CarCreateFormValues | CarUpdateFormValues
  >(
    isEditMode
      ? {
          ...baseInitialValues,
          isUsed: false,
          isDeleted: false,
        }
      : {
          ...baseInitialValues,
          isUsed: false, // คุณอาจจะไม่ต้องใส่ field นี้หากไม่อยู่ใน `CarCreateFormValues`
          isDeleted: false,
        }
  );

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        ...result,
        brandId: result.brandId?.toString() ?? "",
        carRegistrationNumber: result.carRegistrationNumber ?? "",
        carIdentificationNumber: result.carIdentificationNumber ?? "",
        engineNumber: result.engineNumber ?? "",
        description: result.description ?? "",
        imageFile: null,
      } satisfies CarUpdateFormValues);
    }
  }, [isEditMode, result]);

  useEffect(() => {
    if (isEditMode && result?.imageUrl) {
      setPreviewUrl(baseUrl + result.imageUrl);
    }
  }, [isEditMode, result?.imageUrl]);

  const handleSubmit = async (
    values: CarCreateFormValues | CarUpdateFormValues
  ) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "imageFile") return;

      const finalValue =
        key === "brandId" ? Number(value).toString() : String(value ?? "");
      formData.append(key, finalValue);
    });

    if (values.imageFile) {
      formData.append("imageFile", values.imageFile);
    }

    if (isEditMode) {
      await updateCar({ carId: Number(carId), formData }).unwrap();
      await showAlert("อัปเดตรถสำเร็จ");
    } else {
      await createCar(formData).unwrap();
      await showAlert("เพิ่มรถสำเร็จ");
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

  const formik = useFormik<CarCreateFormValues | CarUpdateFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: isEditMode
      ? updateValidationSchema
      : createValidationSchema,
    onSubmit: handleSubmit,
  });

  const brandOptions =
    brands?.result
      .filter((brand) => brand.isUsed)
      .map((brand) => ({
        value: brand.id.toString(),
        label: brand.name,
        imageUrl: baseUrl + brand.imageUrl,
      })) ?? [];

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
              {isEditMode ? "แก้ไขรถยนต์" : "เพิ่มรถยนต์คันใหม่"}
            </h2>

            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* ยี่ห้อรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ยี่ห้อรถยนต์
                </label>
                <SelectFieldWithImage
                  value={formik.values.brandId}
                  onChange={(val) => formik.setFieldValue("brandId", val)}
                  options={brandOptions}
                />
              </div>

              {/* ป้ายทะเบียน */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  เลขทะเบียนเดิมรถยนต์
                </label>
                <input
                  type="text"
                  name="carRegistrationNumber"
                  placeholder="กรอกป้ายทะเบียน เช่น กค-8888 กทมท"
                  value={formik.values.carRegistrationNumber}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* หมายเลขตัวถัง */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  หมายเลขตัวถัง (VIN) จำนวนของหมายเลขตัวถังทั้ง 17 หลัก
                </label>
                <input
                  type="text"
                  name="carIdentificationNumber"
                  placeholder="กรอก เช่น MNBAXXMAWAFJ9***2"
                  value={formik.values.carIdentificationNumber}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* เลขเครื่องยนต์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  หมายเลขเครื่องยนต์ เริ่มต้นด้วยชื่อรหัสเครื่องยนต์ (เช่น 1NZ,
                  HR15, 4JJ1)
                </label>
                <input
                  type="text"
                  name="engineNumber"
                  placeholder="จำนวนไม่แน่นอน 7-12 หลัก 1NZ1234567"
                  value={formik.values.engineNumber}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* รุ่นรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  รุ่นรถ
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="กรอกรุ่นรถ"
                  value={formik.values.model}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* ปีที่ผลิตรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ปีที่ผลิตรถ
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="กรอกปีที่ผลิตรถ"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* ราคารถยนต์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ราคารถยนต์
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="กรอกราคารถยนต์"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* เลขไมล์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  เลขไมล์ (กม.)
                </label>
                <input
                  type="number"
                  name="mileage"
                  placeholder="กรอกเลขไมล์"
                  value={formik.values.mileage}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* สีรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  สีรถยนต์
                </label>
                <input
                  type="text"
                  name="color"
                  placeholder="เช่น ขาว, ดำ"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  เครื่องยนต์
                </label>
                <SelectField
                  value={formik.values.engineType?.toString()}
                  onChange={(v) =>
                    formik.setFieldValue(
                      "engineType",
                      v === "" ? undefined : Number(v)
                    )
                  }
                  options={enumToOptionsWithLabels(
                    EngineType,
                    engineTypeLabels
                  )}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  เกียร์รถยนต์
                </label>
                <SelectField
                  value={formik.values.gearType?.toString()}
                  onChange={(v) =>
                    formik.setFieldValue(
                      "gearType",
                      v === "" ? undefined : Number(v)
                    )
                  }
                  options={enumToOptionsWithLabels(GearType, GearTypeLabels)}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ประเภทรถยนต์
                </label>
                <SelectField
                  value={formik.values.carType?.toString()}
                  onChange={(v) =>
                    formik.setFieldValue(
                      "carType",
                      v === "" ? undefined : Number(v)
                    )
                  }
                  options={enumToOptionsWithLabels(CarType, carTypeLabels)}
                  placeholder="เลือกประเภทรถของคุณ"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  สถานะรถ
                </label>
                <SelectField
                  value={formik.values.status?.toString()}
                  onChange={(v) =>
                    formik.setFieldValue(
                      "status",
                      v === "" ? undefined : Number(v)
                    )
                  }
                  options={enumToOptionsWithLabels(Status, statusLabels)}
                  placeholder="เลือกสถานะรถ"
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  คำอธิบายเพิ่มเติม
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="กรอกคำอธิบาย"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              {isEditMode && (
                <div className="col-span-2 md:col-span-1">
                  <label className="label cursor-pointer">
                    <span className="label-text">เปิดใช้งานรถคันนี้</span>
                    <input
                      type="checkbox"
                      name="isUsed"
                      checked={(formik.values as CarUpdateFormValues).isUsed}
                      onChange={formik.handleChange}
                      className="checkbox ml-2 mr-3"
                    />
                  </label>

                  <label className="label cursor-pointer mt-4">
                    <span className="label-text text-red-500">ลบรถคันนี้</span>
                    <input
                      type="checkbox"
                      name="isDelete"
                      checked={(formik.values as CarUpdateFormValues).isDeleted}
                      onChange={formik.handleChange}
                      className="checkbox checkbox-error ml-2"
                    />
                  </label>
                </div>
              )}

              {/* อัปโหลดรูป */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  อัปโหลดภาพรถยนต์
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                />
              </div>

              {/* ปุ่ม Submit */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={formik.isSubmitting}
                >
                  {isEditMode ? "อัปเดตรถยนต์" : "บันทึกรถยนต์"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

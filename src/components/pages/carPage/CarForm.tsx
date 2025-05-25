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
import { createValidationSchema, updateValidationSchema } from "./validationSchema";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/car";

export default function CarForm() {
  const router = useRouter();
  const params = useParams();
  const carId = params?.id;
  const isEditMode = Boolean(carId);

  const { data: result, isLoading } = useGetCarByIdQuery(Number(carId), {
    skip: !isEditMode,
  });

  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<
    CarCreateFormValues | CarUpdateFormValues
  >({
    brandId: 1,
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
    ...(isEditMode && { isDelete: false, isUsed: false }),
  });

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        brandId: result.brandId,
        sellerId: result.sellerId,
        carRegistrationNumber: result.carRegistrationNumber ?? "",
        carIdentificationNumber: result.carIdentificationNumber ?? "",
        engineNumber: result.engineNumber ?? "",
        model: result.model,
        year: result.year,
        price: result.price,
        mileage: result.mileage,
        color: result.color,
        engineType: result.engineType,
        gearType: result.gearType,
        carType: result.carType,
        status: result.status,
        description: result.description ?? "",
        imageFile: null,
        isUsed: result.isUsed,
        isDelete: result.isDeleted,
      });
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
      if (value !== undefined && value !== null && key !== "imageFile") {
        formData.append(key, value.toString());
      }
    });
    if (values.imageFile) {
      formData.append("imageFile", values.imageFile);
    }

    if (isEditMode) {
      formData.append("isUsed", String((values as CarUpdateFormValues).isUsed));
      formData.append("isDelete", String((values as CarUpdateFormValues).isDelete));
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

  const enumOptions = (e: object) =>
    Object.entries(e)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key, value]) => (
        <option key={value} value={value}>
          {key}
        </option>
      ));

  const formik = useFormik<CarCreateFormValues | CarUpdateFormValues>({
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

          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isEditMode ? "แก้ไขรถยนต์" : "เพิ่มรถยนต์คันใหม่"}
            </h2>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div>
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

              <div>
                <label className="block text-sm font-semibold mb-1">
                  ปีที่ผลิต
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="กรอกปีที่ผลิต"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
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

              <div>
                <label className="block text-sm font-semibold mb-1">
                  เลขไมล์ระยะทาง
                </label>
                <input
                  type="number"
                  name="mileage"
                  placeholder="หรอกเลขไมล์"
                  value={formik.values.mileage}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  สีรถยนต์
                </label>
                <input
                  type="text"
                  name="color"
                  placeholder="กรอกสีรถ"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  ประเภทเครื่องยนต์
                </label>
                <select
                  name="engineType"
                  value={formik.values.engineType}
                  onChange={formik.handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">เลือกประเภทเครื่องยนต์</option>
                  {enumOptions(EngineType)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  รูปแบบเกียร์รถยนต์
                </label>
                <select
                  name="gearType"
                  value={formik.values.gearType}
                  onChange={formik.handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">เลือกเกียร์</option>
                  {enumOptions(GearType)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  ประเภทรถยนต์
                </label>
                <select
                  name="carType"
                  value={formik.values.carType}
                  onChange={formik.handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">เลือกประเภทรถ</option>
                  {enumOptions(CarType)}
                </select>
              </div>

              <div>
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

              <div>
                <label className="block text-sm font-semibold mb-1">
                  สถานะรถ
                </label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">สถานะ</option>
                  {enumOptions(Status)}
                </select>
              </div>

              {isEditMode && (
                <label className="label cursor-pointer">
                  <span className="label-text text-red-500">ลบรถนี้</span>
                  <input
                    type="checkbox"
                    name="isDelete"
                    checked={formik.values.}
                    onChange={formik.handleChange}
                    className="checkbox checkbox-error ml-2"
                  />
                </label>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />

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

/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CarStatus, CarType, EngineType, GearType } from "@/@types/Status";
import {
  useCreateCarMutation,
  useGetCarByIdQuery,
  useUpdateCarMutation,
} from "@/services/carApi";
import { baseUrl } from "@/utility/SD";
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
import { useGetSellerAllQuery, useGetSellerByUserIdQuery } from "@/services/sellerApi";
import { SelectFieldWithImage } from "../selectField/SelectFieldWithImage";
import { CarCreateDto, CarUpdateDto } from "@/@types/Dto";
import { useAppSelector } from "@/hooks/useAppHookState";
import { SD_Roles } from "@/@types/Status";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/car";
const MAX_FILE_SIZE_MB = 5;

type CarFormValues = typeof baseInitialValues & {
  isUsed?: boolean;
  isDeleted?: boolean;
};

const baseInitialValues = {
  brandId: "",
  sellerId: 1,
  carRegistrationNumber: "",
  carIdentificationNumber: "",
  engineNumber: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  bookingPrice: 0,
  mileage: 0,
  color: "",
  engineType: "", 
  gearType: "",   
  carType: "",    
  carStatus: "",  
  description: "",
  isCollisionHistory: false,
  insurance: "",
  act: "",
  newImages: undefined as File[] | undefined,
};

export default function CarForm() {
  const router = useRouter();
  const carId = useParams()?.id;
  const isEditMode = Boolean(carId);

  const { role, userId } = useAppSelector((state) => state.auth);
  const isAdmin = role === SD_Roles.Role_Admin;
  const isSeller = role === SD_Roles.Role_Seller;

  const { data: result, isLoading } = useGetCarByIdQuery(Number(carId), { skip: !isEditMode });
  const { data: brands } = useGetBrandAllQuery({ pageNumber: 1, pageSize: 100 });
  const { data: sellerData } = useGetSellerByUserIdQuery(userId, { skip: !isSeller || !userId });
  const { data: sellersData } = useGetSellerAllQuery({ pageNumber: 1, pageSize: 100 }, { skip: !isAdmin });

  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<CarFormValues>({
    ...baseInitialValues,
    ...(isEditMode && { isUsed: false, isDeleted: false }),
  });

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        ...baseInitialValues, 
        ...result,            
        brandId: result.brandId?.toString() ?? "", 
        newImages: undefined, 
      });
    }
  }, [isEditMode, result]);

  // Auto-set sellerId สำหรับ Seller role
  useEffect(() => {
    if (isSeller && sellerData?.id) {
      setInitialValues((prev) => ({ ...prev, sellerId: sellerData.id! }));
    }
  }, [isSeller, sellerData]);

  useEffect(() => {
    if (isEditMode && result?.carImages?.[0]) {
      setPreviewUrl(baseUrl + result.carImages[0]);
    }
  }, [isEditMode, result?.carImages]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (values: CarFormValues) => {
    const mappedValues = {
      brandId: Number(values.brandId), 
    };

    try {
      if (isEditMode) {
        const updatePayload: CarUpdateDto = { 
          ...values, 
          ...mappedValues, 
          updatedAt: new Date().toISOString() 
        } as CarUpdateDto;

        await updateCar({ carId: Number(carId), data: updatePayload }).unwrap();
        await showAlert("อัปเดตรถสำเร็จ");
      } else {
        const createPayload: CarCreateDto = { 
          ...values, 
          ...mappedValues, 
          createdAt: new Date().toISOString() 
        } as CarCreateDto;

        await createCar(createPayload).unwrap();
        await showAlert("เพิ่มรถสำเร็จ");
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
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        MySwal.fire({
          icon: "warning",
          title: "ไฟล์มีขนาดใหญ่เกินไป",
          text: `กรุณาอัปโหลดรูปภาพที่มีขนาดไม่เกิน ${MAX_FILE_SIZE_MB}MB`,
        });
        event.target.value = "";
        return;
      }

      formik.setFieldValue("newImages", [file]);
      setPreviewUrl(URL.createObjectURL(file)); 
    } else {
      formik.setFieldValue("newImages", undefined);
      setPreviewUrl(null);
    }
  };

  const formik = useFormik<CarFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: isEditMode ? updateValidationSchema : createValidationSchema,
    onSubmit: handleSubmit,
  });

  const brandOptions = brands?.result
    ?.filter((brand) => brand.isUsed && brand.id !== undefined)
    .map((brand) => ({
      value: brand.id!.toString(),
      label: brand.name,
      imageUrl: baseUrl + brand.carImages,
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
              {/* เจ้าของรถ (Admin เลือก Seller, Seller เห็นชื่อตัวเอง) */}
              {isAdmin && (
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">เจ้าของรถ (ผู้จำหน่าย)</label>
                  <select
                    className="select select-bordered w-full"
                    value={formik.values.sellerId}
                    onChange={(e) => formik.setFieldValue("sellerId", Number(e.target.value))}
                  >
                    <option value={0}>-- เลือกผู้จำหน่าย --</option>
                    {sellersData?.result
                      ?.filter((s) => s.isVerified)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.user?.fullName} ({s.user?.email})
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {isSeller && (
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">เจ้าของรถ (ผู้จำหน่าย)</label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200"
                    value={sellerData?.user?.fullName ?? "กำลังโหลด..."}
                    readOnly
                    disabled
                  />
                </div>
              )}

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
                  เลขทะเบียนรถยนต์
                </label>
                <input
                  type="text"
                  name="carRegistrationNumber"
                  placeholder="กรอกป้ายทะเบียน เช่น กค-8888 กทม"
                  value={formik.values.carRegistrationNumber}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* หมายเลขตัวถัง */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  หมายเลขตัวถัง (VIN) 17 หลัก
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
                  หมายเลขเครื่องยนต์
                </label>
                <input
                  type="text"
                  name="engineNumber"
                  placeholder="เช่น 1NZ1234567"
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
                  ปีที่ผลิต (Year)
                </label>
                <input
                  type="number"
                  name="year"
                  placeholder="เช่น 2022"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* ราคารถยนต์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ราคารถยนต์ (บาท)
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

              {/* ราคาจอง */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ราคาจองรถยนต์ (บาท)
                </label>
                <input
                  type="number"
                  name="bookingPrice"
                  placeholder="กรอกราคาจองรถยนต์"
                  value={formik.values.bookingPrice}
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

              {/* เครื่องยนต์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ประเภทเครื่องยนต์
                </label>
                {/* 🚀 แก้ไข: นำ ?.toString() และ Number(v) ออก */}
                <SelectField
                  value={formik.values.engineType}
                  onChange={(v) => formik.setFieldValue("engineType", v === "" ? undefined : v)}
                  options={enumToOptionsWithLabels(EngineType, engineTypeLabels)}
                />
              </div>

              {/* เกียร์ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ระบบเกียร์
                </label>
                {/* 🚀 แก้ไข: นำ ?.toString() และ Number(v) ออก */}
                <SelectField
                  value={formik.values.gearType}
                  onChange={(v) => formik.setFieldValue("gearType", v === "" ? undefined : v)}
                  options={enumToOptionsWithLabels(GearType, GearTypeLabels)}
                />
              </div>

              {/* ประเภทรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ประเภทรถยนต์
                </label>
                {/* 🚀 แก้ไข: นำ ?.toString() และ Number(v) ออก */}
                <SelectField
                  value={formik.values.carType}
                  onChange={(v) => formik.setFieldValue("carType", v === "" ? undefined : v)}
                  options={enumToOptionsWithLabels(CarType, carTypeLabels)}
                  placeholder="เลือกประเภทรถของคุณ"
                />
              </div>

              {/* สถานะรถ */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  สถานะรถ
                </label>
                {/* 🚀 แก้ไข: นำ ?.toString() และ Number(v) ออก */}
                <SelectField
                  value={formik.values.carStatus}
                  onChange={(v) => formik.setFieldValue("carStatus", v === "" ? undefined : v)}
                  options={enumToOptionsWithLabels(CarStatus, statusLabels)}
                  placeholder="เลือกสถานะรถ"
                />
              </div>

              {/* ประกันภัย (Insurance) */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  ประกันภัยรถยนต์
                </label>
                <input
                  type="text"
                  name="insurance"
                  placeholder="เช่น ป.1 หมดอายุ 12/2026"
                  value={formik.values.insurance}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* พ.ร.บ. (Act) */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">
                  พ.ร.บ. (ACT)
                </label>
                <input
                  type="text"
                  name="act"
                  placeholder="ระบุรายละเอียด พ.ร.บ."
                  value={formik.values.act}
                  onChange={formik.handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              {/* คำอธิบาย */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">
                  คำอธิบายเพิ่มเติม
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="กรอกคำอธิบายเพิ่มเติมเกี่ยวกับรถ"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              {/* Checkboxes ด้านล่าง (ชนหนัก / ใช้งาน / ลบ) */}
              <div className="col-span-2 flex flex-wrap gap-6">
                
                <label className="label cursor-pointer flex gap-2">
                  <input
                    type="checkbox"
                    name="isCollisionHistory"
                    checked={formik.values.isCollisionHistory}
                    onChange={formik.handleChange}
                    className="checkbox checkbox-warning"
                  />
                  <span className="label-text font-semibold">มีประวัติการชนหนัก/พลิกคว่ำ/จมน้ำ</span>
                </label>

                {isEditMode && (
                  <>
                    <label className="label cursor-pointer flex gap-2">
                      <input
                        type="checkbox"
                        name="isUsed"
                        checked={formik.values.isUsed}
                        onChange={formik.handleChange}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text">เปิดใช้งานรถคันนี้</span>
                    </label>

                    <label className="label cursor-pointer flex gap-2">
                      <input
                        type="checkbox"
                        name="isDeleted"
                        checked={formik.values.isDeleted}
                        onChange={formik.handleChange}
                        className="checkbox checkbox-error"
                      />
                      <span className="label-text text-error">ลบรถคันนี้</span>
                    </label>
                  </>
                )}
              </div>

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
              <div className="col-span-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full text-lg flex justify-center items-center gap-2"
                  disabled={formik.isSubmitting}
                >
                  {/* 🚀 เพิ่ม Loading Spinner */}
                  {formik.isSubmitting && <span className="loading loading-spinner loading-sm"></span>}
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
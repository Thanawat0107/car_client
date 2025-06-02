/* eslint-disable @next/next/no-img-element */
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
import { Seller } from "@/@types/dto/Seller";
import {
  SellerCreateFormValues,
  SellerUpdateFormValues,
} from "./SellerFormValues";

const MySwal = withReactContent(Swal);
const redirectPath = "/manages/seller";
const baseInitialValues = {
  userId: "",
  identityNumber: "",
  address: "",
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

  const [initialValues, setInitialValues] = useState<
    SellerCreateFormValues | SellerUpdateFormValues
  >(
    isEditMode
      ? {
          ...baseInitialValues,
          isVerified: false,
        }
      : {
          ...baseInitialValues,
          isVerified: false,
        }
  );

  useEffect(() => {
    if (isEditMode && result) {
      setInitialValues({
        userId: result.userId || "",
        identityNumber: result.identityNumber || "",
        address: result.address || "",
        isVerified: result.isVerified,
      } as SellerUpdateFormValues);
    }
  }, [isEditMode, result]);

  const handleSubmit = async (
    values: SellerCreateFormValues | SellerUpdateFormValues
  ) => {
    if (isEditMode) {
      const payload: Seller = {
        ...(values as SellerUpdateFormValues),
        id: Number(sellerId),
      };

      await updateSeller({
        sellerId: payload.id,
        sellerData: payload,
      }).unwrap();
      await showAlert("อัปเดตข้อมูลผู้ขายสำเร็จ");
    } else {
      await createSeller(values as SellerCreateFormValues).unwrap();
      await showAlert("เพิ่มข้อมูลผู้ขายสำเร็จ");
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

  const formik = useFormik<SellerCreateFormValues | SellerUpdateFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema: isEditMode ? validationSchema : validationSchema,
    onSubmit: handleSubmit,
  });

  if (isEditMode && isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isEditMode ? "แก้ไขข้อมูลผู้ขาย" : "เพิ่มข้อมูลผู้ขาย"}
          </h2>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              value={formik.values.userId}
              onChange={formik.handleChange}
              className="input input-bordered w-full"
            />

            <input
              type="text"
              name="identityNumber"
              placeholder="เลขบัตรประชาชน"
              value={formik.values.identityNumber}
              onChange={formik.handleChange}
              className="input input-bordered w-full"
            />

            <textarea
              name="address"
              placeholder="ที่อยู่"
              value={formik.values.address}
              onChange={formik.handleChange}
              className="textarea textarea-bordered w-full"
              rows={4}
            />

            {isEditMode && (
              <div className="col-span-2 md:col-span-1">
                <label className="label cursor-pointer">
                  <span className="label-text">อนุญาติ</span>
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={
                      (formik.values as SellerUpdateFormValues).isVerified
                    }
                    onChange={formik.handleChange}
                    className="checkbox ml-2 mr-3"
                  />
                </label>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={formik.isSubmitting}
            >
              {isEditMode ? "อัปเดตข้อมูล" : "เพิ่มข้อมูล"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
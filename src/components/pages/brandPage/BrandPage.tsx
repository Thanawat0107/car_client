/* eslint-disable @next/next/no-img-element */

import { useAppDispatch, useAppSelector } from "@/hooks/useAppHookState";
import { useGetBrandAllQuery } from "@/services/brandApi";
import { setBrands } from "@/stores/slices/brandSlice";
import { baseUrl } from "@/utility/SD";
import React, { useEffect } from "react";

export default function BrandPage() {
  const dispatch = useAppDispatch();
  const { data: result, error, isLoading } = useGetBrandAllQuery(null);
  const brands = useAppSelector((state) => state.brand.brands);

  useEffect(() => {
    if (result && !error) {
      dispatch(setBrands(result.result));
    }
  }, [result, error, dispatch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error) return <div>เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-800 mb-4">
        ค้นหารถยนต์มือสอง
      </h1>
      <p className="text-gray-700 mb-10">
        ค้นหารถยนต์มือสองที่ถูกใจ กับ CarMS แหล่งซื้อขายรถยนต์มือสอง
        พร้อมให้คุณเลือกได้ทั้งประเภท และช่วงราคาที่คุณต้องการ
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">
          แบรนด์
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands
            .filter((brand) => brand.isUsed && !brand.isDelete)
            .map((brand) => (
              <div
                key={brand.id}
                className="border rounded-lg p-4 flex flex-col items-center hover:shadow-md transition"
              >
                <img
                  src={baseUrl + brand.imageUrl}
                  alt={brand.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <p className="text-teal-700 font-medium text-sm text-center">
                  {brand.name}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

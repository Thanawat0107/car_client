/* eslint-disable @next/next/no-img-element */
'use client';

import { Car } from "@/@types/Dto/Car";
import { baseUrl } from "@/utility/SD";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { usePrefetch } from "@/services/carApi";

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  const router = useRouter();
  const prefetchCarById = usePrefetch('getCarById', { ifOlderThan: 60 });

   const handleClick = () => {
    router.push(`/car/${car.id}`);
  };

  const handleMouseEnter = useCallback(() => {
    prefetchCarById(car.id);
  }, [car.id, prefetchCarById]);

  // 🚀 จัดการรูปภาพ ดึงรูปแรกจาก Array หรือใช้รูป Placeholder
  const mainImage = car.carImages && car.carImages.length > 0
    ? baseUrl + car.carImages[0]
    : "/placeholder.png";

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 w-full cursor-pointer overflow-hidden flex flex-col h-full group"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={car.model || "Car Image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* 🚀 ป้ายกำกับ Test Drive */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm shadow-sm tracking-wider z-10">
          TEST DRIVE
        </span>

        {/* 🚀 แสดง Overlay ถ้ารถไม่ว่าง (เช่น ถูกจอง หรือ ขายแล้ว) */}
        {car.carStatus !== "Available" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-bold px-4 py-1.5 rounded shadow-md transform -rotate-12 text-lg border-2 border-white">
              {car.carStatus === "Booked" ? "จองแล้ว" : "ขายแล้ว"}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* 🚀 ใช้ optional chaining (?.) เพื่อป้องกัน Error กรณีไม่มีข้อมูล Brand */}
        <h2 className="text-[15px] font-bold text-gray-800 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {car.year} {car.brand?.name} {car.model}
        </h2>
        <p className="text-xs text-gray-400 mb-2 font-medium">ไม่รวมภาษีมูลค่าเพิ่ม</p>
        
        <div className="mt-auto pt-2">
          <p className="text-xl font-black text-green-600 mb-3">
            ฿ {car.price.toLocaleString()}
          </p>

          <div className="flex flex-wrap text-xs text-gray-600 gap-x-3 gap-y-2 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1.5 font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <span className="text-sm">🚗</span>
              {car.mileage?.toLocaleString() ?? 0} กม.
            </div>
            <div className="flex items-center gap-1.5 font-medium bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              <span className="text-sm">🎨</span>
              สี{car.color || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @next/next/no-img-element */
'use client';

import { Car } from "@/@types/dto/Car";
import { baseUrl } from "@/utility/SD";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  const router = useRouter();

   const handleClick = () => {
    router.push(`/car/${car.id}`);
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow hover:shadow-md transition-shadow duration-300 w-full">
      <div className="relative" onClick={handleClick}>
        <img
          src={baseUrl + car.imageUrl}
          alt={car.model}
          className="aspect-[4/3] w-full object-cover rounded-t-xl"
        />
        <span className="absolute top-2 left-2 bg-[var(--color-accent)] text-white text-xs font-semibold px-2 py-1 rounded">
          TEST DRIVE
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-1 leading-tight">
          {car.year} {car.brand.name} {car.model}
        </h2>
        <p className="text-xs text-gray-500 mb-1">ไม่รวมภาษีมูลค่าเพิ่ม</p>
        <p className="text-lg font-bold text-[var(--color-accent)] mb-2">
          ฿ {car.price.toLocaleString()}
        </p>

        <div className="flex flex-wrap text-xs text-gray-600 gap-x-2 gap-y-1">
          <div className="flex items-center gap-1">
            <span>🚗</span>
            {car.mileage.toLocaleString()} กม.
          </div>
          <div className="flex items-center gap-1">
            <span>🎨</span>
            สี {car.color}
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
'use client';

import { CarDto } from "@/@types/dto/CarDto";
import React from "react";

interface Props {
  car: CarDto;
}

export default function CarCard({ car }: Props) {
  return (
    <div className="w-80 bg-gray-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={car.imageUrl}
          alt={car.model}
          className="h-48 w-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-[var(--color-accent)] text-white text-xs font-semibold px-2 py-1 rounded">
          TEST DRIVE
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-base font-semibold mb-1">
          {car.year} {car.brand.name} {car.model}
        </h2>
        <p className="text-sm text-gray-500 mb-2">ไม่รวมภาษีมูลค่าเพิ่ม</p>
        <p className="text-xl font-bold text-[var(--color-accent)] mb-2">
          ฿ {car.price.toLocaleString()}
        </p>

        {/* Additional details */}
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

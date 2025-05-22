/* eslint-disable @next/next/no-img-element */

import { CarType } from "@/@types/Enum";
import React from "react";

const categories: { label: string; image: string; type: CarType }[] = [
  { label: "รถเก๋ง 4 ประตู", image: "/images/CarType/sedan.jpg", type: CarType.FourDoorSedan },
  { label: "รถกระบะ", image: "/images/CarType/pickup.jpeg", type: CarType.PickUpTruck },
  { label: "รถยนต์ SUV", image: "/images/CarType/suv.jpg", type: CarType.CarSUV },
  { label: "รถตู้", image: "/images/CarType/van.jpg", type: CarType.CarVan },
];

const priceRanges = [
  { label: "ต่ำกว่า 500,000", value: "<500000" },
  { label: "500,000 - 750,000", value: "500000-750000" },
  { label: "750,000 - 1,000,000", value: "750000-1000000" },
  { label: "1,000,000 - มากกว่า", value: ">1000000" },
];

export default function TypePage() {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-800 mb-4">
        ค้นหารถยนต์มือสอง
      </h1>
      <p className="text-gray-700 mb-10">
        ค้นหารถยนต์มือสองที่ถูกใจ กับ gurumalist แหล่งซื้อขายรถยนต์มือสอง
        พร้อมให้คุณเลือกได้ทั้งประเภท และช่วงราคาที่คุณต้องการ
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">
          ประเภทรถยนต์
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
            >
              <img src={cat.image} alt={cat.label} className="w-16 h-16 mb-2" />
              <p className="text-teal-700 font-medium">{cat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">ช่วงราคา</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              className="border rounded-lg py-4 px-2 text-center hover:bg-teal-50 text-teal-700"
            >
              <div className="text-2xl mb-1">💲</div>
              <span>{range.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

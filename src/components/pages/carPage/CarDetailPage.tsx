/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetCarByIdQuery } from "@/services/carApi";
import {
  Share2,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function CarDetailPage() {
  const params = useParams();
  const carId = Number(params?.id);

  const { data: car, isLoading, error } = useGetCarByIdQuery(carId);

  if (isLoading) return <p className="p-4">กำลังโหลด...</p>;
  if (error || !car) return <p className="p-4 text-red-500">ไม่พบรถยนต์</p>;

  return (
   <div className="max-w-7xl mx-auto p-6 lg:py-10 grid lg:grid-cols-12 gap-8 bg-gray-50 min-h-screen">
      {/* Left Section - img & thumbnails */}
      <div className="lg:col-span-7 space-y-4">
        <img
          src={car.imageUrl}
          alt={car.model}
          width={800}
          height={500}
          className="rounded-xl shadow-lg w-full object-cover"
        />
        {/* ลบ .map() หาก car.imageUrl เป็น string เดี่ยว */}
        {/* <div className="flex gap-3 overflow-x-auto">
          {[car.imageUrl].map((imageUrl, i) => (
            <img
              key={i}
              src={imageUrl}
              alt={`car thumb ${i}`}
              width={100}
              height={70}
              className="rounded border border-gray-300 hover:scale-105 transition"
            />
          ))}
        </div> */}

        <div className="flex gap-4 mt-4">
          <button className="bg-blue-600 text-white w-full py-2 rounded">🚗 CAR LIVE TOUR</button>
          <button className="bg-green-600 text-white w-full py-2 rounded">🛞 ทดลองขับ</button>
        </div>
      </div>

      {/* Right Section - Car Info */}
      <div className="lg:col-span-5 space-y-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {car.model}
        </h1>

        <div className="bg-white rounded-lg p-6 border shadow-sm space-y-4">
          <p className="text-lg font-semibold text-green-600">ราคาขาย</p>
          <p className="text-3xl font-bold text-gray-800">
            {car.price.toLocaleString()} บาท
          </p>
          <div className="text-sm text-gray-500">
            หมายเหตุ: ราคานี้ไม่รวมภาษีมูลค่าเพิ่ม
          </div>

          <div className="border-t pt-4 space-y-3">
            <label className="flex items-center gap-2 text-gray-700">
              <input type="radio" />
              <span>จองมัดจำ</span>
              <span className="ml-auto text-green-700 font-medium">
                {car.reservationPrice?.toLocaleString() || "-"} บาท
              </span>
            </label>
            <button className="bg-emerald-600 text-white w-full py-2 rounded">จองรถคันนี้</button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <ul className="space-y-3 text-sm text-gray-700">
            <li><b>เจ้าของรถ:</b> {car.seller?.userId}</li>
            <li><b>ยี่ห้อ:</b> {car.brand?.name}</li>
            <li><b>รุ่น:</b> {car.model}</li>
            <li><b>carRegistrationNumber:</b> {car.carRegistrationNumber}</li>
            <li><b>carIdentificationNumber:</b> {car.carIdentificationNumber}</li>
            <li><b>engineNumber:</b> {car.engineNumber}</li>
            <li><b>ปี:</b> {car.year}</li>
            <li><b>ไมล์:</b> {car.mileage.toLocaleString()} กม.</li>
            <li><b>สี:</b> {car.color}</li>
            <li><b>description:</b> {car.description}</li>
            <li><b>status:</b> {car.status}</li>
            <li><b>engineType:</b> {car.engineType}</li>
            <li><b>gearType:</b> {car.gearType}</li>
            <li><b>carType:</b> {car.carType}</li>
            {/* <li><b>จังหวัด:</b> {car.location}</li> */}
          </ul>
        </div>

        <div className="flex gap-3">
          <button className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded">📞 โทร</button>
          <button className="w-full bg-green-500 text-white py-2 rounded">💬 LINE ID</button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-500 flex justify-center items-center gap-2 cursor-pointer hover:text-blue-600">
          <Share2 size={16} />
          แชร์กับผู้ขาย
        </div>
      </div>
    </div>
  );
}
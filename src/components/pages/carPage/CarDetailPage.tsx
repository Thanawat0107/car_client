/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetCarByIdQuery } from "@/services/carApi";
import { Share2, AlertTriangle, ShieldCheck, FileText, CalendarClock } from "lucide-react";
import { useParams } from "next/navigation";
import { baseUrl } from "@/utility/SD";
import {
  carTypeLabels,
  engineTypeLabels,
  GearTypeLabels,
  statusLabels,
} from "../filters/CarFilters"; 
import { getEnumLabel } from "@/utility/enumHelpers";
import { useState } from "react";

export default function CarDetailPage() {
  const params = useParams();
  const carId = Number(params?.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // 🚀 เพิ่ม State สำหรับจัดการการเลือกรูปหลัก

  const { data: car, isLoading, error } = useGetCarByIdQuery(carId);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error || !car)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 text-red-500 font-bold text-xl">
        ไม่พบข้อมูลรถยนต์
      </div>
    );

  // 🚀 จัดการรูปภาพ (ใช้ carImages จาก DTO ใหม่) และรองรับการเปลี่ยนรูปหลัก
  const mainImage =
    car.carImages && car.carImages.length > 0
      ? baseUrl + car.carImages[activeImageIndex]
      : "/placeholder.png";

  const displayCarType = getEnumLabel(car.carType, carTypeLabels);
  const displayEngineType = getEnumLabel(car.engineType, engineTypeLabels);
  const displayGearType = getEnumLabel(car.gearType, GearTypeLabels);
  const displayStatus = getEnumLabel(car.carStatus, statusLabels);

  // 🚀 ฟังก์ชันจัดรูปแบบวันที่ให้อ่านง่าย
  const formatDate = (dateString: string) => {
    if (!dateString) return "ไม่ระบุ";
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:py-10 grid lg:grid-cols-12 gap-8 bg-gray-50 min-h-screen">
      {/* ─── ฝั่งซ้าย: รูปภาพ & ปุ่ม Action ─── */}
      <div className="lg:col-span-7 space-y-4">
        {/* รูปหลัก */}
        <div className="relative">
          <img
            src={mainImage}
            alt={car.model}
            className="rounded-xl shadow-lg w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover bg-white transition-opacity duration-300"
          />
          {/* แสดงป้ายกำกับสถานะรถบนรูป */}
          {car.carStatus !== "Available" && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md opacity-90">
              {displayStatus}
            </div>
          )}
        </div>

        {/* 🚀 รูป Thumbnails (ถ้ามีรูปมากกว่า 1 รูป) และทำให้กดเปลี่ยนรูปหลักได้ */}
        {car.carImages && car.carImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-2 custom-scrollbar">
            {car.carImages.map((img, i) => (
              <img
                key={i}
                src={baseUrl + img}
                alt={`car thumb ${i}`}
                onClick={() => setActiveImageIndex(i)} // 🚀 ทำให้คลิกเปลี่ยนรูปได้
                className={`w-24 h-16 sm:w-32 sm:h-20 rounded-lg border object-cover cursor-pointer hover:scale-105 transition shadow-sm ${
                  activeImageIndex === i ? 'border-primary border-2 opacity-100' : 'border-gray-200 opacity-60'
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-3 rounded-lg shadow-sm transition">
            🚗 CAR LIVE TOUR
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-3 rounded-lg shadow-sm transition">
            🛞 นัดหมายทดลองขับ
          </button>
        </div>
      </div>

      {/* ─── ฝั่งขวา: ข้อมูลรถยนต์ ─── */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            {car.brand?.name} {car.model}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
              ปี {car.year}
            </span>
            {/* 🚀 แสดงวันที่อัปเดตข้อมูลล่าสุด */}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CalendarClock size={14} />
              อัปเดตล่าสุด: {formatDate(car.updatedAt)}
            </span>
          </div>
        </div>

        {/* กล่องราคาและการจอง */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold text-green-600 mb-1">ราคาขาย</p>
              <p className="text-4xl font-black text-gray-800">
                {car.price.toLocaleString()} ฿
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  car.carStatus === "Available"
                    ? "bg-green-100 text-green-700"
                    : car.carStatus === "Booked"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {displayStatus}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            * ราคานี้อาจยังไม่รวมค่าธรรมเนียมและภาษีมูลค่าเพิ่ม
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4 mt-2">
            <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
              <input type="radio" className="radio radio-primary radio-sm" defaultChecked />
              <span className="font-medium">จองมัดจำรถคันนี้</span>
              <span className="ml-auto text-primary font-bold text-lg">
                {car.bookingPrice?.toLocaleString() || "0"} ฿
              </span>
            </label>
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full py-3.5 rounded-xl shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={car.carStatus !== "Available"}
            >
              {car.carStatus === "Available" ? "ดำเนินการจองรถ" : "รถคันนี้ไม่ว่าง"}
            </button>
          </div>
        </div>

        {/* กล่องข้อมูลจำเพาะ */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">ข้อมูลจำเพาะ</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="text-gray-500 block mb-1">เลขทะเบียน</span>
              <span className="font-semibold text-gray-800">{car.carRegistrationNumber || "ไม่ระบุ"}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">เลขไมล์</span>
              <span className="font-semibold text-gray-800">{car.mileage.toLocaleString()} กม.</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">สีรถ</span>
              <span className="font-semibold text-gray-800">{car.color}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">ประเภทรถ</span>
              <span className="font-semibold text-gray-800">{displayCarType}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">เครื่องยนต์</span>
              <span className="font-semibold text-gray-800">{displayEngineType}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">ระบบเกียร์</span>
              <span className="font-semibold text-gray-800">{displayGearType}</span>
            </div>
            
            {/* 🚀 รหัสตัวถังและเครื่องยนต์ */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 border-t border-gray-100 pt-4 mt-2">
              <div>
                <span className="text-gray-500 block mb-1">รหัสตัวถัง (VIN)</span>
                <span className="font-mono text-gray-700 text-xs bg-gray-100 px-2 py-1 rounded select-all block w-max">
                  {car.carIdentificationNumber || "ไม่มีข้อมูล"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">หมายเลขเครื่องยนต์</span>
                <span className="font-mono text-gray-700 text-xs bg-gray-100 px-2 py-1 rounded select-all block w-max">
                  {car.engineNumber || "ไม่มีข้อมูล"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* กล่องข้อมูลเพิ่มเติม (ประกัน, พรบ, ประวัติชน) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">ข้อมูลเพิ่มเติม</h3>
          
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-blue-500 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-800">ประกันภัย</p>
              <p className="text-sm text-gray-600">{car.insurance || "ไม่มีข้อมูล"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="text-green-500 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-800">พ.ร.บ. (ACT)</p>
              <p className="text-sm text-gray-600">{car.act || "ไม่มีข้อมูล"}</p>
            </div>
          </div>

          {car.isCollisionHistory && (
            <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertTriangle className="text-red-500 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-red-800">ประวัติการชน</p>
                <p className="text-sm text-red-600">รถคันนี้มีประวัติการชนหนัก พลิกคว่ำ หรือจมน้ำ</p>
              </div>
            </div>
          )}

          {car.description && (
            <div className="pt-3">
              <p className="text-sm font-semibold text-gray-800 mb-1">รายละเอียดจากผู้ขาย</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed whitespace-pre-wrap">
                {car.description}
              </p>
            </div>
          )}
        </div>

        {/* กล่องแสดงชื่อผู้ขาย (Seller) */}
        {car.seller && (
          <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">จัดจำหน่ายโดย</p>
              <p className="font-bold text-gray-800 text-lg">{car.seller.user?.userName ?? "ตัวแทนจำหน่ายมาตรฐาน"}</p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <ShieldCheck size={14} />
              Verified Seller
            </div>
          </div>
        )}

        {/* ปุ่มติดต่อผู้ขาย */}
        <div className="flex gap-3 pt-2">
          <button className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-xl shadow transition">
            📞 โทรหาผู้ขาย
          </button>
          <button className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-semibold py-3 rounded-xl shadow transition">
            💬 แอดไลน์
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-gray-500 flex justify-center items-center gap-2 cursor-pointer hover:text-blue-600 transition">
          <Share2 size={16} />
          <span>แชร์ลิงก์รถคันนี้</span>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { useGetBrandAllQuery } from "@/services/brandApi";
import { useRouter } from "next/navigation";
import Pagination from "../pagination/Pagination";
import BrandFilters, { BrandSearchParams } from "../filters/BrandFilters";
import { baseUrl } from "@/utility/SD";

export default function BrandPage() {
  const router = useRouter();

  // 1. State สำหรับฟิลเตอร์และค้นหาแบรนด์
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<BrandSearchParams>({
    pageNumber: 1,
    pageSize: 12, // แสดง 12 แบรนด์ต่อหน้า (แบ่ง Grid ลงตัว)
    sortBy: "id",
  });

  // 2. ดึงข้อมูลแบรนด์ทั้งหมดในรอบเดียว
  const { data: result, isLoading, error } = useGetBrandAllQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const allBrands = result?.result ?? [];

  // 3. 🚀 Logic จัดการข้อมูลและกรองฝั่ง Client
  const filteredBrands = useMemo(() => {
    let data = [...allBrands];

    // กรองเอาเฉพาะแบรนด์ที่เปิดใช้งานและไม่ได้ถูกลบ (สำหรับหน้าบ้านลูกค้า)
    data = data.filter((b) => b.isUsed && !b.isDelete);

    // กรองคำค้นหา (ค้นหาตามชื่อแบรนด์)
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((b) => b.name && b.name.toLowerCase().includes(q));
    }

    // จัดเรียง (Sorting)
    switch (filters.sortBy) {
      case "name":
        data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "nameDesc":
        data.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "id":
      default:
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
    }

    return data;
  }, [allBrands, filters.sortBy, search]);

  // 4. 🚀 Logic แบ่งหน้า (Pagination) ฝั่ง Client
  const pagedBrands = useMemo(() => {
    const start = (filters.pageNumber - 1) * filters.pageSize;
    return filteredBrands.slice(start, start + filters.pageSize);
  }, [filteredBrands, filters.pageNumber, filters.pageSize]);

  const paginationMeta = {
    TotalCount: filteredBrands.length,
    PageSize: filters.pageSize,
    CurrentPage: filters.pageNumber,
    TotalPages: Math.ceil(filteredBrands.length / filters.pageSize),
    HasNext: filters.pageNumber < Math.ceil(filteredBrands.length / filters.pageSize),
    HasPrevious: filters.pageNumber > 1,
  };

  if (isLoading) return <p className="p-10 text-center text-gray-500 font-bold text-xl">กำลังโหลดข้อมูลแบรนด์...</p>;
  if (error) return <p className="p-10 text-center text-red-500 font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ส่วนหัวของหน้า */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl text-gray-800 font-extrabold mb-3">
            แบรนด์รถยนต์ชั้นนำ
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            ค้นหารถยนต์มือสองที่ถูกใจผ่านแบรนด์ที่คุณไว้วางใจ กับ CarMS แหล่งซื้อขายรถยนต์มือสองที่ได้มาตรฐาน
          </p>
        </div>

        {/* ตัวกรองข้อมูล */}
        <BrandFilters
          filters={filters}
          setFilters={setFilters}
          search={search}
          setSearch={setSearch}
        />

        {/* จำนวนที่พบ */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-700">รายการแบรนด์</h2>
          <span className="text-gray-500 text-sm font-medium bg-gray-200 px-3 py-1 rounded-full">
            พบ {filteredBrands.length} แบรนด์
          </span>
        </div>

        {/* 🚀 Grid แสดงรายการแบรนด์ */}
        {pagedBrands.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {pagedBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => router.push(`/brand/${brand.id}`)} // กดแล้วไปหน้ารายละเอียดของแบรนด์นั้น (ถ้ามี)
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="h-20 w-20 flex items-center justify-center mb-4">
                  <img
                    src={brand.carImages ? baseUrl + brand.carImages : "/placeholder.png"}
                    alt={brand.name || "Brand Image"}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-gray-800 font-bold text-center group-hover:text-primary transition-colors">
                  {brand.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State กรณีค้นหาไม่เจอ (เลียนแบบหน้า CarPage) */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <span className="text-5xl mb-4">🏷️</span>
            <p className="text-xl text-gray-500 font-semibold">
              ไม่พบแบรนด์รถยนต์ที่ตรงกับเงื่อนไข
            </p>
            <button 
              onClick={() => {
                setFilters({ pageNumber: 1, pageSize: 12, sortBy: "id" });
                setSearch("");
              }}
              className="mt-4 btn btn-outline btn-primary btn-sm"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredBrands.length > filters.pageSize && (
          <div className="mt-10 flex justify-center">
            <Pagination
              pagination={paginationMeta as any}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, pageNumber: p }))}
            />
          </div>
        )}

      </div>
    </div>
  );
}
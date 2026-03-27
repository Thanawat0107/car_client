/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo, useState } from "react";
import { useGetCarAllQuery } from "@/services/carApi";
import { useGetBrandAllQuery } from "@/services/brandApi";
import CarCard from "./CarCard";
import Pagination from "../pagination/Pagination";
import CarFilters, { CarSearchParams } from "../filters/CarFilters";
import { baseUrl } from "@/utility/SD";

export default function CarPage() {
  const [carSearch, setCarSearch] = useState("");
  const [carFilters, setCarFilters] = useState<CarSearchParams>({
    pageNumber: 1,
    pageSize: 12,
    sortBy: "id",
  });

  // 2. State สำหรับแบรนด์
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [brandPage, setBrandPage] = useState(1);
  const brandPageSize = 10;

  // 3. ดึงข้อมูลทั้งหมดในรอบเดียว
  const { data: brandResult, isLoading: brandLoading, error: brandError } = useGetBrandAllQuery({ pageNumber: 1, pageSize: 100 });
  const { data: carResult, isLoading: carLoading, error: carError } = useGetCarAllQuery({ pageNumber: 1, pageSize: 1000 });

  const allBrands = brandResult?.result ?? [];
  const allCars = carResult?.result ?? [];

  // -----------------------------------------
  // 🚀 Logic จัดการข้อมูลแบรนด์ (ซ้ายมือ)
  // -----------------------------------------
  const filteredBrands = useMemo(() => {
    let data = allBrands.filter((b) => b.isUsed && b.id !== undefined);
    if (brandSearch) {
      data = data.filter((b) => b.name && b.name.toLowerCase().includes(brandSearch.toLowerCase()));
    }
    return data;
  }, [allBrands, brandSearch]);

  const pagedBrands = useMemo(() => {
    const start = (brandPage - 1) * brandPageSize;
    return filteredBrands.slice(start, start + brandPageSize);
  }, [filteredBrands, brandPage, brandPageSize]);

  const brandPaginationMeta = {
    TotalCount: filteredBrands.length,
    PageSize: brandPageSize,
    CurrentPage: brandPage,
    TotalPages: Math.ceil(filteredBrands.length / brandPageSize),
    HasNext: brandPage < Math.ceil(filteredBrands.length / brandPageSize),
    HasPrevious: brandPage > 1,
  };

  // -----------------------------------------
  // 🚀 Logic จัดการข้อมูลรถยนต์ (ขวามือ)
  // -----------------------------------------
  const filteredCars = useMemo(() => {
    let data = [...allCars];

    if (selectedBrandId) {
      data = data.filter((c) => c.brandId === selectedBrandId);
    }

    if (carSearch) {
      const q = carSearch.toLowerCase();
      data = data.filter(
        (c) =>
          (c.model && c.model.toLowerCase().includes(q)) ||
          (c.carRegistrationNumber && c.carRegistrationNumber.toLowerCase().includes(q))
      );
    }

    if (carFilters.minPrice !== undefined) data = data.filter((c) => c.price >= carFilters.minPrice!);
    if (carFilters.maxPrice !== undefined) data = data.filter((c) => c.price <= carFilters.maxPrice!);
    if (carFilters.minYear !== undefined) data = data.filter((c) => c.year >= carFilters.minYear!);
    if (carFilters.maxYear !== undefined) data = data.filter((c) => c.year <= carFilters.maxYear!);
    if (carFilters.minMileage !== undefined) data = data.filter((c) => c.mileage >= carFilters.minMileage!);
    if (carFilters.maxMileage !== undefined) data = data.filter((c) => c.mileage <= carFilters.maxMileage!);

    if (carFilters.carType) data = data.filter((c) => c.carType === carFilters.carType);
    if (carFilters.engineType) data = data.filter((c) => c.engineType === carFilters.engineType);
    if (carFilters.gearType) data = data.filter((c) => c.gearType === carFilters.gearType);
    if (carFilters.carStatus) data = data.filter((c) => c.carStatus === carFilters.carStatus);

    switch (carFilters.sortBy) {
      case "price": data.sort((a, b) => a.price - b.price); break;
      case "price_desc": data.sort((a, b) => b.price - a.price); break;
      case "year": data.sort((a, b) => a.year - b.year); break;
      case "yearDesc": data.sort((a, b) => b.year - a.year); break;
      case "mileageAsc": data.sort((a, b) => a.mileage - b.mileage); break;
      case "mileageDesc": data.sort((a, b) => b.mileage - a.mileage); break;
      case "id":
      default: data.sort((a, b) => b.id - a.id); break;
    }

    // กรองเฉพาะรถที่อนุมัติแล้ว
    data = data.filter((c) => c.isApproved);

    return data;
  }, [allCars, carFilters, carSearch, selectedBrandId]);

  const pagedCars = useMemo(() => {
    const start = (carFilters.pageNumber - 1) * carFilters.pageSize;
    return filteredCars.slice(start, start + carFilters.pageSize);
  }, [filteredCars, carFilters.pageNumber, carFilters.pageSize]);

  const carPaginationMeta = {
    TotalCount: filteredCars.length,
    PageSize: carFilters.pageSize,
    CurrentPage: carFilters.pageNumber,
    TotalPages: Math.ceil(filteredCars.length / carFilters.pageSize),
    HasNext: carFilters.pageNumber < Math.ceil(filteredCars.length / carFilters.pageSize),
    HasPrevious: carFilters.pageNumber > 1,
  };

  // -----------------------------------------
  // Handlers
  // -----------------------------------------
  const handleSelectBrand = (id: number) => {
    setSelectedBrandId(id === selectedBrandId ? null : id);
    setCarFilters((prev) => ({ ...prev, pageNumber: 1 }));
  };

  if (brandLoading || carLoading) return <p className="p-10 text-center text-gray-500 font-bold text-xl">กำลังโหลดข้อมูล...</p>;
  if (brandError) return <p className="p-10 text-center text-red-500 font-bold">โหลดแบรนด์ไม่สำเร็จ</p>;
  if (carError) return <p className="p-10 text-center text-red-500 font-bold">โหลดรถยนต์ไม่สำเร็จ</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h1 className="text-3xl text-gray-800 font-extrabold mb-8 text-center md:text-left">
        ค้นหารถยนต์ของเรา
      </h1>

      <CarFilters
        filters={carFilters}
        setFilters={setCarFilters}
        search={carSearch}
        setSearch={setCarSearch}
      />

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* ฝั่งซ้าย: แบรนด์รถยนต์ */}
        <div className="w-full md:w-1/4 lg:w-1/5 bg-white rounded-xl shadow-md p-5 flex flex-col h-fit md:sticky top-24">
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">เลือกตามยี่ห้อ</h2>
          <input
            type="text"
            placeholder="ค้นหายี่ห้อรถ..."
            className="input input-bordered w-full mb-4 focus:outline-primary"
            value={brandSearch}
            onChange={(e) => {
              setBrandSearch(e.target.value);
              setBrandPage(1); 
            }}
          />

          <ul className="flex-1 overflow-y-auto max-h-[400px] space-y-1 pr-2 custom-scrollbar">
            {pagedBrands.length > 0 ? (
              pagedBrands.map((brand) => (
                <li
                  key={brand.id}
                  onClick={() => brand.id !== undefined && handleSelectBrand(brand.id)}
                  className={`cursor-pointer flex items-center gap-3 p-2.5 rounded-lg transition-all font-medium ${
                    selectedBrandId === brand.id
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="bg-white p-1 rounded border border-gray-200">
                    {/* 🚀 แก้ไข: การดึงรูปภาพของ Brand ให้ปลอดภัยขึ้น */}
                    <img
                      src={brand.carImages && brand.carImages.length > 0 ? baseUrl + brand.carImages[0] : "/placeholder.png"}
                      alt={brand.name}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <span className="truncate">{brand.name}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">ไม่พบยี่ห้อรถที่ค้นหา</p>
            )}
          </ul>

          {filteredBrands.length > brandPageSize && (
            <div className="mt-4 flex justify-center border-t pt-4">
              <Pagination
                pagination={brandPaginationMeta as any}
                onPageChange={(p) => setBrandPage(p)}
              />
            </div>
          )}
        </div>

        {/* ฝั่งขวา: แสดงรายการรถยนต์ */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">
              {selectedBrandId 
                ? `รถยนต์ยี่ห้อ ${allBrands.find(b => b.id === selectedBrandId)?.name}` 
                : "รถยนต์ทั้งหมด"}
            </h2>
            <span className="text-gray-500 text-sm font-medium bg-gray-200 px-3 py-1 rounded-full">
              พบ {filteredCars.length} คัน
            </span>
          </div>

          {pagedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pagedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <span className="text-5xl mb-4">🚗</span>
              <p className="text-xl text-gray-500 font-semibold">
                ไม่พบรถยนต์ที่ตรงกับเงื่อนไข
              </p>
              <button 
                onClick={() => {
                  setCarFilters({ pageNumber: 1, pageSize: 12, sortBy: "id" });
                  setCarSearch("");
                  setSelectedBrandId(null);
                }}
                className="mt-4 btn btn-outline btn-primary btn-sm"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}

          {filteredCars.length > carFilters.pageSize && (
            <div className="mt-10 flex justify-center">
              <Pagination
                pagination={carPaginationMeta as any}
                onPageChange={(p) => setCarFilters((prev) => ({ ...prev, pageNumber: p }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
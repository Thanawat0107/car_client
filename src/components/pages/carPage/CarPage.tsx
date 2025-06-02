/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppHookState";
import { useGetCarAllQuery } from "@/services/carApi";
import { setCars } from "@/stores/slices/carSlice";
import CarCard from "./CarCard";
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";
import { defaultCarSearchParams } from "./defaultCarSearchParams";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import Pagination from "../pagination/Pagination";
import CarFilters from "../filters/CarFilters";
import { defaultBrandSearchParams } from "../brandPage/defaultBrandSearchParams";
import { useGetBrandAllQuery } from "@/services/brandApi";
import { baseUrl } from "@/utility/SD";

export default function CarPage() {
  // ฟิลเตอร์รถ
  const [carFilters, setCarFilters] = useState(defaultCarSearchParams);
  const [carSearch, setCarSearch] = useState("");

  // ฟิลเตอร์แบรนด์
  const [brandFilters, setBrandFilters] = useState(defaultBrandSearchParams);
  const [brandSearch, setBrandSearch] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  // debounce search term สำหรับรถยนต์
  const debouncedSetCarSearch = useMemo(
    () =>
      debounce((val: string) => {
        setCarFilters((prev) => ({ ...prev, searchTerm: val, pageNumber: 1 }));
      }, 500),
    []
  );

  // debounce search term สำหรับแบรนด์
  const debouncedSetBrandSearch = useMemo(
    () =>
      debounce((val: string) => {
        setBrandFilters((prev) => ({
          ...prev,
          searchTerm: val,
          pageNumber: 1,
        }));
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSetCarSearch(carSearch);
    return () => debouncedSetCarSearch.cancel();
  }, [carSearch]);

  useEffect(() => {
    debouncedSetBrandSearch(brandSearch);
    return () => debouncedSetBrandSearch.cancel();
  }, [brandSearch]);

  // ปรับ carFilters เมื่อเลือกแบรนด์
  useEffect(() => {
    setCarFilters((prev) => ({
      ...prev,
      brandId: selectedBrandId ?? undefined,
      pageNumber: 1,
    }));
  }, [selectedBrandId]);

  // ดึงข้อมูลแบรนด์ + รถยนต์
  const {
    data: brandResult,
    isLoading: brandLoading,
    error: brandError,
  } = useGetBrandAllQuery(brandFilters);
  const {
    data: carResult,
    isLoading: carLoading,
    error: carError,
  } = useGetCarAllQuery(carFilters);

    const brandOptions =
      brandResult?.result
        .filter((brand) => brand.isUsed)
        .map((brand) => ({
          value: brand.id.toString(),
          label: brand.name,
          imageUrl: baseUrl + brand.imageUrl,
        })) ?? [];

  const cars = carResult?.result ?? [];
  const carPagination = carResult?.meta;

  const brands = brandResult?.result ?? [];
  const brandPagination = brandResult?.meta;

  // เลือกแบรนด์
  const handleSelectBrand = (id: number) => {
    setSelectedBrandId(id === selectedBrandId ? null : id); // toggle เลือก / ยกเลิกเลือก
  };

  // เปลี่ยนหน้าแบรนด์
  const handleBrandPageChange = (page: number) => {
    setBrandFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  // เปลี่ยนหน้ารถ
  const handleCarPageChange = (page: number) => {
    setCarFilters((prev) => ({ ...prev, pageNumber: page }));
  };

  if (brandLoading || carLoading)
    return <p className="p-4 text-gray-500">กำลังโหลด...</p>;
  if (brandError)
    return <p className="p-4 text-red-500">โหลดแบรนด์ไม่สำเร็จ</p>;
  if (carError) return <p className="p-4 text-red-500">โหลดรถไม่สำเร็จ</p>;

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-10">
      <h1 className="text-3xl text-[var(--foreground)] font-bold mb-6">ค้นหารถยนต์ของเรา</h1>

      {/* Filter ด้านบน */}
      <div className="mb-6">
        <CarFilters
          filters={carFilters}
          setFilters={setCarFilters}
          search={carSearch}
          setSearch={setCarSearch}
        />
      </div>

      {/* สองคอลัมน์ */}
      <div className="flex gap-6">
        {/* ฝั่งซ้าย แสดงแบรนด์ */}
        <div className="w-1/4 bg-white rounded-lg shadow p-4 overflow-auto max-h-[600px]">
          <input
            type="text"
            placeholder="ค้นหาแบรนด์..."
            className="input input-bordered w-full mb-4"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
          />

          <ul>
            {brandOptions.length > 0 ? (
              brandOptions
                .filter((brand) =>
                  brand.label.toLowerCase().includes(brandSearch.toLowerCase())
                )
                .map((brand) => (
                  <li
                    key={brand.value}
                    onClick={() => handleSelectBrand(Number(brand.value))}
                    className={`cursor-pointer flex items-center gap-3 p-2 rounded ${
                      selectedBrandId === Number(brand.value)
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <img
                      src={brand.imageUrl}
                      alt={brand.label}
                      className="w-8 h-8 object-contain rounded"
                    />
                    <span>{brand.label}</span>
                  </li>
                ))
                
            ) : (
              <p className="text-gray-500">ไม่พบแบรนด์ที่ค้นหา</p>
            )}
          </ul>
          {brandPagination && (
            <div className="mt-8 flex justify-center">
              <Pagination
                pagination={brandPagination}
                onPageChange={handleBrandPageChange}
              />
            </div>
          )}
        </div>

        {/* ฝั่งขวา แสดงรถยนต์ */}
        <div className="w-3/4">
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              ไม่พบรถยนต์ที่ตรงกับการค้นหา
            </p>
          )}

          {carPagination && (
            <div className="mt-8 flex justify-center">
              <Pagination
                pagination={carPagination}
                onPageChange={handleCarPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

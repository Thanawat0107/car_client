"use client";

import { CarSearchParams } from "@/types/RequestHelpers/CarSearchParams";
import { useDeleteCarMutation, useGetCarAllQuery } from "@/services/carApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import debounce from 'lodash/debounce';
import CarFilters from "../filters/CarFilters";
import { defaultCarSearchParams } from "./defaultCarSearchParams";

export default function CarList() {
  const [filters, setFilters] = useState<CarSearchParams>(defaultCarSearchParams);

  const [search, setSearch] = useState("");

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((val: string) => {
        setFilters((prev) => ({ ...prev, searchTerm: val, pageNumber: 1 }));
      }, 500),
    []
  );
  
useEffect(() => {
  debouncedSetSearchTerm(search);
  return () => debouncedSetSearchTerm.cancel(); // cleanup
}, [search]);

  const { data: result, error, isLoading } = useGetCarAllQuery(filters);
  const [deleteCar] = useDeleteCarMutation();
  const router = useRouter();

const handleNextPage = () => {
 const totalPages = result?.meta?.totalPages ?? 1;
const currentPage = filters.pageNumber;

  if (currentPage < totalPages) {
    setFilters((prev) => ({
      ...prev,
      pageNumber: currentPage + 1,
    }));
  }
};

const handlePrevPage = () => {
  const currentPage = filters.pageNumber ?? 1;

  if (currentPage > 1) {
    setFilters((prev) => ({
      ...prev,
      pageNumber: currentPage - 1,
    }));
  }
};

  if (isLoading) return <p className="p-4 text-gray-500">กำลังโหลด...</p>;

  if (error)
    return <p className="p-4 text-red-500">เกิดข้อผิดพลาดในการโหลดรถ</p>;

const cars = result?.result ?? [];
const pagination = result?.meta;

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <CarFilters
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {cars.length === 0 ? (
          <p className="text-gray-500 mt-4">ไม่พบข้อมูลรถ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="border p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">
                  {car.brand.name} {car.model}
                </h3>
                <p className="text-sm text-gray-600">{car.description}</p>
                <p className="text-blue-600 font-bold mt-2">
                  {car.price.toLocaleString()} บาท
                </p>
                <p className="text-sm text-gray-500">
                  ปี: {car.year} | ไมล์: {car.mileage} กม.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePrevPage}
          disabled={filters.pageNumber === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ก่อนหน้า
        </button>
        <span className="px-4 py-2 border rounded">
          หน้า {filters.pageNumber} / {result?.meta?.totalPages ?? "-"}
        </span>
        <button
          onClick={handleNextPage}
          disabled={filters.pageNumber === result?.meta?.totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>
    </>
  );
}
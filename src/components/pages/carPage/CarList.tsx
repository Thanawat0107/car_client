/* eslint-disable @next/next/no-img-element */
"use client";

import { useDeleteCarMutation, useGetCarAllQuery } from "@/services/carApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import CarFilters from "../filters/CarFilters";
import { defaultCarSearchParams } from "./defaultCarSearchParams";
import { CarSearchParams } from "@/@types/RequestHelpers/CarSearchParams";
import Pagination from "../pagination/Pagination";

const path = "/manages/car/create";

export default function CarList() {
  const [filters, setFilters] = useState<CarSearchParams>(
    defaultCarSearchParams
  );

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
    return () => debouncedSetSearchTerm.cancel();
  }, [search]);

  const { data: result, error, isLoading } = useGetCarAllQuery(filters);
  const [deleteCar] = useDeleteCarMutation();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const cars = result?.result ?? [];
  const pagination = result?.meta;

  if (isLoading) return <p className="p-4 text-gray-500">กำลังโหลด...</p>;

  if (error)
    return <p className="p-4 text-red-500">เกิดข้อผิดพลาดในการโหลดรถ</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <button
          onClick={() => router.push(path)}
          className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
        >
          เพิ่มรถใหม่
        </button>

        <CarFilters
          filters={filters}
          setFilters={setFilters}
          search={search}
          setSearch={setSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>แบรนด์</th>
              <th>ทะเบียน</th>
              <th>รุ่น</th>
              <th>ปี</th>
              <th>สี</th>
              <th>ราคา</th>
              <th>รูปภาพ</th>
              <th>ใช้งาน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => (
              <tr key={car.id}>
                <td>{index + 1}</td>
                <td className="font-medium">{car.brand?.name}</td>
                <td>{car.carRegistrationNumber || "-"}</td>
                <td>{car.model || "-"}</td>
                <td>{car.year || "-"}</td>
                <td>{car.color || "-"}</td>
                <td>{car.price.toLocaleString()} ฿</td>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={car.imageUrl || "/placeholder.png"}
                        alt="รูปภาพรถ"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={car.isUsed}
                    className="toggle toggle-success"
                    readOnly
                  />
                </td>
                <td>
                  <span
                    className={`badge ${
                      car.isApproved ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {car.isApproved ? "อนุมัติแล้ว" : "รอตรวจสอบ"}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline btn-warning"
                    // onClick={() => handleEdit(car.id)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    // onClick={() => handleDelete(car.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>ลำดับ</th>
              <th>แบรนด์</th>
              <th>ทะเบียน</th>
              <th>รุ่น</th>
              <th>ปี</th>
              <th>สี</th>
              <th>ราคา</th>
              <th>รูปภาพ</th>
              <th>ใช้งาน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {pagination && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

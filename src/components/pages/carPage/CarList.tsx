/* eslint-disable react-hooks/exhaustive-deps */
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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const createPath = "/manages/car/create";
const editPath = "/manages/car/edit/";

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

    const handleEdit = (id: number) => {
    router.push(editPath + id);
  };

    const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบรถยนต์คันนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

     if (result.isConfirmed) {
      try {
        await deleteCar(id).unwrap();
        await MySwal.fire("ลบแล้ว!", "รถยนต์คันนี้ถูกลบเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบรถยนต์คันนี้ได้", "error");
      }
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
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

        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-center">รถยนต์คันนี้</th>
                <th className="text-center">ทะเบียน</th>
                <th className="text-center">รุ่น</th>
                <th className="text-center">ปี</th>
                <th className="text-center">สี</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">รูปภาพ</th>
                <th className="text-center">ใช้งาน</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="text-center align-middle">
                  <td>{car.id}</td>
                  <td className="font-medium">{car.brand?.name ?? "-"}</td>
                  <td>{car.carRegistrationNumber ?? "-"}</td>
                  <td>{car.model ?? "-"}</td>
                  <td>{car.year ?? "-"}</td>
                  <td>{car.color ?? "-"}</td>
                  <td>{car.price.toLocaleString()} ฿</td>
                  <td>
                    <div className="avatar flex justify-center">
                      <div className="mask mask-squircle w-24 h-24">
                        <img
                          src={car.imageUrl || "/placeholder.png"}
                          alt="รูปภาพรถ"
                          className="object-cover"
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
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-warning"
                        onClick={() => handleEdit(car.id)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(car.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-center">รถยนต์คันนี้</th>
                <th className="text-center">ทะเบียน</th>
                <th className="text-center">รุ่น</th>
                <th className="text-center">ปี</th>
                <th className="text-center">สี</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">รูปภาพ</th>
                <th className="text-center">ใช้งาน</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {pagination && (
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}

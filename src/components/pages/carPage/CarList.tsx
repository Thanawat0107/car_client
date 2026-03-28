/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useDeleteCarMutation, useGetCarAllQuery } from "@/services/carApi";
import { useGetSellerByUserIdQuery } from "@/services/sellerApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CarFilters, { CarSearchParams } from "../filters/CarFilters";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { baseUrl } from "@/utility/SD";
import { carTypeLabels } from "../filters/CarFilters";
import { getEnumLabel } from "@/utility/enumHelpers";
import { useAppSelector } from "@/hooks/useAppHookState";
import { SD_Roles } from "@/@types/Status";

const MySwal = withReactContent(Swal);
const createPath = "/manages/car/create";
const editPath = "/manages/car/edit/";

export default function CarList() {
  const router = useRouter();
  const { role, userId } = useAppSelector((state) => state.auth);
  const isSeller = role === SD_Roles.Role_Seller;

  // ดึง sellerId ของ Seller ที่ login อยู่
  const { data: sellerData } = useGetSellerByUserIdQuery(userId, {
    skip: !isSeller || !userId,
  });
  const sellerId = isSeller ? sellerData?.id : undefined;

  // 1. State สำหรับฟิลเตอร์และค้นหา
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CarSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "id", // ค่าเริ่มต้นให้เรียงตามล่าสุด
  });

  // 2. ดึงข้อมูลรถ — Seller เห็นเฉพาะรถตัวเอง, Admin เห็นทั้งหมด
  const { data: result, error, isLoading } = useGetCarAllQuery(
    { pageNumber: 1, pageSize: 1000, sellerId },
    { skip: isSeller && !sellerId } // รอ sellerId โหลดก่อน
  );
  
  const [deleteCar] = useDeleteCarMutation();

  const allCars = result?.result ?? [];

  // 3. กรองข้อมูลและจัดเรียงฝั่ง Frontend ด้วย useMemo
  const filteredCars = useMemo(() => {
    let data = [...allCars];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          (c.model && c.model.toLowerCase().includes(q)) ||
          (c.carRegistrationNumber && c.carRegistrationNumber.toLowerCase().includes(q))
      );
    }

    if (filters.minPrice !== undefined) data = data.filter(c => c.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) data = data.filter(c => c.price <= filters.maxPrice!);
    if (filters.minYear !== undefined) data = data.filter(c => c.year >= filters.minYear!);
    if (filters.maxYear !== undefined) data = data.filter(c => c.year <= filters.maxYear!);
    if (filters.minMileage !== undefined) data = data.filter(c => c.mileage >= filters.minMileage!);
    if (filters.maxMileage !== undefined) data = data.filter(c => c.mileage <= filters.maxMileage!);

    if (filters.carType) data = data.filter(c => c.carType === filters.carType);
    if (filters.engineType) data = data.filter(c => c.engineType === filters.engineType);
    if (filters.gearType) data = data.filter(c => c.gearType === filters.gearType);
    if (filters.carStatus) data = data.filter(c => c.carStatus === filters.carStatus);

    switch (filters.sortBy) {
      case "price": data.sort((a, b) => a.price - b.price); break;
      case "price_desc": data.sort((a, b) => b.price - a.price); break;
      case "year": data.sort((a, b) => a.year - b.year); break;
      case "yearDesc": data.sort((a, b) => b.year - a.year); break;
      case "mileageAsc": data.sort((a, b) => a.mileage - b.mileage); break;
      case "mileageDesc": data.sort((a, b) => b.mileage - a.mileage); break;
      case "id": 
      default: 
        data.sort((a, b) => b.id - a.id); 
        break; 
    }

    return data;
  }, [allCars, filters, search]);

  // 4. แบ่งหน้า (Pagination)
  const pagedCars = useMemo(() => {
    const start = (filters.pageNumber - 1) * filters.pageSize;
    return filteredCars.slice(start, start + filters.pageSize);
  }, [filteredCars, filters.pageNumber, filters.pageSize]);

  // 5. จำลอง Meta data 
  const paginationMeta = {
    TotalCount: filteredCars.length,
    PageSize: filters.pageSize,
    CurrentPage: filters.pageNumber,
    TotalPages: Math.ceil(filteredCars.length / filters.pageSize),
    HasNext: filters.pageNumber < Math.ceil(filteredCars.length / filters.pageSize),
    HasPrevious: filters.pageNumber > 1,
  };

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

  if (isLoading) return <p className="p-4 text-gray-500 text-center font-semibold text-lg">กำลังโหลดข้อมูลรถยนต์...</p>;
  if (error) return <p className="p-4 text-red-500 text-center font-semibold text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
            className="px-6 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm whitespace-nowrap"
          >
            + เพิ่มรถใหม่
          </button>

          <CarFilters
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div className="text-sm text-gray-600 font-medium">
          พบรถทั้งหมด {filteredCars.length} คัน
        </div>

        <div className="overflow-x-auto w-full bg-white shadow-md rounded-lg">
          <table className="table w-full table-zebra">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-center">รูปภาพ</th>
                <th className="text-center">แบรนด์</th>
                <th className="text-center">รุ่น</th>
                <th className="text-center">ทะเบียน</th>
                <th className="text-center">ปี/สี</th>
                {/* 🚀 เพิ่มประเภทและไมล์ */}
                <th className="text-center">ประเภท</th>
                <th className="text-center">เลขไมล์</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">ใช้งาน</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pagedCars.length > 0 ? (
                pagedCars.map((car) => (
                  <tr key={car.id} className="text-center align-middle hover:bg-gray-50 transition-colors text-sm">
                    <td className="font-semibold text-gray-500">{car.id}</td>
                    <td>
                      <div className="avatar flex justify-center">
                        <div className="mask mask-squircle w-16 h-16 bg-gray-100 border border-gray-200">
                          <img
                            src={car.carImages && car.carImages.length > 0 ? baseUrl + car.carImages[0] : "/placeholder.png"}
                            alt="รูปภาพรถ"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-gray-700">{car.brand?.name ?? "-"}</td>
                    <td className="text-gray-600">{car.model ?? "-"}</td>
                    <td>
                      <span className="bg-white border border-gray-300 px-2 py-1 rounded shadow-sm text-xs font-mono">
                        {car.carRegistrationNumber ?? "-"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col text-xs text-gray-500">
                        <span>ปี {car.year ?? "-"}</span>
                        <span>สี {car.color ?? "-"}</span>
                      </div>
                    </td>
                    {/* 🚀 แปลง Enum เป็นภาษาไทย */}
                    <td className="text-gray-600 text-xs">{getEnumLabel(car.carType, carTypeLabels) || "-"}</td>
                    <td className="text-gray-600">{car.mileage?.toLocaleString() ?? 0} กม.</td>
                    
                    <td>
                      <div className="flex flex-col">
                        <span className="text-green-600 font-bold">{car.price.toLocaleString()} ฿</span>
                        <span className="text-xs text-blue-500">(จอง {car.bookingPrice?.toLocaleString() ?? 0} ฿)</span>
                      </div>
                    </td>
                    
                    <td>
                      <input
                        type="checkbox"
                        checked={car.isUsed}
                        className="toggle toggle-success toggle-sm"
                        readOnly
                      />
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          car.isApproved ? "badge-success text-white" : "badge-warning"
                        }`}
                      >
                        {car.isApproved ? "อนุมัติแล้ว" : "รอตรวจสอบ"}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center gap-1">
                        <button
                          className="btn btn-xs btn-outline btn-warning"
                          onClick={() => handleEdit(car.id)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => handleDelete(car.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="text-center py-10 text-gray-500 font-medium">
                    🔍 ไม่พบข้อมูลรถยนต์ที่คุณค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCars.length > 0 && (
          <Pagination pagination={paginationMeta as any} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useDeleteCarMutation, useGetCarAllQuery } from "@/services/carApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CarFilters, { CarSearchParams } from "../filters/CarFilters";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { baseUrl } from "@/utility/SD";

const MySwal = withReactContent(Swal);
const createPath = "/manages/car/create";
const editPath = "/manages/car/edit/";

export default function CarList() {
  const router = useRouter();

  // 1. State สำหรับฟิลเตอร์และค้นหา
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CarSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "id", // ค่าเริ่มต้นให้เรียงตามล่าสุด
  });

  // 2. ดึงข้อมูลรถ "ทั้งหมด" หรือก้อนใหญ่ๆ 
  // (สมมติว่ากำหนด pageSize: 1000 เพื่อดึงมาให้หมดในรอบเดียวสำหรับทำ Client-side filter)
  const { data: result, error, isLoading } = useGetCarAllQuery({ 
    pageNumber: 1, 
    pageSize: 1000 
  });
  
  const [deleteCar] = useDeleteCarMutation();

  const allCars = result?.result ?? [];

  // 3. 🚀 กรองข้อมูลและจัดเรียงฝั่ง Frontend ด้วย useMemo
  const filteredCars = useMemo(() => {
    let data = [...allCars];

    // --- กรองข้อความ (ชื่อรุ่น, ทะเบียน) ---
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          (c.model && c.model.toLowerCase().includes(q)) ||
          (c.carRegistrationNumber && c.carRegistrationNumber.toLowerCase().includes(q))
      );
    }

    // --- กรองตัวเลข (ราคา, ปี, ไมล์) ---
    if (filters.minPrice !== undefined) data = data.filter(c => c.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) data = data.filter(c => c.price <= filters.maxPrice!);
    if (filters.minYear !== undefined) data = data.filter(c => c.year >= filters.minYear!);
    if (filters.maxYear !== undefined) data = data.filter(c => c.year <= filters.maxYear!);
    if (filters.minMileage !== undefined) data = data.filter(c => c.mileage >= filters.minMileage!);
    if (filters.maxMileage !== undefined) data = data.filter(c => c.mileage <= filters.maxMileage!);

    // --- กรอง Enum (ประเภท, เครื่องยนต์, เกียร์, สถานะ) ---
    if (filters.carType) data = data.filter(c => c.carType === filters.carType);
    if (filters.engineType) data = data.filter(c => c.engineType === filters.engineType);
    if (filters.gearType) data = data.filter(c => c.gearType === filters.gearType);
    if (filters.carStatus) data = data.filter(c => c.carStatus === filters.carStatus);

    // --- จัดเรียงข้อมูล (Sorting) ---
    switch (filters.sortBy) {
      case "price": data.sort((a, b) => a.price - b.price); break;
      case "price_desc": data.sort((a, b) => b.price - a.price); break;
      case "year": data.sort((a, b) => a.year - b.year); break;
      case "yearDesc": data.sort((a, b) => b.year - a.year); break;
      case "mileageAsc": data.sort((a, b) => a.mileage - b.mileage); break;
      case "mileageDesc": data.sort((a, b) => b.mileage - a.mileage); break;
      case "id": 
      default: 
        data.sort((a, b) => b.id - a.id); // ล่าสุด (ID มากไปน้อย)
        break; 
    }

    return data;
  }, [allCars, filters, search]);

  // 4. 🚀 แบ่งหน้า (Pagination) ฝั่ง Frontend
  const pagedCars = useMemo(() => {
    const start = (filters.pageNumber - 1) * filters.pageSize;
    return filteredCars.slice(start, start + filters.pageSize);
  }, [filteredCars, filters.pageNumber, filters.pageSize]);

  // 5. จำลอง Meta data ให้ Component <Pagination /> ตัวเดิมทำงานได้
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

        {/* แสดงจำนวนผลลัพธ์การค้นหา */}
        <div className="text-sm text-gray-600 font-medium">
          พบรถทั้งหมด {filteredCars.length} คัน
        </div>

        <div className="overflow-x-auto w-full bg-white shadow-md rounded-lg">
          <table className="table w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-center">แบรนด์</th>
                <th className="text-center">ป้ายทะเบียน</th>
                <th className="text-center">รุ่น</th>
                <th className="text-center">ปีผลิต</th>
                <th className="text-center">สี</th>
                <th className="text-center">ราคา</th>
                <th className="text-center">ราคาจอง</th>
                <th className="text-center">รูปภาพ</th>
                <th className="text-center">ใช้งาน</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {/* 🚀 เปลี่ยนจาก cars.map เป็น pagedCars.map */}
              {pagedCars.length > 0 ? (
                pagedCars.map((car) => (
                  <tr key={car.id} className="text-center align-middle hover:bg-gray-50 transition-colors">
                    <td>{car.id}</td>
                    <td className="font-medium">{car.brand?.name ?? "-"}</td>
                    <td>{car.carRegistrationNumber ?? "-"}</td>
                    <td>{car.model ?? "-"}</td>
                    <td>{car.year ?? "-"}</td>
                    <td>{car.color ?? "-"}</td>
                    <td className="text-green-600 font-semibold">{car.price.toLocaleString()} ฿</td>
                    <td className="text-blue-600 font-semibold">{car.bookingPrice?.toLocaleString() ?? 0} ฿</td>
                    <td>
                      <div className="avatar flex justify-center">
                        <div className="mask mask-squircle w-20 h-20 bg-gray-100">
                          {/* 🚀 เช็ค carImages ก่อน (ตาม Interface Dto ตัวใหม่) */}
                          <img
                            src={car.carImages && car.carImages.length > 0 ? baseUrl + car.carImages[0] : "/placeholder.png"}
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
                        className="toggle toggle-success toggle-sm"
                        readOnly
                      />
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          car.isApproved ? "badge-success text-white" : "badge-warning"
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

        {/* 🚀 ส่ง paginationMeta แบบจำลองไปให้ Component ทำงานต่อได้ปกติ */}
        {filteredCars.length > 0 && (
          <Pagination pagination={paginationMeta as any} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
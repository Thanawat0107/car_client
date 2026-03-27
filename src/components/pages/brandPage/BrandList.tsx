/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useMemo, useState } from "react";
import {
  useDeleteBrandMutation,
  useGetBrandAllQuery,
} from "@/services/brandApi";
import { useRouter } from "next/navigation";
import Pagination from "../pagination/Pagination";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import BrandFilters, { BrandSearchParams } from "../filters/BrandFilters";
import { baseUrl } from "@/utility/SD";

const MySwal = withReactContent(Swal);
const createPath = "/manages/brand/create";
const editPath = "/manages/brand/edit/";

export default function BrandList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<BrandSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "id",
  });

  const { data: result, error, isLoading } = useGetBrandAllQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const [deleteBrand] = useDeleteBrandMutation();
  const allBrands = result?.result ?? [];

  const filteredBrands = useMemo(() => {
    let data = [...allBrands];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((b) => b.name && b.name.toLowerCase().includes(q));
    }

    if (filters.isUsed !== undefined) {
      data = data.filter((b) => b.isUsed === filters.isUsed);
    }

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
  }, [allBrands, filters, search]);

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

  const handleEdit = (id: number) => {
    router.push(editPath + id);
  };

  const handleDelete = async (id: number) => {
    const swalResult = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบแบรนด์นี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (swalResult.isConfirmed) {
      try {
        await deleteBrand(id).unwrap();
        await MySwal.fire("ลบแล้ว!", "แบรนด์ถูกลบเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบแบรนด์ได้", "error");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  if (isLoading) return <p className="p-4 text-gray-500 text-center font-semibold text-lg">กำลังโหลดข้อมูลแบรนด์...</p>;
  if (error) return <p className="p-4 text-red-500 text-center font-semibold text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
            className="px-6 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm whitespace-nowrap"
          >
            + เพิ่มแบรนด์ใหม่
          </button>

          <BrandFilters
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div className="text-sm text-gray-600 font-medium">
          พบแบรนด์ทั้งหมด {filteredBrands.length} รายการ
        </div>

        <div className="overflow-x-auto w-full bg-white shadow-md rounded-lg">
          <table className="table w-full table-zebra">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-center">รูปภาพ</th>
                <th className="text-left pl-6">ชื่อแบรนด์</th>
                <th className="text-center">การใช้งาน</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pagedBrands.length > 0 ? (
                pagedBrands.map((brand) => (
                  <tr key={brand.id} className="text-center align-middle hover:bg-gray-50 transition-colors text-sm">
                    <td className="font-semibold text-gray-500">{brand.id}</td>
                    <td>
                      <div className="avatar flex justify-center">
                        <div className="mask mask-squircle w-16 h-16 bg-white border border-gray-200 p-1">
                          {/* 🚀 แก้ไข: เรียกใช้ brand.carImages ตาม Interface */}
                          <img
                            src={
                              brand.carImages
                                ? `${baseUrl}${brand.carImages}`
                                : "/placeholder.png"
                            }
                            alt="รูปภาพแบรนด์"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-gray-800 text-left pl-6">{brand.name || "-"}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={brand.isUsed}
                        className="toggle toggle-success toggle-sm"
                        readOnly
                      />
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          brand.isDelete ? "badge-error text-white" : "badge-success text-white"
                        }`}
                      >
                        {brand.isDelete ? "ลบแล้ว" : "ปกติ"}
                      </span>
                    </td>
                    <td>
                      {brand.id !== undefined && (
                        <div className="flex justify-center gap-1">
                          <button
                            className="btn btn-xs btn-outline btn-warning"
                            onClick={() => handleEdit(brand.id!)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => handleDelete(brand.id!)}
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">
                    🔍 ไม่พบข้อมูลแบรนด์ที่คุณค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredBrands.length > 0 && (
          <Pagination pagination={paginationMeta as any} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
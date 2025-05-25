/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useDeleteBrandMutation,
  useGetBrandAllQuery,
} from "@/services/brandApi";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import Pagination from "../pagination/Pagination";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { BrandSearchParams } from "@/@types/RequestHelpers/BrandSearchParams";
import { defaultBrandSearchParams } from "./defaultBrandSearchParams";
import BrandFilters from "../filters/BrandFilters";
import { baseUrl } from "@/utility/SD";

const MySwal = withReactContent(Swal);
const createPath = "/manages/brand/create";

export default function BrandList() {
  const [filters, setFilters] = useState<BrandSearchParams>(
    defaultBrandSearchParams
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

  const { data: result, error, isLoading } = useGetBrandAllQuery(filters);
  const [deleteBrand] = useDeleteBrandMutation();
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(`/manages/brand/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบแบรนด์นี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
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

  const brands = result?.result ?? [];
  const pagination = result?.meta;

  if (isLoading) return <p className="p-4 text-gray-500">กำลังโหลด...</p>;
  if (error)
    return <p className="p-4 text-red-500">เกิดข้อผิดพลาดในการโหลดแบรนด์</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
          >
            เพิ่มแบรนด์ใหม่
          </button>

          <BrandFilters
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
                <th>ลำดับ</th>
                <th>ชื่อแบรนด์</th>
                <th>รูปภาพ</th>
                <th>การใช้งาน</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td className="font-medium">{brand.name || "-"}</td>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            brand.imageUrl
                              ? `${baseUrl}${brand.imageUrl}`
                              : "/placeholder.png"
                          }
                          alt="รูปภาพแบรนด์"
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={brand.isUsed}
                      className="toggle toggle-success"
                      readOnly
                    />
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        brand.isDelete ? "badge-error" : "badge-success"
                      }`}
                    >
                      {brand.isDelete ? "ลบแล้ว" : "ปกติ"}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline btn-warning"
                      onClick={() => handleEdit(brand.id)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDelete(brand.id)}
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
                <th>ชื่อแบรนด์</th>
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
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGetBrandAllQuery,
  useDeleteBrandMutation,
} from "@/services/brandApi";
import { BrandSearchParams } from "@/@types/RequestHelpers/BrandSearchParams";
import { defaultBrandSearchParams } from "./defaultBrandSearchParams";
import debounce from "lodash/debounce";
import Pagination from "../pagination/Pagination";

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

  const { data: result, isLoading, error } = useGetBrandAllQuery(filters);
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแบรนด์นี้?")) {
      try {
        await deleteBrand(id).unwrap();
        alert("ลบแบรนด์เรียบร้อยแล้ว");
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบแบรนด์");
        console.error(error);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/brand/edit/${id}`);
  };

  const brands = result?.result ?? [];
  const pagination = result?.meta;

  if (isLoading) return <p className="p-4 text-gray-500">กำลังโหลด...</p>;

  if (error)
    return <p className="p-4 text-red-500">เกิดข้อผิดพลาดในการโหลดรถ</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>ชื่อแบรนด์</th>
            <th>รูปภาพ</th>
            <th>การใช้งาน</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {brands?.map((brand) => (
            <tr key={brand.id}>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td className="font-bold">{brand.name}</td>
              <td>
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
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
              <td className="flex gap-2">
                <button
                  className="btn btn-outline btn-warning"
                  onClick={() => handleEdit(brand.id)}
                >
                  แก้ไข
                </button>
                <button
                  className="btn btn-outline btn-error"
                  disabled={isDeleting}
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
            <th></th>
            <th>ชื่อแบรนด์</th>
            <th>รูปภาพ</th>
            <th>การใช้งาน</th>
            <th>การจัดการ</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

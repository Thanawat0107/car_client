/* eslint-disable @next/next/no-img-element */
"use client";

import { useDeletebrandMutation, useGetbrandAllQuery } from "@/services/brandApi";
import { useRouter } from "next/navigation";
import React from "react";

export default function BrandList() {
  const { data: result, isLoading, isError } = useGetbrandAllQuery(null);
  const [deleteBrand, { isLoading: isDeleting }] = useDeletebrandMutation();
  const router = useRouter();

  const brands = result?.result;

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
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading brands</p>;

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
          {brands?.map((brand: any) => (
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
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/50?text=No+Image")
                      }
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

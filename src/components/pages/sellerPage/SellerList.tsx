/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useDeleteSellerMutation, useGetSellerAllQuery } from "@/services/sellerApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../pagination/Pagination";
import SellerFilters from "../filters/SellerFilters";
import { SellerSearchParams } from "@/@types/RequestHelpers/SellerSearchParams";
import { defaultSellerSearchParams } from "./defaultSellerSearchParams";

const MySwal = withReactContent(Swal);
const createPath = "/manages/seller/create";
const editPath = "/manages/seller/edit/";

export default function SellerList() {
  const [filters, setFilters] = useState<SellerSearchParams>(defaultSellerSearchParams);
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

  const { data: result, error, isLoading } = useGetSellerAllQuery(filters);
  const [deleteSeller] = useDeleteSellerMutation();
  const router = useRouter();

  const handleEdit = (id: number) => {
    router.push(editPath + id);
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบผู้ขายรายนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteSeller(id).unwrap();
        await MySwal.fire("ลบแล้ว!", "ผู้ขายถูกลบเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบผู้ขายรายนี้ได้", "error");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const sellers = result?.result ?? [];
  const pagination = result?.meta;

  if (isLoading) return <p className="p-4 text-gray-500">กำลังโหลด...</p>;
  if (error) return <p className="p-4 text-red-500">เกิดข้อผิดพลาดในการโหลดผู้ขาย</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm"
          >
            เพิ่มผู้ขายใหม่
          </button>

          <SellerFilters
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
                <th className="text-center">ชื่อผู้ใช้งาน</th>
                <th className="text-center">ชื่อ-นามสกุล</th>
                <th className="text-center">เลขบัตรประชาชน</th>
                <th className="text-center">ที่อยู่</th>
                <th className="text-center">สถานะยืนยันตัวตน</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="text-center align-middle">
                  <td>{seller.id}</td>
                  <td>{seller.user?.userName ?? "-"}</td>
                  <td>{seller.user?.fullName ?? "-"}</td>
                  <td>{seller.identityNumber}</td>
                  <td>{seller.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        seller.isVerified ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {seller.isVerified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-warning"
                        onClick={() => handleEdit(seller.id)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(seller.id)}
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
                <th className="text-center">ชื่อผู้ใช้งาน</th>
                <th className="text-center">ชื่อ-นามสกุล</th>
                <th className="text-center">เลขบัตรประชาชน</th>
                <th className="text-center">ที่อยู่</th>
                <th className="text-center">สถานะ</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
}

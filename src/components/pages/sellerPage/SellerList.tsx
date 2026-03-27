/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { useDeleteSellerMutation, useGetSellerAllQuery } from "@/services/sellerApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../pagination/Pagination";
import SellerFilters, { SellerSearchParams } from "../filters/SellerFilters";

const MySwal = withReactContent(Swal);
const createPath = "/manages/seller/create";
const editPath = "/manages/seller/edit/";

export default function SellerList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<SellerSearchParams>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "id",
  });

  const { data: result, error, isLoading } = useGetSellerAllQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const [deleteSeller] = useDeleteSellerMutation();
  const allSellers = result?.result ?? [];

  const filteredSellers = useMemo(() => {
    let data = [...allSellers];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (s) =>
          (s.user?.userName && s.user.userName.toLowerCase().includes(q)) ||
          (s.user?.fullName && s.user.fullName.toLowerCase().includes(q))
      );
    }

    if (filters.identityNumber) {
      data = data.filter((s) => s.identityNumber?.includes(filters.identityNumber!));
    }

    if (filters.address) {
      const q = filters.address.toLowerCase();
      data = data.filter((s) => s.address?.toLowerCase().includes(q));
    }

    if (filters.isVerified !== undefined) {
      data = data.filter((s) => s.isVerified === filters.isVerified);
    }

    switch (filters.sortBy) {
      case "userid":
        data.sort((a, b) => (a.userId || "").localeCompare(b.userId || ""));
        break;
      case "userid_desc":
        data.sort((a, b) => (b.userId || "").localeCompare(a.userId || ""));
        break;
      case "identitynumber":
        data.sort((a, b) => (a.identityNumber || "").localeCompare(b.identityNumber || ""));
        break;
      case "identitynumber_desc":
        data.sort((a, b) => (b.identityNumber || "").localeCompare(a.identityNumber || ""));
        break;
      case "isverified":
        data.sort((a, b) => Number(a.isVerified) - Number(b.isVerified));
        break;
      case "isverified_desc":
        data.sort((a, b) => Number(b.isVerified) - Number(a.isVerified));
        break;
      case "id":
      default:
        data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;
    }

    return data;
  }, [allSellers, filters, search]);

  const pagedSellers = useMemo(() => {
    const start = (filters.pageNumber - 1) * filters.pageSize;
    return filteredSellers.slice(start, start + filters.pageSize);
  }, [filteredSellers, filters.pageNumber, filters.pageSize]);

  const paginationMeta = {
    TotalCount: filteredSellers.length,
    PageSize: filters.pageSize,
    CurrentPage: filters.pageNumber,
    TotalPages: Math.ceil(filteredSellers.length / filters.pageSize),
    HasNext: filters.pageNumber < Math.ceil(filteredSellers.length / filters.pageSize),
    HasPrevious: filters.pageNumber > 1,
  };

  const handleEdit = (id: number) => {
    router.push(editPath + id);
  };

  const handleDelete = async (id: number) => {
    const swalResult = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบผู้ขายรายนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (swalResult.isConfirmed) {
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

  if (isLoading) return <p className="p-4 text-gray-500 text-center font-semibold text-lg">กำลังโหลดข้อมูลผู้ขาย...</p>;
  if (error) return <p className="p-4 text-red-500 text-center font-semibold text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="space-y-4 w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() => router.push(createPath)}
            className="px-6 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm whitespace-nowrap"
          >
            + เพิ่มผู้ขายใหม่
          </button>

          <SellerFilters
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* แสดงจำนวนผลลัพธ์การค้นหา */}
        <div className="text-sm text-gray-600 font-medium">
          พบผู้ขายทั้งหมด {filteredSellers.length} รายการ
        </div>

        <div className="overflow-x-auto w-full bg-white shadow-md rounded-lg">
          <table className="table w-full table-zebra">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="text-center">ลำดับ</th>
                <th className="text-left">ข้อมูลผู้ใช้</th>
                <th className="text-center">เลขบัตรประชาชน</th>
                <th className="text-left min-w-[250px]">ที่อยู่</th>
                <th className="text-center">สถานะยืนยันตัวตน</th>
                <th className="text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pagedSellers.length > 0 ? (
                pagedSellers.map((seller) => (
                  <tr key={seller.id} className="text-center align-middle hover:bg-gray-50 transition-colors text-sm">
                    <td className="font-semibold text-gray-500">{seller.id}</td>
                    <td className="text-left">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{seller.user?.userName ?? "-"}</span>
                        <span className="text-xs text-gray-500">{seller.user?.fullName ?? "-"}</span>
                      </div>
                    </td>
                    <td>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono text-xs shadow-sm border border-gray-200">
                        {seller.identityNumber || "-"}
                      </span>
                    </td>
                    <td className="text-left text-gray-600 line-clamp-2" title={seller.address}>
                      {seller.address || "-"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm ${
                          seller.isVerified ? "badge-success text-white" : "badge-warning"
                        }`}
                      >
                        {seller.isVerified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}
                      </span>
                    </td>
                    <td>
                      {seller.id !== undefined && (
                        <div className="flex justify-center gap-1">
                          <button
                            className="btn btn-xs btn-outline btn-warning"
                            onClick={() => handleEdit(seller.id!)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => handleDelete(seller.id!)}
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
                    🔍 ไม่พบข้อมูลผู้ขายที่คุณค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🚀 ส่ง paginationMeta แบบจำลองไปให้ Component */}
        {filteredSellers.length > 0 && (
          <Pagination pagination={paginationMeta as any} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}
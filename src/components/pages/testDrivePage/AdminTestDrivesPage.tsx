/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, Check, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { StatusTestDrive } from "@/@types/Status";
import {
  useDeleteTestDriveMutation,
  useGetTestDriveAllQuery,
  useUpdateTestDriveStatusMutation,
} from "@/services/testDriveApi";
import { baseUrl } from "@/utility/SD";
import Pagination from "../pagination/Pagination";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 10;

const statusConfig: Record<string, { label: string; className: string }> = {
  [StatusTestDrive.Pending]: { label: "รอดำเนินการ", className: "badge-warning" },
  [StatusTestDrive.Confirmed]: { label: "ยืนยันแล้ว", className: "badge-success text-white" },
  [StatusTestDrive.Cancel]: { label: "ยกเลิก", className: "badge-error text-white" },
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminTestDrivesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetTestDriveAllQuery({ pageNumber: 1, pageSize: 10000 });
  const [deleteTestDrive] = useDeleteTestDriveMutation();
  const [updateTestDriveStatus] = useUpdateTestDriveStatusMutation();

  const allTestDrives = data?.result ?? [];

  const filtered = useMemo(() => {
    return allTestDrives.filter((item) => {
      const matchStatus = !statusFilter || item.statusTestDrive === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.car?.model?.toLowerCase().includes(q) ||
        item.car?.brand?.name?.toLowerCase().includes(q) ||
        item.user?.fullName?.toLowerCase().includes(q) ||
        item.user?.email?.toLowerCase().includes(q) ||
        String(item.id).includes(q);

      return matchStatus && matchSearch;
    });
  }, [allTestDrives, statusFilter, search]);

  const stats = useMemo(
    () => ({
      total: allTestDrives.length,
      pending: allTestDrives.filter((item) => item.statusTestDrive === StatusTestDrive.Pending)
        .length,
      confirmed: allTestDrives.filter((item) => item.statusTestDrive === StatusTestDrive.Confirmed)
        .length,
      canceled: allTestDrives.filter((item) => item.statusTestDrive === StatusTestDrive.Cancel)
        .length,
    }),
    [allTestDrives]
  );

  const pagedTestDrives = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const paginationMeta = {
    totalCount: filtered.length,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(filtered.length / PAGE_SIZE),
  };

  const handleDelete = async (id: number) => {
    const result = await MySwal.fire({
      title: "ลบรายการทดลองขับ?",
      text: "ต้องการลบรายการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteTestDrive(id).unwrap();
        await MySwal.fire("ลบแล้ว", "ลบรายการทดลองขับเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("ผิดพลาด", "ไม่สามารถลบรายการได้", "error");
      }
    }
  };

  const handleQuickStatus = async (id: number, newStatus: string) => {
    try {
      await updateTestDriveStatus({
        testDriveId: id,
        data: { statusTestDrive: newStatus },
      }).unwrap();
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "อัปเดตสถานะแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err: any) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err?.data?.message ?? "ไม่สามารถอัปเดตสถานะได้",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 font-bold text-xl">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">รายการทดลองขับทั้งระบบ</h1>
        <p className="text-gray-500 text-sm mt-1">ดูและจัดการรายการนัดทดลองขับทั้งหมดในระบบ</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wide">ทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm text-center">
          <p className="text-yellow-500 text-xs uppercase tracking-wide">รอดำเนินการ</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm text-center">
          <p className="text-green-500 text-xs uppercase tracking-wide">ยืนยันแล้ว</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-100 shadow-sm text-center">
          <p className="text-red-400 text-xs uppercase tracking-wide">ยกเลิก</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.canceled}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600 font-medium">แสดง {filtered.length} รายการ</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="ค้นหา รุ่นรถ, ลูกค้า, อีเมล..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input input-bordered input-sm w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="select select-bordered select-sm w-full sm:w-48"
          >
            <option value="">ทุกสถานะ</option>
            {Object.values(StatusTestDrive).map((s) => (
              <option key={s} value={s}>
                {statusConfig[s]?.label ?? s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
          <CalendarCheck size={64} strokeWidth={1} />
          <p className="text-lg font-medium">ไม่มีรายการทดลองขับ</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table w-full table-zebra">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">รูปรถ</th>
                  <th className="text-center">รถยนต์</th>
                  <th className="text-center">ผู้ขาย</th>
                  <th className="text-center">ลูกค้า</th>
                  <th className="text-center">วันนัดหมาย</th>
                  <th className="text-center">สร้างเมื่อ</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {pagedTestDrives.map((item, i) => {
                  const status = statusConfig[item.statusTestDrive] ?? {
                    label: item.statusTestDrive,
                    className: "badge-ghost",
                  };
                  const mainImage =
                    item.car?.carImages?.length ? baseUrl + item.car.carImages[0] : "/placeholder.png";

                  return (
                    <tr
                      key={item.id}
                      className="text-center align-middle hover:bg-gray-50 transition-colors text-sm"
                    >
                      <td className="font-semibold text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td>
                        <div className="avatar flex justify-center">
                          <div className="mask mask-squircle w-14 h-14 bg-gray-100 border border-gray-200">
                            <img src={mainImage} alt={item.car?.model ?? "รถ"} className="object-cover" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-bold text-gray-700">
                            {item.car?.brand?.name ?? "-"} {item.car?.model ?? "-"}
                          </span>
                          <span className="text-gray-400 font-mono">{item.car?.carRegistrationNumber ?? "-"}</span>
                        </div>
                      </td>
                      <td className="text-xs text-gray-600">{item.car?.seller?.user?.userName ?? "-"}</td>
                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-medium text-gray-700">{item.user?.fullName ?? "-"}</span>
                          <span className="text-gray-400">{item.user?.email ?? "-"}</span>
                        </div>
                      </td>
                      <td className="text-xs text-gray-600">{formatDateTime(item.appointmentDate)}</td>
                      <td className="text-xs text-gray-600">{formatDateTime(item.createdAt)}</td>
                      <td>
                        <span className={`badge badge-sm ${status.className}`}>{status.label}</span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          {item.statusTestDrive !== StatusTestDrive.Pending && (
                            <button
                              onClick={() => handleQuickStatus(item.id, StatusTestDrive.Pending)}
                              className="btn btn-xs btn-warning btn-outline"
                              title={`สถานะปัจจุบัน: ${status.label}`}
                            >
                              รอดำเนินการ
                            </button>
                          )}
                          {item.statusTestDrive !== StatusTestDrive.Confirmed && (
                            <button
                              onClick={() => handleQuickStatus(item.id, StatusTestDrive.Confirmed)}
                              className="btn btn-xs btn-success gap-1"
                              title={`สถานะปัจจุบัน: ${status.label}`}
                            >
                              <Check size={12} />
                              ยืนยัน
                            </button>
                          )}
                          {item.statusTestDrive !== StatusTestDrive.Cancel && (
                            <button
                              onClick={() => handleQuickStatus(item.id, StatusTestDrive.Cancel)}
                              className="btn btn-xs btn-error gap-1"
                              title={`สถานะปัจจุบัน: ${status.label}`}
                            >
                              <X size={12} />
                              ยกเลิก
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-xs btn-error btn-outline gap-1"
                          >
                            <Trash2 size={12} />
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={paginationMeta}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useDeleteBookingMutation, useGetBookingAllQuery } from "@/services/bookingsApi";
import { BookingStatus } from "@/@types/Status";
import { baseUrl } from "@/utility/SD";
import { useMemo, useState } from "react";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CalendarCheck } from "lucide-react";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 10;

const statusConfig: Record<string, { label: string; className: string }> = {
  [BookingStatus.Pending]:        { label: "รอดำเนินการ",  className: "badge-warning" },
  [BookingStatus.PendingPayment]: { label: "รอชำระเงิน",   className: "badge-info text-white" },
  [BookingStatus.Confirmed]:      { label: "ยืนยันแล้ว",   className: "badge-success text-white" },
  [BookingStatus.Expired]:        { label: "หมดอายุ",      className: "badge-ghost" },
  [BookingStatus.Canceled]:       { label: "ยกเลิก",       className: "badge-error text-white" },
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric", month: "short", day: "numeric",
  });
};

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // ดึงทุก booking (ไม่ filter userId/sellerId)
  const { data, isLoading, error } = useGetBookingAllQuery(
    { pageNumber: 1, pageSize: 10000 }
  );
  const [deleteBooking] = useDeleteBookingMutation();

  const allBookings = data?.result ?? [];

  const filtered = useMemo(() => {
    return allBookings.filter((b) => {
      const matchStatus = !statusFilter || b.bookingStatus === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.car?.model?.toLowerCase().includes(q) ||
        b.car?.brand?.name?.toLowerCase().includes(q) ||
        b.user?.fullName?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        String(b.id).includes(q);
      return matchStatus && matchSearch;
    });
  }, [allBookings, statusFilter, search]);

  const stats = useMemo(() => ({
    total:          allBookings.length,
    pending:        allBookings.filter((b) => b.bookingStatus === BookingStatus.Pending).length,
    pendingPayment: allBookings.filter((b) => b.bookingStatus === BookingStatus.PendingPayment).length,
    confirmed:      allBookings.filter((b) => b.bookingStatus === BookingStatus.Confirmed).length,
    canceled:       allBookings.filter((b) => b.bookingStatus === BookingStatus.Canceled).length,
  }), [allBookings]);

  const pagedBookings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const paginationMeta = {
    totalCount: filtered.length,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(filtered.length / PAGE_SIZE),
  };

  const handleDelete = async (bookingId: number) => {
    const result = await MySwal.fire({
      title: "ลบรายการจอง?",
      text: "ต้องการลบรายการจองนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        await deleteBooking(bookingId).unwrap();
        await MySwal.fire("ลบแล้ว!", "ลบรายการจองเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบรายการจองได้", "error");
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 font-bold text-xl">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">รายการจองทั้งระบบ</h1>
        <p className="text-gray-500 text-sm mt-1">ดูและจัดการการจองรถยนต์ทุกรายการในระบบ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wide">ทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm text-center">
          <p className="text-yellow-500 text-xs uppercase tracking-wide">รอดำเนินการ</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm text-center">
          <p className="text-blue-500 text-xs uppercase tracking-wide">รอชำระเงิน</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingPayment}</p>
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

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600 font-medium">แสดง {filtered.length} รายการ</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="ค้นหา ชื่อรถ, ลูกค้า, อีเมล..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input input-bordered input-sm w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="select select-bordered select-sm w-full sm:w-48"
          >
            <option value="">ทุกสถานะ</option>
            {Object.values(BookingStatus).map((s) => (
              <option key={s} value={s}>{statusConfig[s]?.label ?? s}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
          <CalendarCheck size={64} strokeWidth={1} />
          <p className="text-lg font-medium">ไม่มีรายการจอง</p>
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
                  <th className="text-center">วันที่จอง</th>
                  <th className="text-center">วันหมดอายุ</th>
                  <th className="text-center">ค่ามัดจำ</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {pagedBookings.map((booking, i) => {
                  const status = statusConfig[booking.bookingStatus] ?? {
                    label: booking.bookingStatus,
                    className: "badge-ghost",
                  };
                  const car = booking.car;
                  const mainImage = car?.carImages?.length
                    ? baseUrl + car.carImages[0]
                    : "/placeholder.png";
                  const canDelete =
                    booking.bookingStatus === BookingStatus.Expired ||
                    booking.bookingStatus === BookingStatus.Canceled;

                  return (
                    <tr key={booking.id} className="text-center align-middle hover:bg-gray-50 transition-colors text-sm">
                      <td className="font-semibold text-gray-500">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>

                      <td>
                        <div className="avatar flex justify-center">
                          <div className="mask mask-squircle w-14 h-14 bg-gray-100 border border-gray-200">
                            <img src={mainImage} alt={car?.model ?? "รถ"} className="object-cover" />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-bold text-gray-700">{car?.brand?.name ?? "-"} {car?.model ?? "-"}</span>
                          <span className="text-gray-400 font-mono">{car?.carRegistrationNumber ?? "-"}</span>
                          <span className="text-gray-400">ปี {car?.year ?? "-"}</span>
                        </div>
                      </td>

                      <td className="text-xs text-gray-600">
                        {car?.seller?.user?.userName ?? "-"}
                      </td>

                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-medium text-gray-700">{booking.user?.fullName ?? "-"}</span>
                          <span className="text-gray-400">{booking.user?.email ?? "-"}</span>
                        </div>
                      </td>

                      <td className="text-xs text-gray-600">{formatDate(booking.reservedAt)}</td>
                      <td className="text-xs text-gray-600">{formatDate(booking.expiryAt)}</td>

                      <td className="text-green-600 font-bold text-sm">
                        {car?.bookingPrice?.toLocaleString() ?? 0} ฿
                      </td>

                      <td>
                        <span className={`badge badge-sm ${status.className}`}>{status.label}</span>
                      </td>

                      <td>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="btn btn-xs btn-error btn-outline"
                          >
                            ลบ
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            pagination={paginationMeta}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
        </>
      )}
    </div>
  );
}

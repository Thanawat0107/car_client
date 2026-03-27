/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCancelBookingMutation,
  useGetBookingAllQuery,
} from "@/services/bookingsApi";
import { useAppSelector } from "@/hooks/useAppHookState";
import { BookingStatus } from "@/@types/Status";
import { baseUrl } from "@/utility/SD";
import { useMemo, useState } from "react";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CalendarDays, Clock, XCircle } from "lucide-react";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 6;

const statusConfig: Record<string, { label: string; className: string }> = {
  [BookingStatus.Pending]:        { label: "รอดำเนินการ",  className: "badge-warning" },
  [BookingStatus.PendingPayment]: { label: "รอชำระเงิน",   className: "badge-info text-white" },
  [BookingStatus.Confirmed]:      { label: "ยืนยันแล้ว",   className: "badge-success text-white" },
  [BookingStatus.Expired]:        { label: "หมดอายุ",      className: "badge-ghost" },
  [BookingStatus.Canceled]:       { label: "ยกเลิก",       className: "badge-error text-white" },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MyBookingsPage() {
  const { userId } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetBookingAllQuery(
    { userId, pageNumber: 1, pageSize: 1000 },
    { skip: !userId }
  );
  const [cancelBooking] = useCancelBookingMutation();

  const allBookings = data?.result ?? [];

  const pagedBookings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allBookings.slice(start, start + PAGE_SIZE);
  }, [allBookings, page]);

  const paginationMeta = {
    totalCount: allBookings.length,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(allBookings.length / PAGE_SIZE),
  };

  const handleCancel = async (bookingId: number) => {
    const result = await MySwal.fire({
      title: "ยืนยันการยกเลิก?",
      text: "คุณต้องการยกเลิกการจองนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ยกเลิก",
      cancelButtonText: "ไม่",
    });
    if (result.isConfirmed) {
      try {
        await cancelBooking(bookingId).unwrap();
        await MySwal.fire("สำเร็จ!", "ยกเลิกการจองเรียบร้อยแล้ว", "success");
      } catch {
        await MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถยกเลิกการจองได้", "error");
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">การจองของฉัน</h1>
        <p className="text-gray-500 text-sm mt-1">
          รายการจองรถยนต์ทั้งหมดของคุณ ({allBookings.length} รายการ)
        </p>
      </div>

      {allBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
          <CalendarDays size={64} strokeWidth={1} />
          <p className="text-lg font-medium">ยังไม่มีรายการจอง</p>
          <p className="text-sm">คุณยังไม่ได้จองรถยนต์คันใด</p>
        </div>
      ) : (
        <>
          {/* Booking Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pagedBookings.map((booking) => {
              const status =
                statusConfig[booking.bookingStatus] ?? {
                  label: booking.bookingStatus,
                  className: "badge-ghost",
                };
              const car = booking.car;
              const mainImage =
                car?.carImages?.length
                  ? baseUrl + car.carImages[0]
                  : "/placeholder.png";
              const canCancel =
                booking.bookingStatus === BookingStatus.Pending ||
                booking.bookingStatus === BookingStatus.PendingPayment;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Car Image + Status Badge */}
                  <div className="relative">
                    <img
                      src={mainImage}
                      alt={car?.model ?? "รถยนต์"}
                      className="w-full h-44 object-cover bg-gray-100"
                    />
                    <span
                      className={`badge ${status.className} absolute top-3 right-3 font-semibold text-xs px-3 py-1`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-grow gap-3">
                    {/* Car Info */}
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                        {car?.brand?.name ?? "-"}
                      </p>
                      <h2 className="text-lg font-bold text-gray-800 leading-tight mt-0.5">
                        {car?.model ?? "ไม่ระบุรุ่น"}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">
                        ทะเบียน: {car?.carRegistrationNumber ?? "-"}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-primary shrink-0" />
                        <span>
                          จองเมื่อ:{" "}
                          <span className="font-medium">
                            {formatDate(booking.reservedAt)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-400 shrink-0" />
                        <span>
                          หมดอายุ:{" "}
                          <span className="font-medium">
                            {formatDate(booking.expiryAt)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Footer: Price + Cancel Button */}
                    <div className="flex justify-between items-center pt-2 mt-auto border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">ค่ามัดจำ</p>
                        <p className="text-primary font-bold text-base">
                          {car?.bookingPrice?.toLocaleString() ?? 0} ฿
                        </p>
                      </div>
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="btn btn-sm btn-error btn-outline gap-1"
                        >
                          <XCircle size={14} />
                          ยกเลิก
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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

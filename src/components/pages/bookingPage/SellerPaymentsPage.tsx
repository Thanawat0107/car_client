/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useGetPaymentAllQuery,
  useConfirmPaymentMutation,
} from "@/services/paymentsApi";
import { useGetSellerAllQuery } from "@/services/sellerApi";
import { useAppSelector } from "@/hooks/useAppHookState";
import { PaymentStatus, PaymentMethod } from "@/@types/Status";
import { baseUrl } from "@/utility/SD";
import { useMemo, useState } from "react";
import Pagination from "../pagination/Pagination";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { BadgeCheck, ImageOff } from "lucide-react";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 10;

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  [PaymentStatus.Pending]:    { label: "รอแนบสลิป",       className: "badge-warning" },
  [PaymentStatus.Verifying]:  { label: "รอตรวจสอบสลิป",   className: "badge-info text-white" },
  [PaymentStatus.Paid]:       { label: "ชำระแล้ว",         className: "badge-success text-white" },
  [PaymentStatus.Failed]:     { label: "ล้มเหลว",          className: "badge-error text-white" },
  [PaymentStatus.Refunded]:   { label: "คืนเงินแล้ว",      className: "badge-ghost" },
};

const methodLabels: Record<string, string> = {
  [PaymentMethod.PromptPay]:     "พร้อมเพย์",
  [PaymentMethod.QR]:            "QR Code",
  [PaymentMethod.BankTransfer]:  "โอนธนาคาร",
  [PaymentMethod.CreditCard]:    "บัตรเครดิต",
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SellerPaymentsPage() {
  const { userId } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [previewSlip, setPreviewSlip] = useState<string | null>(null);

  // หา sellerId จาก userId
  const { data: sellerData, isLoading: isLoadingSeller } = useGetSellerAllQuery(
    { pageNumber: 1, pageSize: 1000 },
    { skip: !userId }
  );
  const currentSeller = sellerData?.result.find((s) => s.userId === userId);
  const sellerId = currentSeller?.id;

  const { data, isLoading: isLoadingPayments, error } = useGetPaymentAllQuery(
    { sellerId, pageNumber: 1, pageSize: 1000 },
    { skip: !sellerId }
  );
  const [confirmPayment] = useConfirmPaymentMutation();

  const allPayments = data?.result ?? [];

  // สรุปสถิติ
  const stats = useMemo(() => ({
    total: allPayments.length,
    verifying: allPayments.filter((p) => p.paymentStatus === PaymentStatus.Verifying).length,
    paid: allPayments.filter((p) => p.paymentStatus === PaymentStatus.Paid).length,
    totalRevenue: allPayments
      .filter((p) => p.paymentStatus === PaymentStatus.Paid)
      .reduce((sum, p) => sum + p.totalPrice, 0),
  }), [allPayments]);

  const filtered = useMemo(() => {
    if (!statusFilter) return allPayments;
    return allPayments.filter((p) => p.paymentStatus === statusFilter);
  }, [allPayments, statusFilter]);

  const pagedPayments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const paginationMeta = {
    totalCount: filtered.length,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    pageCount: Math.ceil(filtered.length / PAGE_SIZE),
  };

  const handleConfirm = async (paymentId: number, model: string) => {
    const result = await MySwal.fire({
      title: "ยืนยันการชำระเงิน?",
      html: `ยืนยันว่าได้รับเงินค่ามัดจำรถ <b>${model}</b> แล้ว?<br/><span class="text-sm text-gray-500">การจองจะเปลี่ยนเป็นสถานะ "ยืนยันแล้ว"</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ใช่, ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });
    if (!result.isConfirmed) return;
    try {
      await confirmPayment(paymentId).unwrap();
      await MySwal.fire("ยืนยันแล้ว!", "การชำระเงินได้รับการยืนยันเรียบร้อย", "success");
    } catch (err: any) {
      await MySwal.fire("เกิดข้อผิดพลาด", err?.data?.message ?? "ไม่สามารถยืนยันได้", "error");
    }
  };

  const isLoading = isLoadingSeller || isLoadingPayments;

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (!sellerId)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 font-bold text-xl">
        ไม่พบข้อมูลผู้ขาย
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการการชำระเงิน</h1>
        <p className="text-gray-500 text-sm mt-1">ตรวจสอบและยืนยันสลิปการโอนเงินค่ามัดจำ</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wide">ทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm text-center">
          <p className="text-blue-500 text-xs uppercase tracking-wide">รอตรวจสอบสลิป</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.verifying}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm text-center">
          <p className="text-green-500 text-xs uppercase tracking-wide">ชำระแล้ว</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm text-center">
          <p className="text-emerald-500 text-xs uppercase tracking-wide">รายรับรวม (มัดจำ)</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {stats.totalRevenue.toLocaleString()} ฿
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600 font-medium">แสดง {filtered.length} รายการ</p>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="select select-bordered select-sm w-full sm:w-56"
        >
          <option value="">ทุกสถานะ</option>
          {Object.values(PaymentStatus).map((s) => (
            <option key={s} value={s}>{paymentStatusConfig[s]?.label ?? s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-gray-400 gap-4">
          <BadgeCheck size={64} strokeWidth={1} />
          <p className="text-lg font-medium">ไม่มีรายการชำระเงิน</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="table w-full table-zebra">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-center">#</th>
                  <th className="text-center">รถยนต์</th>
                  <th className="text-center">ลูกค้า</th>
                  <th className="text-center">วิธีชำระ</th>
                  <th className="text-center">ยอดชำระ</th>
                  <th className="text-center">สลิป</th>
                  <th className="text-center">วันที่สร้าง</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {pagedPayments.map((payment, i) => {
                  const status = paymentStatusConfig[payment.paymentStatus] ?? {
                    label: payment.paymentStatus,
                    className: "badge-ghost",
                  };
                  const booking = payment.booking;
                  const car = booking?.car;
                  const user = booking?.user;
                  const slipUrl = payment.slipCarImages
                    ? baseUrl + payment.slipCarImages
                    : null;

                  return (
                    <tr
                      key={payment.id}
                      className="text-center align-middle hover:bg-gray-50 transition-colors text-sm"
                    >
                      <td className="font-semibold text-gray-500">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>

                      {/* รถยนต์ */}
                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-bold text-gray-700">
                            {car?.brand?.name ?? "-"} {car?.model ?? "-"}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {car?.carRegistrationNumber ?? "-"}
                          </span>
                        </div>
                      </td>

                      {/* ลูกค้า */}
                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-medium text-gray-700">
                            {user?.fullName ?? "-"}
                          </span>
                          <span className="text-gray-400">{user?.phoneNumber ?? "-"}</span>
                        </div>
                      </td>

                      {/* วิธีชำระ */}
                      <td className="text-xs text-gray-600">
                        {methodLabels[payment.paymentMethod] ?? payment.paymentMethod}
                      </td>

                      {/* ยอดชำระ */}
                      <td className="text-green-600 font-bold">
                        {payment.totalPrice.toLocaleString()} ฿
                      </td>

                      {/* สลิป */}
                      <td>
                        {slipUrl ? (
                          <button
                            onClick={() => setPreviewSlip(slipUrl)}
                            className="btn btn-xs btn-outline btn-info"
                          >
                            ดูสลิป
                          </button>
                        ) : (
                          <span className="flex justify-center text-gray-300">
                            <ImageOff size={18} />
                          </span>
                        )}
                      </td>

                      {/* วันที่ */}
                      <td className="text-xs text-gray-600">
                        {formatDate(payment.createdAt)}
                      </td>

                      {/* สถานะ */}
                      <td>
                        <span className={`badge badge-sm ${status.className}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* ดำเนินการ */}
                      <td>
                        {payment.paymentStatus === PaymentStatus.Verifying && (
                          <button
                            onClick={() =>
                              handleConfirm(
                                payment.id,
                                `${car?.brand?.name ?? ""} ${car?.model ?? ""}`
                              )
                            }
                            className="btn btn-xs btn-success text-white gap-1"
                          >
                            <BadgeCheck size={12} />
                            ยืนยัน
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
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}

      {/* Slip Preview Modal */}
      {previewSlip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setPreviewSlip(null)}
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-gray-800">สลิปการโอนเงิน</p>
              <button
                onClick={() => setPreviewSlip(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
            <img
              src={previewSlip}
              alt="slip"
              className="w-full rounded-xl object-contain max-h-[70vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

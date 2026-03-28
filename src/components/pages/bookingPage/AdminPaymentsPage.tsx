/* eslint-disable @next/next/no-img-element */
"use client";

import { useGetPaymentAllQuery } from "@/services/paymentsApi";
import { PaymentStatus, PaymentMethod } from "@/@types/Status";
import { baseUrl } from "@/utility/SD";
import { useMemo, useState } from "react";
import Pagination from "../pagination/Pagination";
import { BadgeCheck, ImageOff } from "lucide-react";

const PAGE_SIZE = 10;

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  [PaymentStatus.Pending]:   { label: "รอแนบสลิป",       className: "badge-warning" },
  [PaymentStatus.Verifying]: { label: "รอตรวจสอบสลิป",   className: "badge-info text-white" },
  [PaymentStatus.Paid]:      { label: "ชำระแล้ว",         className: "badge-success text-white" },
  [PaymentStatus.Failed]:    { label: "ล้มเหลว",          className: "badge-error text-white" },
  [PaymentStatus.Refunded]:  { label: "คืนเงินแล้ว",      className: "badge-ghost" },
};

const methodLabels: Record<string, string> = {
  [PaymentMethod.PromptPay]:    "พร้อมเพย์",
  [PaymentMethod.QR]:           "QR Code",
  [PaymentMethod.BankTransfer]: "โอนธนาคาร",
  [PaymentMethod.CreditCard]:   "บัตรเครดิต (Stripe)",
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [previewSlip, setPreviewSlip] = useState<string | null>(null);

  // ดึงทุก payment (ไม่ filter sellerId/userId)
  const { data, isLoading, error } = useGetPaymentAllQuery(
    { pageNumber: 1, pageSize: 10000 }
  );

  const allPayments = data?.result ?? [];

  const stats = useMemo(() => ({
    total:        allPayments.length,
    verifying:    allPayments.filter((p) => p.paymentStatus === PaymentStatus.Verifying).length,
    paid:         allPayments.filter((p) => p.paymentStatus === PaymentStatus.Paid).length,
    refunded:     allPayments.filter((p) => p.paymentStatus === PaymentStatus.Refunded).length,
    totalRevenue: allPayments
      .filter((p) => p.paymentStatus === PaymentStatus.Paid)
      .reduce((sum, p) => sum + p.totalPrice, 0),
  }), [allPayments]);

  const filtered = useMemo(() => {
    return allPayments.filter((p) => {
      const matchStatus = !statusFilter || p.paymentStatus === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.booking?.car?.model?.toLowerCase().includes(q) ||
        p.booking?.car?.brand?.name?.toLowerCase().includes(q) ||
        p.booking?.user?.fullName?.toLowerCase().includes(q) ||
        p.booking?.user?.email?.toLowerCase().includes(q) ||
        p.transactionRef?.toLowerCase().includes(q) ||
        String(p.id).includes(q);
      return matchStatus && matchSearch;
    });
  }, [allPayments, statusFilter, search]);

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
        <h1 className="text-2xl font-bold text-gray-800">รายการชำระเงินทั้งระบบ</h1>
        <p className="text-gray-500 text-sm mt-1">ดูรายการชำระเงินทุกรายการจากทุก Seller</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wide">ทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm text-center">
          <p className="text-blue-500 text-xs uppercase tracking-wide">รอตรวจสลิป</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.verifying}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm text-center">
          <p className="text-green-500 text-xs uppercase tracking-wide">ชำระแล้ว</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.paid}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <p className="text-gray-400 text-xs uppercase tracking-wide">คืนเงินแล้ว</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{stats.refunded}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm text-center">
          <p className="text-emerald-500 text-xs uppercase tracking-wide">รายรับรวม</p>
          <p className="text-lg font-bold text-emerald-700 mt-1">{stats.totalRevenue.toLocaleString()} ฿</p>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600 font-medium">แสดง {filtered.length} รายการ</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="ค้นหา รถ, ลูกค้า, Transaction ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input input-bordered input-sm w-full sm:w-72"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="select select-bordered select-sm w-full sm:w-52"
          >
            <option value="">ทุกสถานะ</option>
            {Object.values(PaymentStatus).map((s) => (
              <option key={s} value={s}>{paymentStatusConfig[s]?.label ?? s}</option>
            ))}
          </select>
        </div>
      </div>

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
                  <th className="text-center">ผู้ขาย</th>
                  <th className="text-center">ลูกค้า</th>
                  <th className="text-center">วิธีชำระ</th>
                  <th className="text-center">ยอดชำระ</th>
                  <th className="text-center">Transaction ID</th>
                  <th className="text-center">สลิป</th>
                  <th className="text-center">วันที่</th>
                  <th className="text-center">สถานะ</th>
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
                  const slipUrl = payment.slipCarImages ? baseUrl + payment.slipCarImages : null;

                  return (
                    <tr key={payment.id} className="text-center align-middle hover:bg-gray-50 transition-colors text-sm">
                      <td className="font-semibold text-gray-500">
                        {(page - 1) * PAGE_SIZE + i + 1}
                      </td>

                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-bold text-gray-700">{car?.brand?.name ?? "-"} {car?.model ?? "-"}</span>
                          <span className="text-gray-400 font-mono">{car?.carRegistrationNumber ?? "-"}</span>
                        </div>
                      </td>

                      <td className="text-xs text-gray-600">
                        {car?.seller?.user?.userName ?? "-"}
                      </td>

                      <td>
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="font-medium text-gray-700">{user?.fullName ?? "-"}</span>
                          <span className="text-gray-400">{user?.email ?? "-"}</span>
                        </div>
                      </td>

                      <td className="text-xs text-gray-600">
                        {methodLabels[payment.paymentMethod] ?? payment.paymentMethod}
                      </td>

                      <td className="text-green-600 font-bold">
                        {payment.totalPrice.toLocaleString()} ฿
                      </td>

                      <td className="text-xs font-mono text-gray-400 max-w-[120px] truncate">
                        {payment.transactionRef ? (
                          <span title={payment.transactionRef}>{payment.transactionRef.slice(0, 16)}…</span>
                        ) : "-"}
                      </td>

                      <td>
                        {slipUrl ? (
                          <button onClick={() => setPreviewSlip(slipUrl)} className="btn btn-xs btn-outline btn-info">
                            ดูสลิป
                          </button>
                        ) : (
                          <span className="flex justify-center text-gray-300"><ImageOff size={18} /></span>
                        )}
                      </td>

                      <td className="text-xs text-gray-600">{formatDate(payment.createdAt)}</td>

                      <td>
                        <span className={`badge badge-sm ${status.className}`}>{status.label}</span>
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
              <button onClick={() => setPreviewSlip(null)} className="btn btn-ghost btn-sm btn-circle">✕</button>
            </div>
            <img src={previewSlip} alt="slip" className="w-full rounded-xl object-contain max-h-[70vh]" />
          </div>
        </div>
      )}
    </div>
  );
}

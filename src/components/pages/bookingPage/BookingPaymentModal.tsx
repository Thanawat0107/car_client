/* eslint-disable @next/next/no-img-element */
"use client";

import { useCreatePaymentMutation } from "@/services/paymentsApi";
import { PaymentMethod } from "@/@types/Status";
import { Booking } from "@/@types/Dto";
import { X, Upload, CheckCircle } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import StripeCheckoutForm from "./StripeCheckoutForm";

const MySwal = withReactContent(Swal);

interface Props {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "transfer" | "card";

const transferMethods = [
  { value: PaymentMethod.PromptPay,    label: "พร้อมเพย์",   icon: "💳" },
  { value: PaymentMethod.QR,           label: "QR Code",        icon: "📱" },
  { value: PaymentMethod.BankTransfer, label: "โอนธนาคาร",  icon: "🏦" },
];

// ข้อมูลบัญชีรับเงิน (ปรับตามจริง)
const bankInfo = {
  [PaymentMethod.PromptPay]: {
    line1: "เลขพร้อมเพย์: 089-123-4567",
    line2: "ชื่อ: บริษัท คาร์ แมเนจเม้นท์ จำกัด",
  },
  [PaymentMethod.QR]: {
    line1: "สแกน QR Code ด้านล่าง",
    line2: "KBank / SCB / PromptPay",
  },
  [PaymentMethod.BankTransfer]: {
    line1: "ธนาคารกสิกรไทย เลขที่ 123-4-56789-0",
    line2: "ชื่อบัญชี: บริษัท คาร์ แมเนจเม้นท์ จำกัด",
  },
};

export default function BookingPaymentModal({ booking, onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("transfer");
  const [selectedMethod, setSelectedMethod] = useState<string>(PaymentMethod.PromptPay);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPayment] = useCreatePaymentMutation();

  const totalPrice = booking.car?.bookingPrice ?? 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      MySwal.fire("ไฟล์ไม่ถูกต้อง", "กรุณาอัปโหลดรูปภาพสลิปเท่านั้น", "warning");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      MySwal.fire("ไฟล์ใหญ่เกิน", "ขนาดไฟล์ต้องไม่เกิน 5 MB", "warning");
      return;
    }
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleSlipSubmit = async () => {
    if (!slipFile) {
      MySwal.fire("กรุณาแนบสลิป", "คุณต้องอัปโหลดสลิปการโอนเงินก่อน", "warning");
      return;
    }
    try {
      setIsSubmitting(true);
      await createPayment({
        bookingId: booking.id,
        totalPrice,
        paymentMethod: selectedMethod,
        slipImage: slipFile,
      }).unwrap();

      await MySwal.fire({
        icon: "success",
        title: "ส่งหลักฐานการชำระเงินแล้ว!",
        html: "ระบบได้รับสลิปของคุณแล้ว<br/>กรุณารอผู้ขายตรวจสอบและยืนยัน",
        confirmButtonText: "ดูรายการจองของฉัน",
      });
      onSuccess();
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "ส่งสลิปไม่สำเร็จ",
        text: err?.data?.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const info = bankInfo[selectedMethod as keyof typeof bankInfo];

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">ชำระเงินมัดจำ</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {booking.car?.brand?.name} {booking.car?.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ─── ยอดที่ต้องชำระ ─── */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">ยอดที่ต้องชำระ (ค่ามัดจำ)</p>
              <p className="text-3xl font-black text-emerald-700 mt-0.5">
                {totalPrice.toLocaleString()} ฿
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <p>หมายเลขจอง</p>
              <p className="font-mono font-bold text-gray-600">#{booking.id}</p>
            </div>
          </div>

          {/* ─── แท็บเลือกวิธีชำระ ─── */}
          <div className="flex gap-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab("transfer")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition ${
                activeTab === "transfer"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              💸 โอนเงิน / สลิป
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition ${
                activeTab === "card"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              💳 บัตรเครดิต (Stripe)
            </button>
          </div>

          {/* ─── Tab: โอนเงิน / สลิป ─── */}
          {activeTab === "transfer" && (<>
          {/* เลือกช่องทางชำระเงิน */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              เลือกช่องทางชำระเงิน
            </p>
            <div className="grid grid-cols-3 gap-2">
              {transferMethods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setSelectedMethod(m.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition ${
                    selectedMethod === m.value
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ข้อมูลบัญชีผู้รับ */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              ข้อมูลสำหรับโอนเงิน
            </p>
            {selectedMethod === PaymentMethod.QR ? (
              <div className="flex justify-center py-2">
                {/* QR placeholder – เปลี่ยนเป็นรูป QR จริงได้ */}
                <div className="w-36 h-36 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center p-2">
                  วาง QR Code<br />ที่นี่
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-800">{info.line1}</p>
                <p className="text-sm text-gray-600">{info.line2}</p>
              </>
            )}
            <p className="text-xs text-orange-500 font-medium pt-1">
              ⚠️ กรุณาโอนเงินตามยอดที่ระบุไว้เท่านั้น
            </p>
          </div>

          {/* อัปโหลดสลิป */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              แนบสลิปการโอนเงิน <span className="text-red-500">*</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {slipPreview ? (
              <div className="relative">
                <img
                  src={slipPreview}
                  alt="slip preview"
                  className="w-full max-h-52 object-contain rounded-xl border border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlipFile(null);
                    setSlipPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-2 mt-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  แนบสลิปแล้ว: {slipFile?.name}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition"
              >
                <Upload size={28} />
                <span className="text-sm font-medium">คลิกเพื่ออัปโหลดสลิป</span>
                <span className="text-xs">PNG, JPG ขนาดไม่เกิน 5MB</span>
              </button>
            )}
          </div>

          {/* ปุ่ม Submit */}
          <button
            type="button"
            onClick={handleSlipSubmit}
            disabled={!slipFile || isSubmitting}
            className="btn w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "ส่งหลักฐานการชำระเงิน"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            ผู้ขายจะตรวจสอบสลิปและยืนยันการชำระเงินภายใน 1–2 ชั่วโมง
          </p>
          </>)}

          {/* ─── Tab: Stripe Credit Card ─── */}
          {activeTab === "card" && (
            <StripeCheckoutForm booking={booking} onSuccess={onSuccess} />
          )}

        </div>
      </div>
    </div>
  );
}

"use client";

import { Booking } from "@/@types/Dto";
import { X } from "lucide-react";
import StripeCheckoutForm from "./StripeCheckoutForm";

interface Props {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingPaymentModal({ booking, onClose, onSuccess }: Props) {
  const totalPrice = booking.car?.bookingPrice ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">ชำระเงินมัดจำ</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {booking.car?.brand?.name} {booking.car?.model}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
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

          <StripeCheckoutForm booking={booking} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
